export const getSafetyHeuristics = (place) => {
  const currentHour = new Date().getHours();
  let score = 70; // Base safety score
  const signals = [];

  // 1. Public Visibility vs Isolation
  const publicCategories = ['Parks', 'Shopping Spots', 'Hangout Places', 'Fast Food', 'Restaurants'];
  const isolatedCategories = ['Hidden Gems', 'Scenic Places'];

  if (publicCategories.includes(place.category)) {
    score += 15;
    signals.push('High social presence');
  } else if (isolatedCategories.includes(place.category)) {
    score -= 10;
    signals.push('Quiet/Secluded area');
  }

  // 2. Evening Activity
  const isNight = currentHour >= 18 || currentHour <= 4;
  const isLateNight = currentHour >= 22 || currentHour <= 4;

  if (isNight) {
    if (place.vibes?.includes('vibrant') || place.tags?.includes('late night')) {
      score += 10;
      signals.push('Very active at night');
    } else if (place.category === 'Parks') {
      score -= 20;
      signals.push('Limited night visibility');
    }
  }

  // 3. Rating & Community Trust
  if (place.rating >= 4.5 && (place.reviewsCount || 0) > 1000) {
    score += 10;
    signals.push('Highly trusted location');
  }

  const level = score >= 85 ? 'High' : score >= 60 ? 'Moderate' : 'Low';

  return { score, level, signals };
};

