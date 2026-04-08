/**
 * CENTRALIZED CATEGORY CONFIGURATION
 * Single source of truth for all category-related logic across the app.
 * Every component, filter, ranking function, and API call uses this config.
 */

// ─── Category → related subtypes mapping ───
// When a user picks "Parks", the backend should also return places
// that are tagged/categorized under related subtypes.
export const CATEGORY_SUBTYPES = {
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

// ─── All displayable categories (in order for UI) ───
export const ALL_CATEGORIES = [
  'Restaurants',
  'Fast Food',
  'Parks',
  'Scenic Places',
  'Libraries',
  'Study Spots',
  'Shopping Spots',
  'Hangout Places',
  'Hidden Gems',
  'Bakeries',
  'Dessert Places',
  'Cafe',
];

// ─── Category icons for UI ───
export const CATEGORY_ICONS = {
  'Restaurants':     '🍛',
  'Fast Food':       '🍔',
  'Parks':           '🌳',
  'Scenic Places':   '🌇',
  'Libraries':       '📚',
  'Study Spots':     '💻',
  'Shopping Spots':  '🛍️',
  'Hangout Places':  '⚡',
  'Hidden Gems':     '💎',
  'Bakeries':        '🧁',
  'Dessert Places':  '🍰',
  'Cafe':            '☕',
};

// ─── Intent → category mapping ───
export const INTENT_CATEGORY_MAP = {
  work:    ['Study Spots', 'Libraries', 'Cafe'],
  chill:   ['Parks', 'Scenic Places', 'Cafe', 'Hidden Gems'],
  eat:     ['Restaurants', 'Fast Food', 'Bakeries', 'Dessert Places', 'Cafe'],
  hangout: ['Parks', 'Cafe', 'Shopping Spots', 'Hangout Places', 'Scenic Places'],
  explore: ['Hidden Gems', 'Scenic Places', 'Parks'],
};

// ─── Vibe → boost categories (soft scoring, not hard filter) ───
export const VIBE_CATEGORY_BOOST = {
  quiet:      ['Libraries', 'Parks', 'Study Spots', 'Scenic Places'],
  social:     ['Restaurants', 'Hangout Places', 'Cafe', 'Shopping Spots'],
  scenic:     ['Scenic Places', 'Parks', 'Hidden Gems'],
  productive: ['Study Spots', 'Libraries', 'Cafe'],
  vibrant:    ['Shopping Spots', 'Fast Food', 'Hangout Places', 'Restaurants'],
  unique:     ['Hidden Gems', 'Bakeries', 'Scenic Places'],
};

// ─── Ranking weights ───
export const RANKING_WEIGHTS = {
  distance:    0.30,  // closer = better
  rating:      0.25,  // higher rating = better
  vibeMatch:   0.15,  // matches selected vibe
  intentMatch: 0.15,  // matches selected intent
  categoryRel: 0.10,  // exact category match bonus
  openNow:     0.05,  // open right now bonus
};

// ─── Hidden Gems scoring thresholds ───
export const HIDDEN_GEM_CRITERIA = {
  minRating: 4.2,
  boostCategories: ['Hidden Gems', 'Scenic Places', 'Parks', 'Bakeries'],
};

/**
 * Get expanded categories for a given category selection.
 * Used for progressive fallback: first try exact, then expand to subtypes.
 */
export const getExpandedCategories = (category) => {
  if (!category) return [];
  return CATEGORY_SUBTYPES[category] || [category];
};
