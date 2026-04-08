import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import PlaceCard from '../components/PlaceCard';
import { useDiscoveryEngine } from '../engine/useDiscoveryEngine';
import { CATEGORY_CONFIG, ALL_CATEGORIES, INTENT_OPTIONS } from '../engine/categoryConfig';
import {
    DEFAULT_CENTER,
    VIBE_OPTIONS,
} from '../utils/decisionEngine';
import './SearchPage.css';

// ─── Leaflet icon fix ───
const defaultMarker = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultMarker;

// ─── Map auto-fit component ───
const MapBoundsUpdater = ({ places, userLat, userLng }) => {
    const map = useMap();

    useEffect(() => {
        const points = [];

        if (userLat && userLng) {
            points.push([userLat, userLng]);
        }

        places.forEach(p => {
            if (p.location?.coordinates) {
                points.push([p.location.coordinates[1], p.location.coordinates[0]]);
            }
        });

        if (points.length >= 2) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else if (points.length === 1) {
            map.setView(points[0], 13);
        }
    }, [places, userLat, userLng, map]);

    return null;
};

export const CONTEXT_OPTIONS = [
    { id: 'solo', label: 'Solo', icon: '👤' },
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'date', label: 'Date', icon: '❤️' },
    { id: 'study', label: 'Study', icon: '📖' },
    { id: 'family', label: 'Family', icon: '🏠' },
];

