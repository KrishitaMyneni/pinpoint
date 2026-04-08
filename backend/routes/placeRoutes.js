const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const SavedPlace = require('../models/SavedPlace');
const mongoose = require('mongoose');
const { SEED_DATA } = require('../data/seedData');

// ─── GEOGRAPHIC DEFAULTS (Hyderabad Center) ───
const DEFAULT_CENTER = { lat: 17.3850, lng: 78.4867 };

// ─── CATEGORY SUBTYPES (backend mirror of frontend config) ───
const CATEGORY_SUBTYPES = {
  'Restaurants':     ['Restaurants', 'Cafe'],
  'Fast Food':       ['Fast Food', 'Restaurants'],
  'Parks':           ['Parks', 'Scenic Places'],
  'Scenic Places':   ['Scenic Places', 'Parks', 'Hidden Gems'],
  'Libraries':       ['Libraries', 'Study Spots'],
  'Study Spots':     ['Study Spots', 'Libraries', 'Cafe'],
  'Shopping Spots':  ['Shopping Spots', 'Hangout Places'],
  'Hangout Places':  ['Hangout Places', 'Shopping Spots', 'Cafe', 'Parks'],
  'Hidden Gems':     ['Hidden Gems', 'Scenic Places'],
  'Bakeries':        ['Bakeries', 'Dessert Places', 'Cafe'],
  'Dessert Places':  ['Dessert Places', 'Bakeries', 'Cafe'],
  'Cafe':            ['Cafe', 'Bakeries', 'Study Spots'],
};

const INTENT_CATEGORIES = {
  work:    ['Study Spots', 'Libraries', 'Cafe'],
  chill:   ['Parks', 'Scenic Places', 'Cafe', 'Hidden Gems'],
  eat:     ['Restaurants', 'Fast Food', 'Bakeries', 'Dessert Places', 'Cafe'],
  hangout: ['Parks', 'Cafe', 'Shopping Spots', 'Hangout Places', 'Scenic Places'],
  explore: ['Hidden Gems', 'Scenic Places', 'Parks'],
  study:   ['Study Spots', 'Libraries', 'Cafe'],
};

// ─── PROGRESSIVE SEARCH with fallback ───
router.get('/search', async (req, res) => {
    const { q, category, intent, vibe, rating, openNow, lat, lng, distance, currentHour } = req.query;
    const hour = currentHour ? parseInt(currentHour) : new Date().getHours();

    console.log(`\n🔍 [SEARCH] category="${category || 'ALL'}" intent="${intent || 'none'}" vibe="${vibe || 'none'}" q="${q || ''}" dist=${distance || 25}km lat=${lat || 'N/A'} lng=${lng || 'N/A'}`);

    try {
        const maxDist = parseInt(distance || 25) * 1000;

        // ─── PROGRESSIVE FALLBACK STRATEGY ───
        // Level 1: Exact category + all filters
        // Level 2: Expanded category subtypes + all filters
        // Level 3: Category only (no vibe filter)
        // Level 4: Intent categories (no category/vibe)
        // Level 5: No filters at all (full city-wide)

        let results = [];
        let fallbackLevel = 0;

        for (let level = 1; level <= 5; level++) {
            const dbQuery = buildQuery(level, { category, intent, vibe, rating, q });
            results = await executeSearch(dbQuery, lat, lng, maxDist, level);

            console.log(`   📊 Level ${level}: ${results.length} results (query: ${JSON.stringify(dbQuery)})`);

            if (results.length > 0) {
                fallbackLevel = level;
                break;
            }
        }

        // ─── Enrich results with open/close status and recommendation text ───
        const enriched = results.map(p => {
            const [openH] = (p.openTime || "00:00").split(':').map(Number);
            const [closeH] = (p.closeTime || "23:59").split(':').map(Number);
            const isOpen = closeH > openH ? (hour >= openH && hour <= closeH) : (hour >= openH || hour <= closeH);

            // Universal ranking score
            const score = computeScore(p, { category, intent, vibe, lat, lng });

            return {
                ...(p.toJSON ? p.toJSON() : p),
                id: p._id,
                isOpenNow: isOpen,
                suitabilityScore: score,
                whyRecommended: p.distance !== undefined
                    ? `${Math.round(p.distance)}m away · ${score}% match`
                    : `City relevance · ${score}% match`,
                fallbackLevel,
            };
        });

        // Sort by score descending, then distance ascending
        enriched.sort((a, b) => b.suitabilityScore - a.suitabilityScore || (a.distance || 0) - (b.distance || 0));

        const final = openNow === 'true' ? enriched.filter(p => p.isOpenNow) : enriched;

        console.log(`   ✅ Returning ${final.length} results (fallback level: ${fallbackLevel})`);
        res.json(final);
    } catch (error) {
        console.error('   ❌ Search error:', error.message);
        res.status(500).json({ message: 'Discovery Logic Failure', error: error.message });
    }
});

