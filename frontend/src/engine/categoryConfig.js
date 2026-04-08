
export const CATEGORY_CONFIG = {
  'Restaurants': {
    label: 'Restaurants',
    icon: '🍛',
    subtypes: ['Restaurants', 'Cafe'],
    boost: 1.0,
    color: '#ff6b6b',
    suitabilityTags: ['Good for groups', 'Great for dinner'],
  },
  'Fast Food': {
    label: 'Fast Food',
    icon: '🍔',
    subtypes: ['Fast Food', 'Restaurants'],
    boost: 0.8,
    color: '#feca57',
    suitabilityTags: ['Quick bite', 'Budget friendly'],
  },
  'Parks': {
    label: 'Parks',
    icon: '🌳',
    subtypes: ['Parks', 'Scenic Places'],
    boost: 1.2,
    color: '#1dd1a1',
    suitabilityTags: ['Outdoor space', 'Quiet & calm'],
  },
  'Scenic Places': {
    label: 'Scenic Places',
    icon: '🌇',
    subtypes: ['Scenic Places', 'Parks', 'Hidden Gems'],
    boost: 1.3,
    color: '#48dbfb',
    suitabilityTags: ['Great views', 'Aesthetic'],
  },
  'Libraries': {
    label: 'Libraries',
    icon: '📚',
    subtypes: ['Libraries', 'Study Spots'],
    boost: 1.1,
    color: '#54a0ff',
    suitabilityTags: ['Quiet zone', 'Productive'],
  },
  'Study Spots': {
    label: 'Study Spots',
    icon: '💻',
    subtypes: ['Study Spots', 'Libraries', 'Cafe'],
    boost: 1.1,
    color: '#5f27cd',
    suitabilityTags: ['Fast WiFi', 'Laptop friendly'],
  },
  'Shopping Spots': {
    label: 'Shopping Spots',
    icon: '🛍️',
    subtypes: ['Shopping Spots', 'Hangout Places'],
    boost: 0.9,
    color: '#ff9ff3',
    suitabilityTags: ['Good for groups', 'Vibrant'],
  },
  'Hangout Places': {
    label: 'Hangout Places',
    icon: '⚡',
    subtypes: ['Hangout Places', 'Shopping Spots', 'Cafe', 'Parks'],
    boost: 1.0,
    color: '#54a0ff',
    suitabilityTags: ['Social vibe', 'Evening hangout'],
  },
  'Hidden Gems': {
    label: 'Hidden Gems',
    icon: '💎',
    subtypes: ['Hidden Gems', 'Scenic Places'],
    boost: 1.5,
    color: '#00d2d3',
    suitabilityTags: ['Unique find', 'Local secret'],
  },
  'Bakeries': {
    label: 'Bakeries',
    icon: '🧁',
    subtypes: ['Bakeries', 'Dessert Places', 'Cafe'],
    boost: 1.0,
    color: '#ff9f43',
    suitabilityTags: ['Sweet treats', 'Quick visit'],
  },
  'Dessert Places': {
    label: 'Dessert Places',
    icon: '🍰',
    subtypes: ['Dessert Places', 'Bakeries', 'Cafe'],
    boost: 0.9,
    color: '#ee5253',
    suitabilityTags: ['Cravings', 'Great for dates'],
  },
  'Cafe': {
    label: 'Cafe',
    icon: '☕',
    subtypes: ['Cafe', 'Bakeries', 'Study Spots'],
    boost: 1.1,
    color: '#8395a7',
    suitabilityTags: ['Good for solo', 'Aesthetic coffee'],
  },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);

export const INTENT_CATEGORY_MAP = {
  work:    ['Study Spots', 'Libraries', 'Cafe'],
  chill:   ['Parks', 'Scenic Places', 'Cafe', 'Hidden Gems'],
  eat:     ['Restaurants', 'Fast Food', 'Bakeries', 'Dessert Places', 'Cafe'],
  hangout: ['Parks', 'Cafe', 'Shopping Spots', 'Hangout Places', 'Scenic Places'],
  explore: ['Hidden Gems', 'Scenic Places', 'Parks'],
};

export const INTENT_OPTIONS = [
  { id: 'work', label: 'I want to work/study' },
  { id: 'chill', label: 'I want to chill' },
  { id: 'eat', label: 'I want to eat' },
  { id: 'hangout', label: 'I want to hang out' },
  { id: 'explore', label: 'I want to explore' },
];