// ─── Build filters from URL ───
const buildInitialFilters = (search) => {
    const params = new URLSearchParams(search);
    return {
        q: params.get('q') || '',
        intent: params.get('intent') || '',
        vibe: params.get('vibe') || '',
        category: params.get('category') || '',
        distance: Number(params.get('distance') || params.get('dist')) || 25,
        maxBudget: params.get('maxBudget') ? Number(params.get('maxBudget')) : 2000,
        selectedContext: params.get('context') || 'solo',
        lat: params.get('lat') ? Number(params.get('lat')) : null,
        lng: params.get('lng') ? Number(params.get('lng')) : null,
    };
};

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [filters, setFilters] = useState(() => buildInitialFilters(location.search));
    const [activePlace, setActivePlace] = useState(null);
    const [gpsStatus, setGpsStatus] = useState('');
    const [showDebug, setShowDebug] = useState(false);
    const [showPlan, setShowPlan] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    // ─── THE NEW DISCOVERY ENGINE ───
    const { places, miniPlan, loading, error } = useDiscoveryEngine({
        ...filters,
        maxDistance: filters.distance,
        maxBudget: filters.maxBudget,
        refreshKey // Force engine to re-run plan logic if requested
    });

    const handleGeneratePlan = () => {
        setRefreshKey(prev => prev + 1);
        setShowPlan(true);
        // Scroll to plan
        setTimeout(() => {
            const el = document.getElementById('itinerary-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const debugInfo = {
        placesCount: (places || []).length,
        hasMiniPlan: !!miniPlan,
        loading,
        filters
    };

    const updateFilter = useCallback((patch) => {
        setFilters(prev => ({ ...prev, ...patch }));
    }, []);

    // Sync URL with filters state safely outside the render cycle
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                params.set(k, v.toString());
            }
        });
        navigate({ search: params.toString() }, { replace: true });
    }, [filters, navigate]);

    const handleSyncLocation = () => {
        setGpsStatus('Syncing context...');
        if (!navigator.geolocation) {
            setGpsStatus('GPS not available.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                updateFilter({ lat: latitude, lng: longitude });
                setGpsStatus('Location locked.');
                localStorage.setItem('userLoc', JSON.stringify({ lat: latitude, lng: longitude }));
                const params = new URLSearchParams(window.location.search);
                params.set('lat', latitude);
                params.set('lng', longitude);
                navigate({ search: params.toString() }, { replace: true });
            },
            () => setGpsStatus('Location access denied. Using city-wide mode.')
        );
    };

    const mapCenter = (activePlace && activePlace.location?.coordinates)
        ? [activePlace.location.coordinates[1], activePlace.location.coordinates[0]]
        : (filters.lat && filters.lng ? [filters.lat, filters.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]);

    const placesWithCoords = (places || []).filter(p => p.location?.coordinates);

    return (
        <div className="decision-page">
            <header className="decision-hero container">
                <div className="decision-copy card-glass">
                    <span className="section-kicker">
                        {filters.lat ? '📍 Precision Context Active' : '🏗️ Building city-wide perspective'}
                    </span>
                    <h1>Pinpoint Discovery: Hyderabad</h1>
                    <p className="hero-subtext">
                        Intelligent, context-aware recommendations for your current vibe and safety.
                    </p>
                    
                    <div className="hero-actions">
                        <div className="context-selector-row">
                            <span className="row-label">Exploring as:</span>
                            <div className="context-pills">
                                {CONTEXT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        className={`context-pill ${filters.selectedContext === opt.id ? 'active' : ''}`}
                                        onClick={() => updateFilter({ selectedContext: opt.id })}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="container control-container">
                <div className="discovery-controls card-glass elevation-3">
                    <div className="search-bar-row">
                        <div className="smart-search-box">
                            <input 
                                type="text" 
                                placeholder="Describe your vibe (e.g., 'Quiet workspace', 'Hidden scenic lake')..." 
                                value={filters.q} 
                                onChange={(e) => updateFilter({ q: e.target.value })} 
                            />
                            <button className="vibe-cta-btn">Find my vibe</button>
                        </div>
                        <button className={`context-location-btn ${filters.lat ? 'synced' : ''}`} onClick={handleSyncLocation}>
                            {filters.lat ? '📍 Location Locked' : '📍 Sync GPS Data'}
                        </button>
                    </div>

                    <div className="suggestion-chips">
                        {['Peaceful', 'Date Night', 'Study Spot', 'Hidden Gem', 'Sunset Vibe', 'Niche Food'].map(mood => (
                            <button 
                                key={mood} 
                                className={`vibe-suggest-chip ${filters.q === mood ? 'active' : ''}`}
                                onClick={() => updateFilter({ q: mood })}
                            >
                                {mood}
                            </button>
                        ))}
                    </div>

                    <div className="category-scroll-group">
                        <span className="group-label">Category Clusters</span>
                        <div className="category-track">
                            {ALL_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-tab ${filters.category === cat ? 'active' : ''}`}
                                    onClick={() => updateFilter({ category: filters.category === cat ? '' : cat })}
                                >
                                    <span className="cat-icon">{CATEGORY_CONFIG[cat]?.icon || '📌'}</span>
                                    <span className="cat-name">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="quick-actions-row">
                        <button className="plan-trigger-btn" onClick={handleGeneratePlan} disabled={loading || (places || []).length < 3}>
                            ✨ Generate Smart Outing Plan
                        </button>
                    </div>

                    <div className="options-grid">
                        <div className="option-select">
                            <span>Set My Intent</span>
                            <select value={filters.intent} onChange={(e) => updateFilter({ intent: e.target.value })}>
                                <option value="">Every Intent</option>
                                {INTENT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className="option-select">
                            <span>Vibe Cluster</span>
                            <select value={filters.vibe} onChange={(e) => updateFilter({ vibe: e.target.value })}>
                                <option value="">Every Vibe</option>
                                {VIBE_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className="option-select">
                            <span>Budget Preference</span>
                            <select value={filters.maxBudget} onChange={(e) => updateFilter({ maxBudget: Number(e.target.value) })}>
                                <option value="2000">Any Budget</option>
                                <option value="200">Under ₹200</option>
                                <option value="500">Under ₹500</option>
                                <option value="1000">Under ₹1000</option>
                                <option value="5000">₹1000+</option>
                            </select>
                        </div>
                        <div className="option-select">
                            <span>Distance ({filters.distance}km)</span>
                            <input type="range" min="1" max="50" value={filters.distance} onChange={(e) => updateFilter({ distance: Number(e.target.value) })} />
                        </div>
                    </div>

                    {/* DEBUG TOGGLE */}
                    <button className="debug-toggle" onClick={() => setShowDebug(v => !v)}>
                        {showDebug ? '🔽 Hide Pinpoint Debug' : '🔧 Show Pinpoint Debug'}
                    </button>
                    {showDebug && debugInfo && (
                        <div className="debug-panel">
                            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* MINI PLAN SECTION */}
            {!loading && showPlan && miniPlan && (
                <section className="container mini-plan-section" id="itinerary-anchor">
                    <div className="mini-plan-card glass">
                        <div className="plan-header">
                            <div className="plan-label">✨ SMART ITINERARY</div>
                            <button className="close-plan" onClick={() => setShowPlan(false)}>×</button>
                        </div>
                        <h2>{miniPlan.title}</h2>
                        <p>{miniPlan.description} • <b>{miniPlan.totalTime}</b> • {miniPlan.totalBudgetRange}</p>
                        
                        <div className="plan-timeline">
                            {miniPlan.stops.map((stop, i) => (
                                <div key={stop.id} className="timeline-item">
                                    <div className="time-marker">{stop.time}</div>
                                    <div className="timeline-content card-glass">
                                        <div className="stop-main">
                                            <div className="stop-name-row">
                                                <h4>{stop.name}</h4>
                                                <span className="stop-category">{stop.category}</span>
                                            </div>
                                            <p className="stop-reason">{stop.reason}</p>
                                        </div>
                                        <div className="stop-footer">
                                            <span className="est-spend">Est. Spend: {stop.estimatedSpend}</span>
                                        </div>
                                    </div>
                                    {i < miniPlan.stops.length - 1 && <div className="timeline-connector"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FULL RANKED LIST + MAP */}
            <section className="container full-discovery-layout">
                <main className="ranked-list-panel">
                    <div className="panel-head">
                        <h2>All Ranked Discoveries</h2>
                        <p>{(places || []).length} {(places || []).length === 1 ? 'place' : 'places'} found{filters.category ? ` in ${filters.category}` : ''}.</p>
                    </div>
                    <div className="results-stack">
                        {!loading && (places || []).length === 0 ? (
                            <div className="empty-state">
                                <h3>No places found for this combination.</h3>
                                <p>Try clearing the category filter, changing the vibe, or increasing the distance radius.</p>
                                <button className="primary-cta" onClick={() => setFilters({ q: '', intent: '', vibe: '', category: '', distance: 25, lat: filters.lat, lng: filters.lng })}>
                                    Reset all filters
                                </button>
                            </div>
                        ) : (
                            (places || []).map(place => (
                                <div key={place.slug || place.id || place._id} onMouseEnter={() => setActivePlace(place)}><PlaceCard place={place} /></div>
                            ))
                        )}
                    </div>
                </main>

                <aside className="spatial-panel">
                    <div className="spatial-card glass sticky-map">
                        <div className="map-wrapper">
                            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="leaflet-shell">
                                <MapBoundsUpdater places={placesWithCoords} userLat={filters.lat} userLng={filters.lng} />
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                                {filters.lat && filters.lng && (
                                    <Marker position={[filters.lat, filters.lng]}>
                                        <Popup>📍 Your location</Popup>
                                    </Marker>
                                )}
                                {placesWithCoords.map(p => (
                                    <Marker
                                        key={p.slug || p.id || p._id}
                                        position={[p.location.coordinates[1], p.location.coordinates[0]]}
                                        opacity={activePlace && (activePlace._id === p._id || activePlace.slug === p.slug) ? 1 : 0.72}
                                        eventHandlers={{
                                            click: () => setActivePlace(p),
                                        }}
                                    >
                                        <Popup>
                                            <div className="mini-popup">
                                                <h4>{p.name}</h4>
                                                <p>{p.category} · {p.suitabilityScore}% match</p>
                                                <button onClick={() => navigate(`/place/${p.slug || p.id || p._id}`)}>View details</button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default SearchPage;