// ─── BUILD QUERY at different fallback levels ───
function buildQuery(level, { category, intent, vibe, rating, q }) {
    const dbQuery = {};

    if (q) {
        const searchRegex = { $regex: q, $options: 'i' };
        dbQuery.$or = [{ name: searchRegex }, { tags: searchRegex }, { category: searchRegex }, { description: searchRegex }];
    }

    if (rating) dbQuery.rating = { $gte: parseFloat(rating) };

    switch (level) {
        case 1: // Exact category + vibe
            if (category) dbQuery.category = category;
            else if (intent && INTENT_CATEGORIES[intent]) dbQuery.category = { $in: INTENT_CATEGORIES[intent] };
            if (vibe) dbQuery.vibes = { $in: [vibe.toLowerCase()] };
            break;

        case 2: // Expanded category subtypes + vibe
            if (category && CATEGORY_SUBTYPES[category]) {
                dbQuery.category = { $in: CATEGORY_SUBTYPES[category] };
            } else if (intent && INTENT_CATEGORIES[intent]) {
                dbQuery.category = { $in: INTENT_CATEGORIES[intent] };
            }
            if (vibe) dbQuery.vibes = { $in: [vibe.toLowerCase()] };
            break;

        case 3: // Category subtypes, NO vibe
            if (category && CATEGORY_SUBTYPES[category]) {
                dbQuery.category = { $in: CATEGORY_SUBTYPES[category] };
            } else if (category) {
                dbQuery.category = category;
            } else if (intent && INTENT_CATEGORIES[intent]) {
                dbQuery.category = { $in: INTENT_CATEGORIES[intent] };
            }
            break;

        case 4: // Intent-only (broad)
            if (intent && INTENT_CATEGORIES[intent]) {
                dbQuery.category = { $in: INTENT_CATEGORIES[intent] };
            }
            break;

        case 5: // No filters — full city-wide
            break;
    }

    return dbQuery;
}

// ─── EXECUTE SEARCH with or without geo ───
async function executeSearch(dbQuery, lat, lng, maxDist, level) {
    const searchLat = lat ? parseFloat(lat) : DEFAULT_CENTER.lat;
    const searchLng = lng ? parseFloat(lng) : DEFAULT_CENTER.lng;

    // For higher fallback levels, expand search radius
    const radiusMultiplier = level <= 2 ? 1 : level === 3 ? 1.5 : 2;
    const effectiveDist = maxDist * radiusMultiplier;

    return Place.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [searchLng, searchLat] },
                distanceField: 'distance',
                maxDistance: effectiveDist,
                spherical: true,
                query: dbQuery,
            }
        },
        { $limit: 100 }
    ]);
}

// ─── UNIVERSAL RANKING SCORE (0-100) ───
function computeScore(place, context) {
    let score = 50; // baseline

    // Rating boost (0-20)
    score += (place.rating || 0) * 4;

    // Category exact match (+10)
    if (context.category && place.category === context.category) score += 10;

    // Vibe match (+10)
    if (context.vibe && Array.isArray(place.vibes) && place.vibes.includes(context.vibe.toLowerCase())) score += 10;

    // Intent match (+10)
    if (context.intent && INTENT_CATEGORIES[context.intent]) {
        if (INTENT_CATEGORIES[context.intent].includes(place.category)) score += 10;
    }

    // Distance bonus (closer = more points, max +10)
    if (place.distance !== undefined) {
        const distKm = place.distance / 1000;
        score += Math.max(0, 10 - distKm);
    }

    // Hidden Gem special boost
    if (place.category === 'Hidden Gems' && place.rating >= 4.2) score += 5;

    return Math.min(100, Math.round(score));
}

// ─── SAVED PLACES ROUTES ───
router.get('/saved/all', async (req, res) => {
    try {
        const savedEntries = await SavedPlace.find().populate('placeId');
        const places = savedEntries.filter(e => e.placeId).map(e => e.placeId);
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch saved places', error: error.message });
    }
});

router.post('/saved', async (req, res) => {
    const { placeId } = req.body;
    if (!placeId) return res.status(400).json({ message: 'placeId is required' });
    try {
        const existing = await SavedPlace.findOne({ placeId });
        if (existing) return res.json({ message: 'Already saved' });
        const saved = await SavedPlace.create({ placeId });
        res.status(201).json({ message: 'Place saved successfully', saved });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save place', error: error.message });
    }
});

router.delete('/saved/:placeId', async (req, res) => {
    try {
        await SavedPlace.findOneAndDelete({ placeId: req.params.placeId });
        res.json({ message: 'Place removed from saved list' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unsave place', error: error.message });
    }
});

// ─── PLACE DETAILS ───
router.get('/:idOrSlug', async (req, res) => {
    const { idOrSlug } = req.params;
    try {
        let place;
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) place = await Place.findById(idOrSlug);
        else place = await Place.findOne({ slug: idOrSlug });
        if (!place) return res.status(404).json({ message: 'Place context failure.' });
        res.json(place);
    } catch (error) {
        res.status(500).json({ message: 'Details Retrieval Failure' });
    }
});

// ─── SEED / RE-SEED ───
router.post('/seed', async (req, res) => {
    try {
        await Place.deleteMany({});
        const created = await Place.insertMany(SEED_DATA);
        res.status(201).json({ message: `Seeded ${created.length} multi-category spots for Hyderabad.` });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── DEBUG: Category counts ───
router.get('/debug/category-counts', async (req, res) => {
    try {
        const counts = await Place.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const total = await Place.countDocuments();
        res.json({ total, categories: counts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
