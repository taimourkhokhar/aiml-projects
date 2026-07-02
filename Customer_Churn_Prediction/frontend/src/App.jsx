import { useState } from "react";
import SignalGauge from "./components/SignalGauge.jsx";
import { SelectField, NumberField, ToggleField } from "./components/Field.jsx";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://beautiful-cooperation-production-39c6.up.railway.app";
const YES_NO = [
  { value: "Yes" },
  { value: "No" },
];

const YES_NO_INTERNET = [
  { value: "Yes" },
  { value: "No" },
  { value: "No internet service", label: "No internet service" },
];

const initialForm = {
  gender: "Female",
  SeniorCitizen: 0,
  Partner: "No",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 70,
  TotalCharges: 840,
};

function Section({ eyebrow, title, children }) {
  return (
    <section className="form-section">
      <div className="form-section-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleToggle = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const internetOff = form.InternetService === "No";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // If there's no internet service, dependent fields must read "No internet service"
    const payload = { ...form };
    if (internetOff) {
      ["OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies"].forEach(
        (k) => (payload[k] = "No internet service")
      );
    }
    if (form.PhoneService === "No") {
      payload.MultipleLines = "No phone service";
    }

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong reaching the prediction service.");
    } finally {
      setLoading(false);
    }
  };

  const riskCopy = {
    Low: "This customer looks anchored. No action needed right now.",
    Medium: "Some warning signs. Worth a check-in before renewal.",
    High: "Strong churn signal. Prioritize outreach this week.",
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="wordmark">
          <span className="wordmark-dot" />
          SIGNAL
        </div>
        <p className="topbar-sub">Churn risk console — read a customer before they walk.</p>
      </header>

      <main className="layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <Section eyebrow="01 — Profile" title="Who's the customer">
            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[{ value: "Female" }, { value: "Male" }]}
            />
            <ToggleField
              label="Senior citizen"
              name="SeniorCitizen"
              value={form.SeniorCitizen}
              onChange={handleToggle}
            />
            <ToggleField label="Has partner" name="Partner" value={form.Partner} onChange={handleToggle} />
            <ToggleField label="Has dependents" name="Dependents" value={form.Dependents} onChange={handleToggle} />
            <NumberField
              label="Tenure"
              name="tenure"
              value={form.tenure}
              onChange={handleChange}
              min={0}
              max={100}
              step={1}
              hint="months with the company"
            />
          </Section>

          <Section eyebrow="02 — Services" title="What they're subscribed to">
            <ToggleField label="Phone service" name="PhoneService" value={form.PhoneService} onChange={handleToggle} />
            <SelectField
              label="Multiple lines"
              name="MultipleLines"
              value={form.PhoneService === "No" ? "No phone service" : form.MultipleLines}
              onChange={handleChange}
              options={
                form.PhoneService === "No"
                  ? [{ value: "No phone service", label: "No phone service" }]
                  : [{ value: "No" }, { value: "Yes" }]
              }
            />
            <SelectField
              label="Internet service"
              name="InternetService"
              value={form.InternetService}
              onChange={handleChange}
              options={[{ value: "DSL" }, { value: "Fiber optic", label: "Fiber optic" }, { value: "No" }]}
            />
            <SelectField
              label="Online security"
              name="OnlineSecurity"
              value={internetOff ? "No internet service" : form.OnlineSecurity}
              onChange={handleChange}
              options={internetOff ? [{ value: "No internet service", label: "No internet service" }] : YES_NO}
            />
            <SelectField
              label="Online backup"
              name="OnlineBackup"
              value={internetOff ? "No internet service" : form.OnlineBackup}
              onChange={handleChange}
              options={internetOff ? [{ value: "No internet service", label: "No internet service" }] : YES_NO}
            />
            <SelectField
              label="Device protection"
              name="DeviceProtection"
              value={internetOff ? "No internet service" : form.DeviceProtection}
              onChange={handleChange}
              options={internetOff ? [{ value: "No internet service", label: "No internet service" }] : YES_NO}
            />
            <SelectField
              label="Tech support"
              name="TechSupport"
              value={internetOff ? "No internet service" : form.TechSupport}
              onChange={handleChange}
              options={internetOff ? [{ value: "No internet service", label: "No internet service" }] : YES_NO}
            />
            <SelectField
              label="Streaming TV"
              name="StreamingTV"
              value={internetOff ? "No internet service" : form.StreamingTV}
              onChange={handleChange}
              options={internetOff ? [{ value: "No internet service", label: "No internet service" }] : YES_NO}
            />
            <SelectField
              label="Streaming movies"
              name="StreamingMovies"
              value={internetOff ? "No internet service" : form.StreamingMovies}
              onChange={handleChange}
              options={internetOff ? [{ value: "No internet service", label: "No internet service" }] : YES_NO}
            />
          </Section>

          <Section eyebrow="03 — Account" title="Contract & billing">
            <SelectField
              label="Contract"
              name="Contract"
              value={form.Contract}
              onChange={handleChange}
              options={[{ value: "Month-to-month" }, { value: "One year" }, { value: "Two year" }]}
            />
            <ToggleField
              label="Paperless billing"
              name="PaperlessBilling"
              value={form.PaperlessBilling}
              onChange={handleToggle}
            />
            <SelectField
              label="Payment method"
              name="PaymentMethod"
              value={form.PaymentMethod}
              onChange={handleChange}
              options={[
                { value: "Electronic check" },
                { value: "Mailed check" },
                { value: "Bank transfer (automatic)" },
                { value: "Credit card (automatic)" },
              ]}
            />
            <NumberField
              label="Monthly charges"
              name="MonthlyCharges"
              value={form.MonthlyCharges}
              onChange={handleChange}
              min={0}
              step={0.5}
              prefix="$"
            />
            <NumberField
              label="Total charges to date"
              name="TotalCharges"
              value={form.TotalCharges}
              onChange={handleChange}
              min={0}
              step={1}
              prefix="$"
            />
          </Section>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Reading signal…" : "Read churn risk"}
          </button>
        </form>

        <aside className="panel readout-panel">
          <div className="readout-head">
            <span className="eyebrow">Readout</span>
            <h2>Risk instrument</h2>
          </div>

          <SignalGauge probability={result ? result.churn_probability : null} />

          {!result && !error && (
            <p className="readout-empty">
              Fill in the customer profile and read the risk. Nothing is scored until you submit.
            </p>
          )}

          {error && (
            <div className="readout-error">
              <strong>Couldn't reach the model.</strong>
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="readout-result">
              <div className={`risk-badge risk-badge--${result.risk_level.toLowerCase()}`}>
                {result.risk_level} risk
              </div>
              <p className="readout-copy">{riskCopy[result.risk_level]}</p>

              <div className="split-bar">
                <div
                  className="split-bar-fill split-bar-fill--retain"
                  style={{ width: `${result.retain_probability * 100}%` }}
                />
              </div>
              <div className="split-legend">
                <span>
                  <i className="dot dot--teal" /> Retain {(result.retain_probability * 100).toFixed(1)}%
                </span>
                <span>
                  <i className="dot dot--amber" /> Churn {(result.churn_probability * 100).toFixed(1)}%
                </span>
              </div>

              <div className="readout-verdict">
                Predicted outcome: <strong>{result.churn_label === "Yes" ? "Will churn" : "Will stay"}</strong>
              </div>
            </div>
          )}
        </aside>
      </main>

      <footer className="footer">
        Model: logistic regression trained on the Telco Customer Churn dataset 
      </footer>
    </div>
  );
}
