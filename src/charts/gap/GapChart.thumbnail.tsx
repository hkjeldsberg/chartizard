export function GapThumbnail() {
  // Eight vertical gap markers. Each category has a short horizontal target
  // tick and a dot at the actual value, joined by a vertical line. Misses
  // carry a lower-opacity fill so the sign difference reads at thumbnail size.
  const rows: Array<{ x: number; target: number; actual: number; miss?: boolean }> = [
    { x: 18, target: 52, actual: 30 },
    { x: 30, target: 48, actual: 38 },
    { x: 42, target: 42, actual: 40 },
    { x: 54, target: 46, actual: 50, miss: true },
    { x: 66, target: 36, actual: 44, miss: true },
    { x: 78, target: 54, actual: 30 },
    { x: 90, target: 40, actual: 54, miss: true },
    { x: 102, target: 26, actual: 58, miss: true },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis rails */}
      <line x1="10" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" />
      <line x1="10" y1="10" x2="10" y2="70" stroke="var(--color-hairline)" />
      {rows.map((r, i) => (
        <g key={i}>
          {/* Gap line from target to actual */}
          <line
            x1={r.x}
            x2={r.x}
            y1={r.target}
            y2={r.actual}
            stroke="var(--color-ink)"
            strokeOpacity={r.miss ? 0.45 : 1}
            strokeWidth="1.6"
          />
          {/* Target tick */}
          <line
            x1={r.x - 3.2}
            x2={r.x + 3.2}
            y1={r.target}
            y2={r.target}
            stroke="var(--color-ink)"
            strokeOpacity={0.55}
            strokeWidth="1.2"
          />
          {/* Actual dot */}
          <circle
            cx={r.x}
            cy={r.actual}
            r="2.1"
            fill="var(--color-ink)"
            fillOpacity={r.miss ? 0.45 : 1}
          />
        </g>
      ))}
    </svg>
  );
}
