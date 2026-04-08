import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/places';

export const searchPlaces = async (params = {}) => {
  const requestParams = {
    ...params,
    currentHour: new Date().getHours(),
  };

  try {
    const response = await axios.get(`${API_BASE_URL}/search`, { params: requestParams });
    const places = response.data;
    // Strictly return API data without mock fallbacks
    return {
        places: Array.isArray(places) ? places : [],
        source: 'api'
    };
  } catch (error) {
    console.error('[API FAILURE]', error.message);
    return { places: [], source: 'error' };
  }
};

export const getPlaceDetails = async (id, coords = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { params: coords });
    return response.data;
  } catch (error) {
    console.error(`[API ERROR] GET /${id}`, error.message);
    throw error;
  }
};

export const savePlace = async (placeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/saved`, { placeId });
    return response.data;
  } catch (error) {
    return { message: 'Sync failed' };
  }
};

export const getSavedPlaces = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/saved/all`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
};

export const unsavePlace = async (placeId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/saved/${placeId}`);
      return response.data;
    } catch (error) {
      return { message: 'Delete failed' };
    }
};
