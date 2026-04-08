export const generatePlaceInsights = (place) => {
  const insights = [];
  
  // 1. Recommendation Reason (Priority)
  if (place.whyRecommended) {
    insights.push(place.whyRecommended);
  }

  // 2. Time-aware signal
  const hour = new Date().getHours();
  if (place.isTimeBoosted) {
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    insights.push(`Best for this ${timeOfDay}`);
  }

  if (place.isHiddenGem) {
    insights.push(`Underrated Gem: ${place.hiddenGemReason || 'Worth discovering'}`);
  }
  
  // 3. Budget-based
  if (place.budgetLabel) {
    insights.push(`Est. ${place.budgetLabel}`);
  }
  
  // 4. Vibe-based
  if (place.vibes?.includes('quiet') || place.category === 'Libraries') {
    insights.push('Quiet enough to study');
  }
  
  if (place.vibes?.includes('social') || place.vibes?.includes('lively')) {
    insights.push('Popular with groups');
  }
  
  if (place.vibes?.includes('productive') || place.category === 'Cafe') {
    insights.push('Good for solo visits');
  }
  
  // 5. Rating-based
  if (place.rating >= 4.8) {
    insights.push('Highly recommended');
  }
  
  return Array.from(new Set(insights)).slice(0, 3); // Return top 3 unique insights
};

