import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="minimal-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo-box-mini">P</div>
          <span>Pinpoint</span>
          <p>A real-time decision engine for physical places, built to answer why this place makes sense right now.</p>
        </div>

        <div className="footer-links-group">
          <div className="link-column">
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/search">Decision Feed</Link>
            <Link to="/saved-places">Saved Shortlist</Link>
          </div>
          <div className="link-column">
            <h4>Logic</h4>
            <Link to="/search?intent=hangout">Intent mode</Link>
            <Link to="/search?vibe=hidden-gem">Vibe mode</Link>
            <Link to="/preferences">Preferences</Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>Google Maps tells you what is around you. Pinpoint tells you what makes sense.</p>
        <div className="social-links">
          <span className="social-icon">Decision-first UX</span>
          <span className="social-icon">Time-aware ranking</span>
          <span className="social-icon">Micro-curated picks</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
