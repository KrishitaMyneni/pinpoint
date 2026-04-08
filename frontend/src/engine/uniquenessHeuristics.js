const COMMON_CHAINS = [
  'starbucks', 'mcdonalds', 'burger king', 'dominos', 'pizzahut', 'subway',
  'kfc', 'paradise biryani', 'cream stone', 'wework', 'barista', 'costa coffee',
  'karachi bakery', 'pista house', 'inorbit', 'gvk', 'sarath city'
];

const UNIQUE_CATEGORIES = [
  'Hidden Gems', 'Libraries', 'Scenic Places', 'Bakeries', 'Cafe', 'Study Spots'
];

export const isChain = (place) => {
  const name = place.name.toLowerCase();
  return COMMON_CHAINS.some(chain => name.includes(chain));
};

export const getUniquenessScore = (place) => {
  let score = 0;
  
  // Penalty for chains
  if (isChain(place)) score -= 30;
  else score += 20; // Bonus for independent spots

  // Bonus for unique categories
  if (UNIQUE_CATEGORIES.includes(place.category)) score += 15;

  // Bonus for unique vibes
  if (place.vibes?.includes('unique')) score += 15;
  if (place.vibes?.includes('hidden-gem')) score += 20;

  return score;
};

