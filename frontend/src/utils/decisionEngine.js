import {
  CATEGORY_SUBTYPES,
  INTENT_CATEGORY_MAP,
  VIBE_CATEGORY_BOOST,
  RANKING_WEIGHTS,
  HIDDEN_GEM_CRITERIA,
  ALL_CATEGORIES,
} from '../config/categories.js';

export const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 }; // Hyderabad

export const INTENT_OPTIONS = [
  { id: 'work', label: 'I want to work/study', categories: INTENT_CATEGORY_MAP.work },
  { id: 'chill', label: 'I want to chill', categories: INTENT_CATEGORY_MAP.chill },
  { id: 'eat', label: 'I want to eat', categories: INTENT_CATEGORY_MAP.eat },
  { id: 'hangout', label: 'I want to hang out', categories: INTENT_CATEGORY_MAP.hangout },
];

export const VIBE_OPTIONS = [
  { id: 'quiet', label: 'Quiet & Calm' },
  { id: 'social', label: 'Social & Vibrant' },
  { id: 'scenic', label: 'Scenic Views' },
  { id: 'productive', label: 'Productive' },
];

export const BUDGET_OPTIONS = [
  { id: '', label: 'Any budget' },
  { id: '1', label: '$ - Budget friendly' },
  { id: '2', label: '$$ - Balanced' },
  { id: '3', label: '$$$ - Premium' },
];

export const TIME_BUDGET_OPTIONS = [
  { id: 'flexible', label: 'Flexible time' },
  { id: 'quick', label: 'Quick visit (< 30m)' },
  { id: 'stay', label: 'Stay a while (2h+)' },
];

export const CROWD_OPTIONS = [
  { id: 'any', label: 'Any vibe' },
  { id: 'quiet', label: 'Quiet/Low-key' },
  { id: 'active', label: 'Active/Social' },
];

export const getTimeSegment = (hour) => {
  if (hour >= 5 && hour < 11) return { id: 'morning', label: 'Morning', summary: 'Early session.' };
  if (hour >= 11 && hour < 16) return { id: 'afternoon', label: 'Afternoon', summary: 'Mid-day discovery.' };
  if (hour >= 16 && hour < 20) return { id: 'evening', label: 'Evening', summary: 'Golden hour picks.' };
  return { id: 'night', label: 'Night', summary: 'After-hours ranking.' };
};

// ─── Normalize a raw place object ───
export const normalizePlace = (place) => {
    if (!place) return null;
    return {
        ...place,
        id: place.id || place._id,
        rating: typeof place.rating === 'number' ? place.rating : 4.0,
        tags: Array.isArray(place.tags) ? place.tags : [],
        vibes: Array.isArray(place.vibes) ? place.vibes : [],
        intents: Array.isArray(place.intents) ? place.intents : [],
        location: place.location || { type: 'Point', coordinates: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat] },
    };
};

// ─── UNIVERSAL RANKING SCORE (0-100) ───
const computeFrontendScore = (place, context = {}) => {
    let score = place.suitabilityScore || 50;

    // If backend already scored it, use that as baseline
    // Add frontend-specific adjustments

    // Vibe match boost
    if (context.vibe && place.vibes && place.vibes.includes(context.vibe.toLowerCase())) {
        score += 5;
    }

    // Category boost from vibe mapping
    if (context.vibe && VIBE_CATEGORY_BOOST[context.vibe]) {
        if (VIBE_CATEGORY_BOOST[context.vibe].includes(place.category)) {
            score += 3;
        }
    }

    // Intent boost
    if (context.intent && INTENT_CATEGORY_MAP[context.intent]) {
        if (INTENT_CATEGORY_MAP[context.intent].includes(place.category)) {
            score += 5;
        }
    }

    // Hidden Gem special boost
    if (place.category === 'Hidden Gems' && place.rating >= HIDDEN_GEM_CRITERIA.minRating) {
        score += 5;
    }

    return Math.min(100, Math.round(score));
};

// ─── Enrich a place with display-ready properties ───
export const enrichPlace = (place, context = {}) => {
    const norm = normalizePlace(place);
    if (!norm) return null;

    const hasDistance = place.distance !== undefined;
    const distKm = hasDistance ? (place.distance / 1000).toFixed(1) : null;
    const score = computeFrontendScore(norm, context);

    return {
        ...norm,
        suitabilityScore: score,
        whyRecommended: place.whyRecommended || (hasDistance ? `${distKm} km away` : 'City-wide ranked pick'),
        distanceText: distKm ? `${distKm} km away` : 'Nearby',
        isOpenNow: place.isOpenNow !== undefined ? place.isOpenNow : true,
        priceLabel: '$'.repeat(place.priceLevel || 2),
        bestUseCase: (norm.category || 'Discovery spot').slice(0, 25),
        contextTags: (norm.tags || []).slice(0, 3),
    };
};

// ─── Build curated sections from a flat list of enriched places ───
const buildCuratedSections = (allPlaces) => {
    const sections = [
        {
            id: 'food',
            title: '🍛 Food & dining nearby',
            subtitle: 'Restaurants, bakeries, and quick bites ranked for you.',
            matchCategories: ['Restaurants', 'Fast Food', 'Bakeries', 'Dessert Places', 'Cafe'],
        },
        {
            id: 'study',
            title: '📚 Study & work spots',
            subtitle: 'Quiet zones for focused sessions.',
            matchCategories: ['Study Spots', 'Libraries', 'Cafe'],
        },
        {
            id: 'chill',
            title: '🌇 Parks & scenic places',
            subtitle: 'Open air, views, and fresh perspectives.',
            matchCategories: ['Parks', 'Scenic Places', 'Hidden Gems'],
        },
        {
            id: 'hangout',
            title: '⚡ Hangout & social spots',
            subtitle: 'Vibrant spots for social discovery.',
            matchCategories: ['Shopping Spots', 'Hangout Places', 'Cafe'],
        },
    ];

    return sections
        .map(section => ({
            ...section,
            places: allPlaces
                .filter(p => section.matchCategories.includes(p.category))
                .slice(0, 6),
        }))
        .filter(s => s.places.length > 0);
};

// ─── MAIN: Build decision response from raw places ───
export const buildDecisionResponse = (places = [], context = {}, meta = {}) => {
    console.log(`[DECISION ENGINE] Input: ${places.length} places, context:`, context);

    const safePlaces = (Array.isArray(places) ? places : [])
        .map(p => enrichPlace(p, context))
        .filter(Boolean);

    // Dedup by Id/Slug
    const uniqueMap = new Map();
    safePlaces.forEach(p => {
        const key = p.slug || p.id || p._id;
        if (key) uniqueMap.set(key, p);
    });
    const allEnriched = Array.from(uniqueMap.values());

    // Sort by suitability score descending, then distance ascending
    allEnriched.sort((a, b) =>
        b.suitabilityScore - a.suitabilityScore || (a.distance || 0) - (b.distance || 0)
    );

    const curatedSections = buildCuratedSections(allEnriched);

    console.log(`[DECISION ENGINE] Output: ${allEnriched.length} enriched, ${curatedSections.length} sections`);

    return {
        source: meta.source || 'api',
        context: context || {},
        curatedSections,
        places: allEnriched,
    };
};
