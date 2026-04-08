import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import { getSavedPlaces, unsavePlace } from '../services/api';
import './SavedPlaces.css';

const SavedPlaces = () => {
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      setLoading(true);
      const data = await getSavedPlaces();
      setSavedPlaces(data);
      setLoading(false);
    };

    fetchSavedPlaces();
  }, []);

  const handleUnsave = async (placeId) => {
    await unsavePlace(placeId);
    setSavedPlaces((current) => current.filter((place) => place._id !== placeId));
  };

  return (
    <div className="saved-page">
      <div className="container saved-shell">
        <div className="saved-header">
          <span className="section-kicker">SAVED SHORTLIST</span>
          <h1>Your kept decisions.</h1>
          <p>Use this as a curated memory of places the engine already considered worth revisiting.</p>
        </div>

        {loading ? (
          <div className="saved-skeleton-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="saved-skeleton" />
            ))}
          </div>
        ) : savedPlaces.length > 0 ? (
          <div className="saved-list">
            {savedPlaces.map((place) => (
              <div key={place._id} className="saved-item">
                <PlaceCard place={place} />
                <button type="button" className="unsave-btn" onClick={() => handleUnsave(place._id)}>
                  Remove from shortlist
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="saved-empty">
            <h2>No saved places yet.</h2>
            <p>Start from the decision feed and keep the places that felt right for a specific moment.</p>
            <button type="button" className="primary-cta" onClick={() => navigate('/search')}>
              Open the decision feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlaces;
