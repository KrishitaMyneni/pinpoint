export const getBudgetTier = (place) => {
  const category = (place.category || '').toLowerCase();
  const name = place.name.toLowerCase();

  // 1. FREE / VERY LOW (<200)
  if (
    ['park', 'library', 'lake', 'temple', 'viewpoint', 'nature'].some(k => category.includes(k)) ||
    ['tea', 'chai', 'fast food', 'bakery'].some(k => category.includes(k)) ||
    ['street food', 'tiffin'].some(k => name.includes(k))
  ) {
    return { tier: 1, label: 'Under ₹200', estimatedRange: '₹50 - ₹200' };
  }

  // 2. MID-LOW (<500)
  if (
    ['cafe', 'bookstore', 'museum'].some(k => category.includes(k)) ||
    ['pizza', 'burger', 'coffee'].some(k => name.includes(k))
  ) {
    return { tier: 2, label: 'Under ₹500', estimatedRange: '₹200 - ₹500' };
  }

  // 3. MID-HIGH (<1000)
  if (
    ['restaurant', 'mall', 'game zone'].some(k => category.includes(k)) ||
    place.rating > 4.7 // Heuristic
  ) {
    return { tier: 3, label: 'Under ₹1000', estimatedRange: '₹500 - ₹1000' };
  }

  // 4. PREMIUM (1000+)
  if (
    ['fine dining', 'luxury', 'resort', 'club'].some(k => category.includes(k)) ||
    name.includes('premium') || name.includes('luxury')
  ) {
    return { tier: 4, label: '₹1000+', estimatedRange: '₹1000+' };
  }

  // Fallback
  return { tier: 2, label: 'Under ₹500', estimatedRange: '₹200 - ₹500' };
};

export const scoreBudgetMatch = (place, preferredTier)=> {
  const placeTier = getBudgetTier(place).tier;
  if (placeTier <= preferredTier) return 1.0; // Fits within budget
  if (placeTier === preferredTier + 1) return 0.5; // Slightly over budget
  return 0; // Way over budget
};

