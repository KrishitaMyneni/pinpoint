import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTENT_OPTIONS, getTimeSegment } from '../utils/decisionEngine';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const timeSegment = getTimeSegment(new Date().getHours());

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const trimmed = query.trim();
        navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    };

    const handleGetLocation = () => {
        setIsLocating(true);
        setStatus('Syncing live location for context-aware ranking...');

        if (!navigator.geolocation) {
            setStatus('GPS not available in this browser.');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                localStorage.setItem('userLoc', JSON.stringify({ lat: latitude, lng: longitude }));
                navigate(`/search?lat=${latitude}&lng=${longitude}&distance=10`);
                setIsLocating(false);
            },
            () => {
                setStatus('Location access failed. You can still explore in city-wide mode.');
                setIsLocating(false);
            }
        );
    };

    const handleIntentClick = (id) => {
        navigate(`/search?intent=${id}`);
    };

    const INTENT_ASSETS = {
        work: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
        chill: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=600',
        eat: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
        hangout: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
        explore: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600',
    };

    return (
        <main className="home-shell">
            <header className="home-hero container">
                <div className="hero-main">
                    <div className="hero-eyebrow">
                        <span>THE REAL-TIME DECISION ENGINE</span>
                    </div>
                    <h1>Escape search. Start discovery.</h1>
                    <p>Forget generic map lists. We rank the city around you based on your mood, the time, and what actually matters right now.</p>
                    
                    <div className="hero-search-card-container">
                        <form className="search-orb" onSubmit={handleSearch}>
                            <div className="search-field-wrapper">
                                <input 
                                    type="text" 
                                    placeholder="I want to find a quiet place to work..." 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button type="submit">Open engine</button>
                            </div>
                        </form>
                        
                        <div className="hero-quick-actions">
                            <button className="location-trigger-btn" onClick={handleGetLocation}>
                                {isLocating ? '📍 Syncing GPS...' : '📍 Use My Location'}
                            </button>
                            {status && <span className="home-status-msg">{status}</span>}
                        </div>
                    </div>

                    <div className="hero-status-pill glass">
                        <div className="pulse"></div>
                        <span><strong>{timeSegment.label} logic is live.</strong> Serving ranked picks for {timeSegment.id === 'morning' ? 'your morning energy' : timeSegment.id === 'evening' ? 'your night life' : 'your daily flow'}.</span>
                    </div>
                </div>
            </header>

            <section className="intent-section container">
                <div className="section-head">
                    <span className="section-kicker">DISCOVER BY CONTEXT</span>
                    <h2>What are we doing?</h2>
                </div>
                
                <div className="intent-discovery-grid">
                    {INTENT_OPTIONS.map(intent => (
                        <div 
                            key={intent.id} 
                            className="intent-card"
                            onClick={() => handleIntentClick(intent.id)}
                        >
                            <div 
                                className="intent-card-bg" 
                                style={{ backgroundImage: `url(${INTENT_ASSETS[intent.id]})` }}
                            />
                            <div className="intent-overlay" />
                            <div className="intent-content">
                                <span>{intent.id === 'work' ? 'FOCUS' : intent.id === 'chill' ? 'RELAX' : intent.id === 'eat' ? 'CRAVINGS' : intent.id === 'hangout' ? 'SOCIAL' : 'ADVENTURE'}</span>
                                <h3>{intent.label.replace('I want to ', '')}</h3>
                                <div className="intent-cta">Discover local picks →</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="home-footer container">
                <p>&copy; 2026 Pinpoint Engine. Precision context for physical places.</p>
            </footer>
        </main>
    );
};

export default Home;
