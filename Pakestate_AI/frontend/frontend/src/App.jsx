import React, { useState } from "react";
import "./App.css";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"];

const LOCATIONS_BY_CITY = {
  Lahore: [
    "DHA Defence", "DHA 11 Rahbar", "Gulberg", "Model Town",
    "Johar Town", "Bahria Town", "Bahria Orchard", "Cantt",
    "Iqbal Town", "Wapda Town", "Garden Town", "Allama Iqbal Town",
    "EME Society", "Lake City", "LDA Avenue", "Paragon City",
    "Canal View", "Valencia Housing Society", "Askari 10", "Askari 11",
  ],
  Islamabad: [
    "F-10", "F-11", "F-9", "F-6", "F-7", "F-8", "F-15",
    "G-5", "G-6", "G-7", "G-9", "G-10", "G-11", "G-13", "G-14", "G-15", "G-16",
    "E-11", "D-12", "Blue Area", "Bani Gala",
    "Bahria Town Islamabad", "Diplomatic Enclave",
    "Satellite Town", "University Town", "Chaklala Scheme",
  ],
  Karachi: [
    "DHA Defence", "DHA City Karachi", "Clifton", "Old Clifton",
    "Bath Island", "Zamzama", "PECHS", "KDA Scheme 1",
    "North Nazimabad", "Nazimabad", "Gulshan-e-Iqbal",
    "Scheme 33", "Bahria Town Karachi",
  ],
  Rawalpindi: [
    "Bahria Town Rawalpindi", "Askari 12", "Askari 14",
    "Westridge", "Gulraiz Housing Scheme",
    "Satellite Town", "Chaklala Scheme", "Pindora",
  ],
};

const PROPERTY_TYPES = ["House", "Flat", "Upper Portion", "Lower Portion", "Penthouse", "Room"];

const initialForm = {
  city: "Lahore",
  location: "DHA 11 Rahbar",
  bedrooms: 3,
  baths: 2,
  area_marla: "",
  property_type: "House",
};

function Stepper({ label, name, value, onChange, min = 1, max = 20 }) {
  return (
    <div className="stepper-box">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button
          type="button"
          className="step-btn"
          onClick={() => onChange(name, Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="step-val">{value}</span>
        <button
          type="button"
          className="step-btn"
          onClick={() => onChange(name, Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setForm(f => {
      const updated = { ...f, [name]: value };
      if (name === "city") updated.location = LOCATIONS_BY_CITY[value]?.[0] || "";
      return updated;
    });
    setResult(null);
    setError(null);
  };

  const handleInput = e => handleChange(e.target.name, e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.area_marla || parseFloat(form.area_marla) < 1) {
      setError("Please enter a valid area in Marla (minimum 1).");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const payload = {
        city: form.city,
        location: form.location,
        bedrooms: parseInt(form.bedrooms),
        baths: parseInt(form.baths),
        area_marla: parseFloat(form.area_marla),
        property_type: form.property_type,
      };
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = data.detail
          ? (Array.isArray(data.detail) ? data.detail.map(e => e.msg).join(", ") : data.detail)
          : "Prediction failed.";
        setError(errMsg);
      } else {
        setResult(data);
      }
    } catch {
      setError("Cannot reach backend. Make sure uvicorn is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const crore = result ? (result.predicted_price / 1e7).toFixed(2) : null;
  const lakh  = result ? (result.predicted_price / 1e5).toFixed(1) : null;
  const locations = LOCATIONS_BY_CITY[form.city] || [];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">⌂</div>
            <div>
              <h1 className="logo-title">PakEstate AI</h1>
              <p className="logo-sub">Powered by Zameen.com data</p>
            </div>
          </div>
          <span className="badge">Random Forest</span>
        </div>
      </header>

      {/* Hero */}
      <div className="hero">
        <p className="hero-label">AI Price Estimator</p>
        <h2 className="hero-title">
          What's your property <em>worth?</em>
        </h2>
        <p className="hero-sub">Instant estimates across Pakistan's top cities</p>
      </div>

      {/* Main */}
      <main className="main">
        {/* Form card */}
        <div className="card">
          <p className="card-title">Property Details</p>
          <form onSubmit={handleSubmit}>
            <div className="row-2">
              <div className="field">
                <label className="field-label">City</label>
                <select className="field-select" name="city" value={form.city} onChange={handleInput}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Location</label>
                <select className="field-select" name="location" value={form.location} onChange={handleInput}>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label className="field-label">Area (Marla)</label>
                <input
                  className="field-input"
                  type="number"
                  name="area_marla"
                  value={form.area_marla}
                  onChange={handleInput}
                  placeholder="e.g. 5"
                  min="1"
                  step="0.5"
                  required
                />
              </div>
              <div className="field">
                <label className="field-label">Property Type</label>
                <select className="field-select" name="property_type" value={form.property_type} onChange={handleInput}>
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="divider" />

            <div className="steppers-grid">
              <Stepper label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} min={1} max={15} />
              <Stepper label="Bathrooms" name="baths" value={form.baths} onChange={handleChange} min={1} max={10} />
            </div>

            <button type="submit" className="predict-btn" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Estimating price…</>
                : "Get Price Estimate →"
              }
            </button>
          </form>
        </div>

        {/* Result */}
        {result && crore && (
          <div className="card result-card">
            <p className="result-eyebrow">Estimated Market Price</p>
            <p className="result-price">
              PKR {crore} Cr <span>≈ {lakh} Lakh</span>
            </p>
            <div className="result-grid">
              <div className="result-stat">
                <p className="stat-label">Location</p>
                <p className="stat-val">{form.location}</p>
              </div>
              <div className="result-stat">
                <p className="stat-label">City</p>
                <p className="stat-val">{form.city}</p>
              </div>
              <div className="result-stat">
                <p className="stat-label">Area</p>
                <p className="stat-val">{form.area_marla} Marla</p>
              </div>
              <div className="result-stat">
                <p className="stat-label">Type</p>
                <p className="stat-val">{form.property_type}</p>
              </div>
              <div className="result-stat">
                <p className="stat-label">Beds</p>
                <p className="stat-val">{form.bedrooms}</p>
              </div>
              <div className="result-stat">
                <p className="stat-label">Baths</p>
                <p className="stat-val">{form.baths}</p>
              </div>
            </div>
            <div className="result-divider" />
            <p className="result-note">
              Prediction by Random Forest (R² 0.84) trained on Zameen.com listings.
              Actual prices may vary based on condition, floor, and market demand.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card error-card">
            <span>⚠️</span>
            <div>
              <p className="error-title">Could not estimate price</p>
              <p className="error-msg">{error}</p>
            </div>
          </div>
        )}

        {/* Accuracy bar */}
        <div className="accuracy-bar">
          <strong>Model accuracy</strong> — Random Forest trained on 150k+ Zameen.com listings
          <span className="r2-pill">R² 0.84</span>
        </div>
      </main>
    </div>
  );
}