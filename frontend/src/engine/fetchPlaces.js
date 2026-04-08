import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/places';

export const fetchPlaces = async (params) => {
  console.log('🚀 [PIPELINE] Stage 1: Fetching', params);

  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        ...params,
        currentHour: new Date().getHours()
      }
    });

    const rawPlaces = response.data;

    // De-duplication layer
    const uniqueMap = new Map();
    rawPlaces.forEach((p) => {
      const key = p.slug || p.id || p._id;
      if (key) uniqueMap.set(key, p);
    });

    const deduped = Array.from(uniqueMap.values());
    console.log(`📊 [PIPELINE] Fetched ${rawPlaces.length} places.`);

    return deduped;
  } catch (error) {
    console.error('❌ [FETCH ERROR] Failed to load data:', error.message);
    return [];
  }
};
