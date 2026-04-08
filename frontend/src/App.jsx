import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import PlaceDetails from './pages/PlaceDetails';
import UserPreferences from './pages/UserPreferences';
import SavedPlaces from './pages/SavedPlaces';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/place/:id" element={<PlaceDetails />} />
            <Route path="/preferences" element={<UserPreferences />} />
            <Route path="/saved-places" element={<SavedPlaces />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
