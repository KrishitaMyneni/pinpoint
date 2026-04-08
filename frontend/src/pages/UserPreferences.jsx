import React, { useState } from 'react';
import { BUDGET_OPTIONS, CROWD_OPTIONS, INTENT_OPTIONS, TIME_BUDGET_OPTIONS, VIBE_OPTIONS } from '../utils/decisionEngine';
import './UserPreferences.css';

const STORAGE_KEY = 'userPrefs';

const loadPreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          preferredDistance: 10,
          favoriteIntent: 'work',
          defaultVibe: 'productive',
          budget: 'balanced',
          availableTime: 'flexible',
          crowdMode: 'any',
          openNowOnly: false,
        };
  } catch (error) {
    return {
      preferredDistance: 10,
      favoriteIntent: 'work',
      defaultVibe: 'productive',
      budget: 'balanced',
      availableTime: 'flexible',
      crowdMode: 'any',
      openNowOnly: false,
    };
  }
};

const UserPreferences = () => {
  const [prefs, setPrefs] = useState(loadPreferences);
  const [status, setStatus] = useState('');

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setStatus('Preferences saved. New searches will use these defaults.');
  };

  return (
    <div className="preferences-page">
      <div className="container preferences-shell">
        <div className="preferences-header">
          <span className="section-kicker">PERSONALIZATION</span>
          <h1>Train the engine around your defaults.</h1>
          <p>These settings shape the ranking logic when you have not explicitly chosen a new intent, vibe, or budget.</p>
        </div>

        <form className="preferences-form" onSubmit={handleSave}>
          <section className="preferences-card">
            <div className="preferences-card-head">
              <h2>Default decision radius</h2>
              <strong>{prefs.preferredDistance} km</strong>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={prefs.preferredDistance}
              onChange={(event) => setPrefs((current) => ({ ...current, preferredDistance: Number(event.target.value) }))}
            />
          </section>

          <section className="preferences-card">
            <div className="preferences-card-head">
              <h2>Favorite intent</h2>
              <p>Used as the default discovery mode when nothing else is selected.</p>
            </div>
            <div className="choice-grid">
              {INTENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-pill ${prefs.favoriteIntent === option.id ? 'active' : ''}`}
                  onClick={() => setPrefs((current) => ({ ...current, favoriteIntent: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="preferences-card">
            <div className="preferences-card-head">
              <h2>Default vibe</h2>
              <p>Applies soft ranking weight even when you do not explicitly filter by vibe.</p>
            </div>
            <div className="choice-grid compact">
              {VIBE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-pill ${prefs.defaultVibe === option.id ? 'active' : ''}`}
                  onClick={() => setPrefs((current) => ({ ...current, defaultVibe: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="preferences-card dual-card">
            <div>
              <div className="preferences-card-head">
                <h2>Budget mode</h2>
              </div>
              <div className="choice-grid compact">
                {BUDGET_OPTIONS.filter((option) => option.id).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`choice-pill ${prefs.budget === option.id ? 'active' : ''}`}
                    onClick={() => setPrefs((current) => ({ ...current, budget: option.id }))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="preferences-card-head">
                <h2>Available time</h2>
              </div>
              <div className="choice-grid compact">
                {TIME_BUDGET_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`choice-pill ${prefs.availableTime === option.id ? 'active' : ''}`}
                    onClick={() => setPrefs((current) => ({ ...current, availableTime: option.id }))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="preferences-card dual-card">
            <div>
              <div className="preferences-card-head">
                <h2>Crowd preference</h2>
              </div>
              <div className="choice-grid compact">
                {CROWD_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`choice-pill ${prefs.crowdMode === option.id ? 'active' : ''}`}
                    onClick={() => setPrefs((current) => ({ ...current, crowdMode: option.id }))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="toggle-card">
              <div className="preferences-card-head">
                <h2>Open now by default</h2>
                <p>Useful when you want the engine to ignore closed places automatically.</p>
              </div>
              <button
                type="button"
                className={`toggle-button ${prefs.openNowOnly ? 'active' : ''}`}
                onClick={() => setPrefs((current) => ({ ...current, openNowOnly: !current.openNowOnly }))}
              >
                {prefs.openNowOnly ? 'Only show open places' : 'Include closed places when relevant'}
              </button>
            </div>
          </section>

          <div className="preferences-actions">
            <button className="save-btn" type="submit">Save decision defaults</button>
            <span className="preferences-status">{status}</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPreferences;
