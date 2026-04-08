import { CATEGORY_CONFIG } from './categoryConfig';
import { parseMoodQuery } from './parseMoodQuery';
import { getTimeBoost } from './timeScoring';
import { scoreBudgetMatch, getBudgetTier } from './budgetEstimator';
import { calculateHiddenGemScore } from './hiddenGemScore';
import { getSafetyHeuristics } from './safetyHeuristics';
import { calculateContextScore } from './contextScoring';

export const rankPlaces = (places, context) => {
  console.log('🚀 [PIPELINE] Stage 3: Ranking', context);
  
  const moodSignals = context.moodQuery ? parseMoodQuery(context.moodQuery) : null;
  
  const ranked = places.map(place => {
    let score = 40; 
    
    if (place.distance !== undefined) {
      const distBonus = Math.max(0, 15 - (place.distance / 1000)); 
      score += distBonus;
    }
    
    score += (place.rating || 4) * 3;
    
    const { score: timeScore, reason: timeReason } = getTimeBoost(place);
    if (timeScore > 1) {
      score += 15;
    }

    const preferredBudgetTier = moodSignals?.budgetTier || (context.budget ? (context.budget <= 200 ? 1 : context.budget <= 500 ? 2 : context.budget <= 1000 ? 3 : 4) : 2);
    const budgetMatch = scoreBudgetMatch(place, preferredBudgetTier);
    score += budgetMatch * 15;
    
    if (moodSignals) {
      let moodBonus = 0;
      if (moodSignals.categories.some(cat => place.category?.includes(cat))) moodBonus += 10;
      if (moodSignals.vibes.some(v => place.vibes?.some(pv => pv.toLowerCase().includes(v)))) moodBonus += 10;
      if (moodSignals.crowd && place.vibes?.some(v => v.toLowerCase().includes(moodSignals.crowd))) moodBonus += 5;
      score += moodBonus;
    } else if (context.vibe && place.vibes?.includes(context.vibe.toLowerCase())) {
      score += 10;
    }
    
    const categoryMeta = CATEGORY_CONFIG[place.category];
    if (categoryMeta) {
      score += (categoryMeta.boost || 1) * 3;
    }

    const gemResult = calculateHiddenGemScore(place);
    if (gemResult.isGem) {
      score += 10;
    }

    const contextMatch = calculateContextScore(place, context.selectedContext || 'solo');
    if (contextMatch.score > 0) {
      score += Math.min(20, contextMatch.score);
    }

    const safety = getSafetyHeuristics(place);
    if (safety.score > 80) score += 10;
    else if (safety.score < 50) score -= 20; 
    
    const budgetInfo = getBudgetTier(place);
    const finalScore = Math.min(100, Math.round(score));
    
    let reason = timeReason || 'A consistent favorite in this area';
    if (gemResult.isGem && gemResult.reason) {
      reason = gemResult.reason;
    } else if (contextMatch.score > 20 && contextMatch.chipLabel) {
      reason = `${contextMatch.chipLabel} spot`;
    } else if (moodSignals) {
      const matchingVibe = moodSignals.vibes.find(v => place.vibes?.some(pv => pv.toLowerCase().includes(v)));
      if (matchingVibe) reason = `Perfect for that ${matchingVibe} vibe`;
      else if (moodSignals.context) reason = `Great for ${moodSignals.context}`;
    }
    
    return {
      ...place,
      suitabilityScore: finalScore,
      budgetTier: budgetInfo.tier,
      budgetLabel: budgetInfo.name,
      estimatedRange: budgetInfo.estimatedRange,
      whyRecommended: reason,
      isTimeBoosted: timeScore > 1,
      isHiddenGem: gemResult.isGem,
      hiddenGemReason: gemResult.reason,
      safetyLevel: safety.level,
      contextChip: contextMatch.chipLabel
    };
  });
  
  ranked.sort((a, b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0));
  return ranked;
};
