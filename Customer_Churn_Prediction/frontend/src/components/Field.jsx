export function SelectField({ label, name, value, onChange, options, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="field-control"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function NumberField({ label, name, value, onChange, min, max, step, hint, prefix }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="field-number">
        {prefix && <span className="field-prefix">{prefix}</span>}
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="field-control field-control--number"
        />
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function ToggleField({ label, name, value, onChange, hint }) {
  const isYes = value === "Yes" || value === 1;
  const yesVal = typeof value === "number" ? 1 : "Yes";
  const noVal = typeof value === "number" ? 0 : "No";
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="toggle-row" role="radiogroup" aria-label={label}>
        <button
          type="button"
          role="radio"
          aria-checked={isYes}
          className={`toggle-btn ${isYes ? "toggle-btn--active" : ""}`}
          onClick={() => onChange({ target: { name, value: yesVal } })}
        >
          Yes
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={!isYes}
          className={`toggle-btn ${!isYes ? "toggle-btn--active" : ""}`}
          onClick={() => onChange({ target: { name, value: noVal } })}
        >
          No
        </button>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
