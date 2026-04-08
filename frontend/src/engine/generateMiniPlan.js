import { PLAN_SEQUENCES, getEstimateTimeLabel } from './planHeuristics';

export const generateMiniPlan = (places, moodQuery, maxBudget) => {
  if (!places || places.length < 3) return null;
  
  const currentHour = new Date().getHours();
  const lowerMood = (moodQuery || '').toLowerCase();
  
  const eligibleSequences = PLAN_SEQUENCES.filter(s => 
    lowerMood.includes(s.name.toLowerCase().split(' ')[0]) || 
    (currentHour >= s.startTime && currentHour <= s.startTime + 6)
  );

  const sequence = eligibleSequences.length > 0 
    ? eligibleSequences[Math.floor(Math.random() * eligibleSequences.length)]
    : PLAN_SEQUENCES[Math.floor(Math.random() * PLAN_SEQUENCES.length)];

  const planStops = [];
  
  sequence.flow.forEach(category => {
    const candidates = places.filter(p => 
      p.category?.includes(category) && 
      !planStops.find(s => (s.id === p.id || s._id === p._id))
    );

    if (candidates.length > 0) {
      const poolSize = Math.min(3, candidates.length);
      const randomIndex = Math.floor(Math.random() * poolSize);
      planStops.push(candidates[randomIndex]);
    }
  });

  if (planStops.length < 2) return null;

  const prefixes = ['The Ultimate', 'A Fresh', 'Your Curated', 'Smart', 'Elite', 'Hidden'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const displayTitle = `${randomPrefix} ${sequence.name}`;

  return {
    title: displayTitle,
    description: `A fluid sequence of ${planStops.length} stops curated for your current vibe.`,
    totalTime: `Approx ${planStops.length * 1.5} hours`,
    totalBudgetRange: maxBudget ? `Under ₹${maxBudget}` : 'Flexible budget',
    stops: planStops.map((p, i) => ({
      id: p.id || p.slug || p._id,
      name: p.name,
      category: p.category,
      time: getEstimateTimeLabel(i, currentHour),
      reason: p.whyRecommended || 'Perfect fit for this sequence',
      estimatedSpend: p.estimatedRange || '₹100 - ₹500'
    }))
  };
};
