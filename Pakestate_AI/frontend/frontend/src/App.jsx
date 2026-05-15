import React, { useState } from "react";
import "./App.css";

// ── Data matching your Zameen.com dataset ──────────────────────────────────
const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"
];

const LOCATIONS_BY_CITY = {
  Karachi:    ["DHA", "Clifton", "Gulshan-e-Iqbal", "North Nazimabad", "Nazimabad", "PECHS", "Bahria Town", "Scheme 33"],
  Lahore:     ["DHA", "Gulberg", "Model Town", "Johar Town", "Bahria Town", "Cantt", "Iqbal Town", "Wapda Town"],
  Islamabad:  ["F-6", "F-7", "F-8", "F-10", "F-11", "G-9", "G-10", "G-11", "Bahria Town", "DHA"],
  Rawalpindi: ["Bahria Town", "DHA", "Satellite Town", "Gulraiz", "Chaklala Scheme"],
  Faisalabad: ["Gulberg", "Peoples Colony", "Canal Road", "Satiana Road"],
  Multan:     ["DHA", "Cantt", "Gulgasht", "Shah Rukn-e-Alam"],
  Peshawar:   ["Hayatabad", "University Town", "DHA", "Ring Road"],
  Quetta:     ["Jinnah Town", "Satellite Town", "Sariab Road"],
  Sialkot:    ["Cantt", "Allama Iqbal Town", "Paris Road"],
  Gujranwala: ["Model Town", "Peoples Colony", "DHA"],
};

const PROPERTY_TYPES = ["House", "Flat"];

const initialForm = {
  city: "Lahore",
  location: "DHA",
  bedrooms: 3,
  baths: 2,
  area_sqft: "",
  property_type: "House",
};

// ── Stepper component ──────────────────────────────────────────────────────
function Stepper({ label, name, value, onChange, min = 1, max = 20 }) {
  return (
    <div className="stepper-row">
      <span className="stepper-label">{label}</span>
      <div className="stepper-wrap">
        <button type="button" className="step-btn"
          onClick={() => onChange(name, Math.max(min, value - 1))}>−</button>
        <span className="step-val">{value}</span>
        <button type="button" className="step-btn"
          onClick={() => onChange(name, Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setForm(f => {
      const updated = { ...f, [name]: value };
      // Reset location when city changes
      if (name === "city") {
        updated.location = LOCATIONS_BY_CITY[value]?.[0] || "";
      }
      return updated;
    });
    setResult(null);
    setError(null);
  };

  const handleInput = e => handleChange(e.target.name, e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.area_sqft || parseFloat(form.area_sqft) < 1) {
      setError("Please enter a valid area_sqft.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Exact payload matching your FastAPI HouseData schema
      const payload = {
        city: form.city,
        location: form.location,
        bedrooms: parseInt(form.bedrooms),
        baths: parseInt(form.baths),
        area_sqft: parseFloat(form.area_sqft),
        property_type: form.property_type,
      };

      const res = await fetch("https://pakestate.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || "Prediction failed.");
      } else {
        setResult(data.predicted_price);
      }
    } catch (err) {
      setError("Cannot reach backend. Run: uvicorn app:app --reload");
    } finally {
      setLoading(false);
    }
  };

  const formatted = result !== null
    ? `PKR ${Number(result).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`
    : null;

  const locations = LOCATIONS_BY_CITY[form.city] || [];

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⌂</span>
            <div>
              <h1 className="logo-title">PakEstate AI</h1>
              <p className="logo-sub">Zameen.com · Linear Regression · R² 0.60</p>
            </div>
          </div>
          <div className="header-right">
            <span className="api-dot" title="FastAPI backend" />
            <span className="api-label">FastAPI</span>
          </div>
        </div>
      </header>

      <main className="main">

        {/* Form card */}
        <div className="card">
          <h2 className="section-title">Property Details</h2>
          <form onSubmit={handleSubmit}>

            {/* City + Location row */}
            <div className="row-2">
              <div className="field">
                <label className="field-label">City</label>
                <select className="field-select" name="city"
                  value={form.city} onChange={handleInput}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Location</label>
                <select className="field-select" name="location"
                  value={form.location} onChange={handleInput}>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* area_sqft + Property type row */}
            <div className="row-2">
              <div className="field">
                <label className="field-label">area_sqft <span className="field-unit"></span></label>
                <input className="field-input" type="number" name="area_sqft"
                  value={form.area_sqft} onChange={handleInput}
                  placeholder="e.g. 10" min="1" step="0.5" required />
              </div>
              <div className="field">
                <label className="field-label">Property Type</label>
                <select className="field-select" name="property_type"
                  value={form.property_type} onChange={handleInput}>
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Bedrooms + Bathrooms steppers */}
            <div className="steppers-grid">
              <Stepper label="Bedrooms" name="bedrooms"
                value={form.bedrooms} onChange={handleChange} min={1} max={15} />
              <Stepper label="Bathrooms" name="baths"
                value={form.baths} onChange={handleChange} min={1} max={10} />
            </div>

            {/* Summary chips */}
            <div className="chips">
              <span className="chip">{form.city}</span>
              <span className="chip">{form.location}</span>
              <span className="chip">{form.area_sqft || "—"} Sqft</span>
              <span className="chip">{form.property_type}</span>
              <span className="chip">{form.bedrooms} Bed</span>
              <span className="chip">{form.baths} Bath</span>
            </div>

            <button type="submit"
              className={`predict-btn ${loading ? "loading" : ""}`}
              disabled={loading}>
              {loading
                ? <><span className="spinner" /> Predicting…</>
                : "Get Price Estimate"}
            </button>
          </form>
        </div>

        {/* Result */}
        {formatted && (
          <div className="card result-card">
            <p className="result-eyebrow">Estimated Market Price</p>
            <p className="result-price">{formatted}</p>
            <div className="result-details">
              <div className="result-detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-val">{form.location}, {form.city}</span>
              </div>
              <div className="result-detail-item">
                <span className="detail-label">Property</span>
                <span className="detail-val">{form.property_type} · {form.area_sqft} Sqft</span>
              </div>
              <div className="result-detail-item">
                <span className="detail-label">Config</span>
                <span className="detail-val">{form.bedrooms} Bed · {form.baths} Bath</span>
              </div>
            </div>
            <p className="result-note">
              Prediction powered by Linear Regression trained on Zameen.com data.
              Actual prices may vary based on market conditions.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card error-card">
            <span className="error-icon">⚠</span>
            <div>
              <p className="error-title">Prediction Error</p>
              <p className="error-msg">{error}</p>
            </div>
          </div>
        )}

        {/* API info footer
        <div className="api-info">
          <code>POST http://localhost:8000/predict</code>
          <span>·</span>
          <code>uvicorn app:app --reload</code>
        </div> */}

      </main>
    </div>
  );
}