import { useMemo } from "react";

// A 240-degree instrument dial, styled like a network signal meter.
// Sweeps from teal (retained) through amber (at risk) as probability rises.
export default function SignalGauge({ probability = null, animate = true }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 84;
  const startAngle = -210; // degrees
  const sweep = 240;

  const polarToCartesian = (angleDeg, r) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeArc = (r, aStart, aEnd) => {
    const start = polarToCartesian(aEnd, r);
    const end = polarToCartesian(aStart, r);
    const largeArc = aEnd - aStart <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const ticks = useMemo(() => {
    const marks = [];
    const count = 12;
    for (let i = 0; i <= count; i++) {
      const angle = startAngle + (sweep * i) / count;
      const outer = polarToCartesian(angle, radius + 12);
      const inner = polarToCartesian(angle, radius + i % 3 === 0 ? 4 : 6);
      marks.push({ x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major: i % 3 === 0 });
    }
    return marks;
  }, []);

  const hasValue = probability !== null && !Number.isNaN(probability);
  const clamped = hasValue ? Math.min(1, Math.max(0, probability)) : 0;
  const valueAngle = startAngle + sweep * clamped;

  const trackPath = describeArc(radius, startAngle, startAngle + sweep);
  const fillPath = hasValue ? describeArc(radius, startAngle, valueAngle) : "";

  const needleTip = polarToCartesian(valueAngle, radius - 14);
  const needleBase1 = polarToCartesian(valueAngle - 90, 4);
  const needleBase2 = polarToCartesian(valueAngle + 90, 4);

  const color = hasValue
    ? clamped < 0.33
      ? "var(--teal)"
      : clamped < 0.66
      ? "#e8b84b"
      : "var(--amber)"
    : "var(--muted-2)";

  return (
    <div className="gauge-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <linearGradient id="gaugeFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--teal)" />
            <stop offset="55%" stopColor="#e8b84b" />
            <stop offset="100%" stopColor="var(--amber)" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.major ? "var(--muted)" : "var(--muted-2)"}
            strokeWidth={t.major ? 2 : 1}
            strokeLinecap="round"
          />
        ))}

        <path
          d={trackPath}
          fill="none"
          stroke="var(--panel-2)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {hasValue && (
          <path
            d={fillPath}
            fill="none"
            stroke="url(#gaugeFill)"
            strokeWidth="10"
            strokeLinecap="round"
            style={{
              transition: animate ? "d 700ms cubic-bezier(.4,0,.2,1)" : "none",
            }}
          />
        )}

        {hasValue && (
          <g style={{ transition: animate ? "transform 700ms cubic-bezier(.4,0,.2,1)" : "none" }}>
            <line
              x1={needleBase1.x}
              y1={needleBase1.y}
              x2={needleTip.x}
              y2={needleTip.y}
              stroke={color}
              strokeWidth="2"
            />
            <line
              x1={needleBase2.x}
              y1={needleBase2.y}
              x2={needleTip.x}
              y2={needleTip.y}
              stroke={color}
              strokeWidth="2"
            />
            <circle cx={cx} cy={cy} r="4" fill={color} />
          </g>
        )}

        <text
          x={cx}
          y={cy + 34}
          textAnchor="middle"
          className="gauge-value"
          fill={color}
        >
          {hasValue ? `${Math.round(clamped * 100)}%` : "—"}
        </text>
        <text x={cx} y={cy + 52} textAnchor="middle" className="gauge-caption">
          CHURN LIKELIHOOD
        </text>
      </svg>
    </div>
  );
}
