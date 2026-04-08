import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();

  if (!place) return null;

  // CRITICAL FIX: Ensure the route uses the slug or ID properly to avoid /place/unknown
  const placeIdentifier = place.slug || place.id || place._id;
  const openDetails = () => {
    if (placeIdentifier) {
      navigate(`/place/${placeIdentifier}`);
    } else {
      console.warn("Place missing identifier:", place);
    }
  };

  return (
    <article
      className={`decision-card ${place.isFallback ? 'fallback-card' : ''}`}
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetails();
        }
      }}
    >
      <div className="decision-card-image">
        <img src={place.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab752?q=80&w=600'} alt={place.name} />
        <div className="decision-card-status-row">
          <span className={`status-pill ${place.isOpenNow ? 'status-open' : 'status-closed'}`}>{place.isOpenNow ? 'Open Now' : 'Closed'}</span>
          {place.isTimeBoosted && (
            <div className="status-pill status-boost">
              🌙 Best for now
            </div>
          )}
          {place.isHiddenGem && (
            <div className="status-pill status-gem">
              💎 Underrated Diamond
            </div>
          )}
          {place.contextChip && (
            <div className="status-pill status-context">
              📍 {place.contextChip}
            </div>
          )}
          {place.safetyLevel === 'High' && (
            <div className="status-pill status-safety" title="Well-lit and active public space">
              🛡️ High Social Presence
            </div>
          )}
          <div className="score-pill">
            {place.suitabilityScore}% Match
          </div>
        </div>
      </div>

      <div className="decision-card-body">
        <div className="decision-card-head">
          <span className="decision-card-category">{place.category}</span>
          <span className="decision-card-price">{place.budgetLabel || '$'.repeat(place.priceLevel || 2)}</span>
        </div>

        <h3>{place.name}</h3>
        <p className="decision-why">{place.whyRecommended}</p>

        <div className="decision-meta">
          <span>{place.distance ? `${(place.distance / 1000).toFixed(1)}km away` : 'Nearby'}</span>
          <span>{(place.rating || 4.2).toFixed(1)} ★</span>
          {place.estimatedRange && <span className="budget-range">{place.estimatedRange}</span>}
        </div>

        <div className="decision-insights">
          {(place.insights || []).map(info => (
            <span key={info} className="insight-chip">{info.includes('Est.') ? '💰' : info.includes('Best') ? '✨' : '💡'} {info}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;
