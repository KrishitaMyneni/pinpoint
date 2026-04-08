import { getUniquenessScore } from './uniquenessHeuristics';

export const calculateHiddenGemScore = (place) => {
  let score = 0;
  const reviews = place.reviewsCount || 0;
  const rating = place.rating || 0;

  // 1. Rating Factor (Highly rated but not necessarily thousands of reviews)
  if (rating >= 4.5) score += 30;
  else if (rating >= 4.0) score += 15;

  // 2. Review Count Sweet Spot (50 - 600 reviews is the "Hidden Gem" zone)
  if (reviews >= 50 && reviews <= 600) {
    score += 40; // Peak hidden gem signal
  } else if (reviews > 600 && reviews <= 1500) {
    score += 15; // Moderately mainstream
  } else if (reviews > 1500) {
    score -= 20; // Definitely mainstream
  }

  // 3. Uniqueness Heuristics
  const uniquenessBoost = getUniquenessScore(place);
  score += uniquenessBoost;

  // 4. Scenic/Aesthetic Bonus
  if (place.vibes?.includes('scenic') || place.tags?.includes('aesthetic')) {
    score += 10;
  }

  const isGem = score >= 50;
  
  let reason = null;
  if (isGem) {
    if (uniquenessBoost > 0 && reviews < 500) reason = 'Underrated local favorite';
    else if (place.category === 'Hidden Gems') reason = 'Curated hidden gem';
    else if (rating >= 4.7) reason = 'Top-rated niche spot';
    else reason = 'Worth discovering';
  }

  return { isGem, score, reason };
};

