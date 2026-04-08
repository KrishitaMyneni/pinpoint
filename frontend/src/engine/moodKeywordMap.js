
export const MOOD_KEYWORD_MAP = {
  peaceful: {
    categories: ['Parks', 'Libraries', 'Cafe', 'Scenic Places'],
    vibes: ['calm', 'quiet', 'peaceful'],
    crowd: 'quiet',
    scenic: true,
    context: 'solo'
  },
  quiet: {
    vibes: ['quiet', 'silent'],
    crowd: 'quiet',
    context: 'study'
  },
  date: {
    categories: ['Cafe', 'Restaurants', 'Bakeries', 'Scenic Places'],
    vibes: ['aesthetic', 'cozy', 'romantic'],
    scenic: true,
    context: 'date'
  },
  cozy: {
    vibes: ['cozy', 'warm'],
    context: 'date'
  },
  'late night': {
    categories: ['Restaurants', 'Fast Food', 'Bakeries', 'Dessert Places'],
    vibes: ['late-night', 'lively'],
    timeBoost: 'night'
  },
  study: {
    categories: ['Libraries', 'Cafe', 'Study Spots'],
    vibes: ['quiet', 'wifi-friendly'],
    crowd: 'quiet',
    context: 'study'
  },
  sunset: {
    categories: ['Parks', 'Scenic Places', 'Hidden Gems'],
    vibes: ['scenic', 'sunset-view'],
    scenic: true,
    timeBoost: 'evening'
  },
  friends: {
    categories: ['Cafe', 'Shopping Spots', 'Hangout Places', 'Restaurants'],
    vibes: ['social', 'fun', 'lively'],
    crowd: 'lively',
    context: 'friends'
  },
  group: {
    crowd: 'lively',
    context: 'friends'
  },
  alone: {
    vibes: ['calm', 'low-pressure'],
    context: 'solo',
    crowd: 'quiet'
  },
  chill: {
    vibes: ['chill', 'relaxed'],
    crowd: 'calm'
  },
  budget: {
    budgetTier: 1,
    vibes: ['affordable', 'low-cost']
  },
  affordable: {
    budgetTier: 1
  },
  cheap: {
    budgetTier: 1
  },
  premium: {
    budgetTier: 4,
    vibes: ['luxury', 'upscale']
  },
  luxury: {
    budgetTier: 4
  },
  'main character': {
    vibes: ['aesthetic', 'cinematic', 'scenic'],
    scenic: true
  },
  hidden: {
    vibes: ['hidden-gem', 'underrated']
  },
  gem: {
    vibes: ['hidden-gem']
  }
};

