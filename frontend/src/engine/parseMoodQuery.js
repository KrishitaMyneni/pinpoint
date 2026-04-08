import { MOOD_KEYWORD_MAP } from './moodKeywordMap';

export const parseMoodQuery = (query = '') => {
  const normalized = query.toLowerCase();
  const result = {
    categories: [],
    vibes: [],
    scenic: false,
  };

  // Extract signals based on keywords
  Object.entries(MOOD_KEYWORD_MAP).forEach(([keyword, signal]) => {
    if (normalized.includes(keyword)) {
      if (signal.categories) result.categories.push(...signal.categories);
      if (signal.vibes) result.vibes.push(...signal.vibes);
      if (signal.crowd) result.crowd = signal.crowd;
      if (signal.scenic) result.scenic = true;
      if (signal.budgetTier && (!result.budgetTier || signal.budgetTier < result.budgetTier)) {
        result.budgetTier = signal.budgetTier;
      }
      if (signal.context) result.context = signal.context;
      if (signal.timeBoost) result.timeBoost = signal.timeBoost;
    }
  });

  // Extract budget mentions specifically like "under 500"
  const underMatch = normalized.match(/under\s*(\d+)/);
  if (underMatch) {
    const amount = parseInt(underMatch[1], 10);
    if (amount <= 200) result.budgetTier = 1;
    else if (amount <= 500) result.budgetTier = 2;
    else if (amount <= 1000) result.budgetTier = 3;
    else result.budgetTier = 4;
  }

  // Deduplicate
  result.categories = Array.from(new Set(result.categories));
  result.vibes = Array.from(new Set(result.vibes));

  return result;
};

