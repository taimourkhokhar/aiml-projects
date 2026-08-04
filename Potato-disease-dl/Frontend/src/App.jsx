import React, { useCallback, useRef, useState } from "react";
import "./App.css";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_URL = "http://localhost:8000/predict";
// Normalizes whatever label shape your FastAPI backend returns
// (handles "Potato___Early_blight", "Early Blight", "early_blight", etc.)
const DIAGNOSES = {
  healthy: {
    label: "Healthy",
    tone: "healthy",
    note: "No lesions detected. Leaf tissue reads clean.",
  },
  early_blight: {
    label: "Early Blight",
    tone: "early",
    note: "Concentric ring lesions consistent with Alternaria solani.",
  },
  late_blight: {
    label: "Late Blight",
    tone: "late",
    note: "Water-soaked, spreading lesions consistent with Phytophthora infestans.",
  },
};

function normalizeClass(raw) {
  if (!raw) return null;
  const key = raw
    .toString()
    .toLowerCase()
    .replace(/^potato_+/, "")
    .replace(/[^a-z]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (key.includes("early")) return DIAGNOSES.early_blight;
  if (key.includes("late")) return DIAGNOSES.late_blight;
  if (key.includes("healthy")) return DIAGNOSES.healthy;
  return { label: raw.toString(), tone: "unknown", note: "" };
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | done | error
  const [result, setResult] = useState(null); // { diagnosis, confidence }
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setPreview(null);
    setFileName("");
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
  };

  const runInference = useCallback(async (file) => {
    setStatus("processing");
    setErrorMsg("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(API_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();

      const rawClass = data.class ?? data.predicted_class ?? data.label;
      const rawConfidence = data.confidence ?? data.probability ?? 0;
      const confidencePct =
        rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence;

      setResult({
        diagnosis: normalizeClass(rawClass),
        confidence: Math.round(confidencePct * 10) / 10,
      });
      setStatus("done");
    } catch (err) {
      setErrorMsg(
        err.message === "Failed to fetch"
          ? "Can't reach the model server. Is it running at localhost:8000?"
          : err.message
      );
      setStatus("error");
    }
  }, []);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) {
        setErrorMsg("That's not an image file. Try a JPG or PNG of a leaf.");
        setStatus("error");
        return;
      }
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      runInference(file);
    },
    [runInference]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onBrowse = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const tone = result?.diagnosis?.tone;

  return (
    <div className="page">
      <div className="bg-scene" aria-hidden="true">
        <div className="bg-photo" />
        <div className="bg-photo-overlay" />
        <div className="blob blob--a" />
        <div className="blob blob--b" />
        <div className="blob blob--c" />
        <div className="blob blob--d" />
        <div className="bg-grain" />
      </div>

      <header className="masthead">
        <div className="eyebrow">
          <span className="dot" aria-hidden="true" />
          Solanum Diagnostic Lab — CNN Leaf Scanner
        </div>
        <h1>
          Know the blight <em>before</em> it spreads.
        </h1>
        <p className="sub">
          Drop in a photo of a potato leaf. The model reads it in seconds and
          reports early blight, late blight, or a clean bill of health —
          with a confidence score attached.
        </p>
      </header>

      <main className="bench">
        {/* ---------------- Specimen slide / dropzone ---------------- */}
        <section
          className={`slide ${dragActive ? "slide--active" : ""} ${
            status === "processing" ? "slide--scanning" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload a potato leaf photo"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <span className="corner corner--tl" />
          <span className="corner corner--tr" />
          <span className="corner corner--bl" />
          <span className="corner corner--br" />

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onBrowse}
          />

          {preview ? (
            <img src={preview} alt="Uploaded leaf specimen" className="specimen-img" />
          ) : (
            <div className="slide-empty">
              <LeafIcon />
              <p className="slide-title">Place specimen here</p>
              <p className="slide-hint">
                Drag a leaf photo in, or click to browse your files
              </p>
            </div>
          )}

          {status === "processing" && (
            <div className="scanline" aria-hidden="true" />
          )}

          {status === "done" && result?.diagnosis && (
            <div className={`stamp stamp--${tone}`}>
              {result.diagnosis.label}
            </div>
          )}

          {preview && (
            <button
              type="button"
              className="clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              aria-label="Remove image"
            >
              ×
            </button>
          )}
        </section>

        {/* ---------------- Diagnosis report ---------------- */}
        <section className="report" aria-live="polite">
          <h2 className="report-title">Diagnosis report</h2>

          {status === "idle" && (
            <div className="report-empty">
              <p>Awaiting specimen.</p>
              <p className="report-empty-sub">
                Results — disease class and model confidence — will appear
                here once an image is uploaded.
              </p>
            </div>
          )}

          {status === "processing" && (
            <div className="report-processing">
              <div className="pulse-row">
                <span className="pulse-dot" />
                <span className="pulse-dot" />
                <span className="pulse-dot" />
              </div>
              <p>Reading leaf tissue…</p>
              <p className="report-empty-sub">
                {fileName ? `Analyzing ${fileName}` : "Analyzing image"}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="report-error">
              <p className="report-error-title">Scan failed</p>
              <p className="report-empty-sub">{errorMsg}</p>
              <button className="retry-btn" onClick={reset}>
                Try another photo
              </button>
            </div>
          )}

          {status === "done" && result && (
            <div className="report-result">
              <div className={`class-row class-row--${tone}`}>
                <span className="class-swatch" />
                <div>
                  <div className="class-label">{result.diagnosis.label}</div>
                  <div className="class-note">{result.diagnosis.note}</div>
                </div>
              </div>

              <div className="confidence-block">
                <div className="confidence-label">
                  <span>Confidence</span>
                  <span className="confidence-value">
                    {result.confidence.toFixed(1)}%
                  </span>
                </div>
                <div className="confidence-track">
                  <div
                    className={`confidence-fill confidence-fill--${tone}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div className="legend">
                <span className="legend-item legend-item--healthy">
                  Healthy
                </span>
                <span className="legend-item legend-item--early">
                  Early blight
                </span>
                <span className="legend-item legend-item--late">
                  Late blight
                </span>
              </div>

              <button className="retry-btn" onClick={reset}>
                Scan another leaf
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="foot">
       CNN trained on the PlantVillage potato leaf
        set
      </footer>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M8 32C8 18 18 8 32 8C32 22 22 32 8 32Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 30C16 24 22 18 30 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}