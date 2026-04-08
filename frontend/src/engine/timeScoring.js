export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getTimeBoost = (place) => {
  const timeOfDay = getCurrentTimeOfDay();
  const category = (place.category || '').toLowerCase();
  
  const boosts = {
    morning: {
      keywords: ['park', 'breakfast', 'tea', 'chai', 'library', 'nature'],
      boost: 1.5,
      reason: 'Perfect for a fresh morning start'
    },
    afternoon: {
      keywords: ['cafe', 'mall', 'shopping', 'library', 'working', 'coffee'],
      boost: 1.5,
      reason: 'Great spot for afternoon relaxation or work'
    },
    evening: {
      keywords: ['park', 'lake', 'viewpoint', 'bakery', 'street food', 'scenic'],
      boost: 1.8,
      reason: 'Amazing vibe for the evening'
    },
    night: {
      keywords: ['restaurant', 'dessert', 'fast food', 'bakery', 'late'],
      boost: 1.5,
      reason: 'Highly recommended for an late-night visit'
    }
  };

  const currentConfig = boosts[timeOfDay];
  const isMatch = currentConfig.keywords.some(k => category.includes(k));

  if (isMatch) {
    return { score: currentConfig.boost, reason: currentConfig.reason };
  }

  return { score: 1.0, reason: '' };
};

