export const calculatePlanScore = (stops, maxBudget) => {
  if (stops.length < 2) return 0;
  
  let score = 100;
  
  // 1. Distance Penalty (Stops should be close to each other)
  for (let i = 0; i < stops.length - 1; i++) {
    const lat1 = stops[i].location?.coordinates[1];
    const lng1 = stops[i].location?.coordinates[0];
    const lat2 = stops[i+1].location?.coordinates[1];
    const lng2 = stops[i+1].location?.coordinates[0];
    
    if (lat1 && lng1 && lat2 && lng2) {
      const dist = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111; // Approx km
      if (dist > 5) score -= 30; // Jumps over 5km are penalized
      if (dist > 2) score -= 10; // Jumps over 2km are slightly penalized
    }
  }

  // 2. Budget Score
  const totalTier = stops.reduce((sum, p) => sum + (p.priceLevel || 2), 0) / stops.length;
  const preferredTier =
    maxBudget <= 200 ? 1 :
    maxBudget <= 500 ? 2 :
    maxBudget <= 1000 ? 3 : 4;
  
  if (totalTier > preferredTier) score -= 40;
  
  // 3. Variety Bonus
  const categories = new Set(stops.map(p => p.category));
  if (categories.size === stops.length) score += 20;

  return Math.max(0, score);
};

