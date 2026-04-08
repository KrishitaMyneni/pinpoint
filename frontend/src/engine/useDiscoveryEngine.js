import { useState, useEffect, useCallback } from 'react';
import { fetchPlaces } from './fetchPlaces';
import { filterPlaces } from './filterPlaces';
import { rankPlaces } from './rankPlaces';
import { generatePlaceInsights } from './generatePlaceInsights';
import { generateMiniPlan } from './generateMiniPlan';

export const useDiscoveryEngine = (params) => {
  const [data, setData] = useState({
    places: [],
    miniPlan: null,
    loading: true,
    error: null,
  });

  const runEngine = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    
    try {
      // 1. FETCH
      const rawResults = await fetchPlaces(params);
      
      // 2. FILTER
      const filtered = filterPlaces(rawResults, {
        maxDistance: params.maxDistance,
        maxBudget: params.maxBudget,
        openOnly: params.openOnly
      });
      
      // 3. RANK
      const ranked = rankPlaces(filtered, {
        intent: params.intent,
        vibe: params.vibe,
        budget: params.maxBudget,
        moodQuery: params.q || params.moodQuery, 
        selectedContext: params.selectedContext
      });
      
      // 4. AUGMENT (Insights)
      const augmented = ranked.map(p => ({
        ...p,
        insights: generatePlaceInsights(p)
      }));
      
      // 5. PLAN
      const moodStr = params.q || params.moodQuery || '';
      const miniPlan = generateMiniPlan(augmented, moodStr, params.maxBudget || 2000);
      
      setData({
        places: augmented,
        miniPlan,
        loading: false,
        error: null
      });
      
    } catch (err) {
      setData((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    runEngine();
  }, [runEngine]);

  return data;
};
