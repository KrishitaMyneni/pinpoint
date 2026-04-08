import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlaceDetails, savePlace } from '../services/api';
import './PlaceDetails.css';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const storedLocation = JSON.parse(localStorage.getItem('userLoc') || '{}');
        const details = await getPlaceDetails(id, storedLocation);
        setPlace(details);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('[DETAILS ERROR] Failed to fetch place details', error);
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'unknown') {
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const placeId = place?.id || place?._id;
      if (placeId) {
        const response = await savePlace(placeId);
        setSaveStatus(response.message || 'Saved');
        setTimeout(() => setSaveStatus(''), 2500);
      }
    } catch (error) {
      console.error('[SAVE ERROR] Failed to save place', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading container">
        <div className="details-skeleton details-skeleton-hero" />
        <div className="details-skeleton details-skeleton-block" />
      </div>
    );
  }

  if (!place || id === 'unknown') {
    return (
      <div className="details-empty container">
        <h2>Place context was lost.</h2>
        <p>The decision engine could not verify this destination's identifiers.</p>
        <button type="button" className="primary-cta" onClick={() => navigate('/search')}>
          Back to the discovery feed
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <section className="detail-hero">
        <img src={place.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab752?q=80&w=1200'} alt={place.name} />
        <div className="detail-hero-overlay">
          <div className="container detail-hero-content">
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              Back
            </button>
            <span className="detail-kicker">{place.category || 'Local pick'}</span>
            <h1>{place.name || 'Anonymous Spot'}</h1>
            <p>{place.whyRecommended || 'Perfectly matched for your current session intent.'}</p>
            <div className="detail-hero-actions">
              <button type="button" className="primary-cta" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address || ''}`)}`)}>
                Directions
              </button>
              <button type="button" className="secondary-cta" onClick={handleSave} disabled={isSaving}>
                {saveStatus || (isSaving ? 'Saving...' : 'Save to shortlist')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container detail-grid">
        <main className="detail-main">
          <section className="detail-panel">
            <div className="detail-panel-head">
              <h2>Decision brief</h2>
              <span>{place.suitabilityScore || 85}% suitability</span>
            </div>
            <p className="detail-summary">{place.whyNow || place.whyRecommended || 'Calculated for your current location and time.'}</p>
            <div className="detail-reason-list">
              {(place.reasons || ['Highly rated locally', 'Fits your current vibe']).map((reason) => (
                <div key={reason} className="detail-reason-item">
                  {reason}
                </div>
              ))}
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-panel-head">
              <h2>About this discovery</h2>
              <span>{place.bestUseCase || 'Casual spot'}</span>
            </div>
            <p className="detail-description">{place.description || 'No additional context available.'}</p>
            <div className="detail-tag-grid">
              {(place.tags || place.vibes || []).map((tag) => (
                <span key={tag} className="detail-tag">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </main>

        <aside className="detail-sidebar">
          <section className="detail-side-card">
            <h3>Context readout</h3>
            <ul>
              <li>{place.isOpenNow ? 'Currently open' : (place.openStatusLabel || 'Open Now')}</li>
              <li>{place.distanceText || 'Nearby your current position'}</li>
              <li>{'$'.repeat(place.priceLevel || 2)} spend level</li>
              <li>{(place.rating || 4.2).toFixed(1)} rating</li>
            </ul>
          </section>

          <section className="detail-side-card">
            <h3>Decision signals</h3>
            <div className="detail-context-tags">
              {(place.intents || place.contextTags || ['General']).map((tag) => (
                <span key={tag} className="detail-context-pill">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="detail-side-card">
            <h3>Plan logistics</h3>
            <p>{place.address || 'Address provided on arrival.'}</p>
            <p>
              Open {place.openTime || '10:00'} to {place.closeTime || '22:00'}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default PlaceDetails;
