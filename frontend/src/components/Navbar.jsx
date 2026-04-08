import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="premium-nav glass">
            <div className="container nav-container">
                <NavLink to="/" className="nav-logo">
                    <div className="logo-box">P</div>
                    <div className="logo-copy">
                        <span>Pinpoint</span>
                        <small>Decision Engine</small>
                    </div>
                </NavLink>

                <div className="nav-links">
                    <NavLink to="/search" className="nav-link-item">Discover</NavLink>
                    <NavLink to="/saved-places" className="nav-link-item">Shortlist</NavLink>
                    <NavLink to="/preferences" className="nav-link-item">Preferences</NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
