export function DumbbellThumbnail() {
  // Five rows, each a little dumbbell with a left (paler) and right (ink) dot
  // and a connecting bar. Rows are sorted by gap width, descending — the
  // fingerprint of the chart family.
  const rows = [
    { y: 14, fx: 24, mx: 96 }, // widest gap
    { y: 26, fx: 40, mx: 96 },
    { y: 38, fx: 48, mx: 88 },
    { y: 50, fx: 56, mx: 80 },
    { y: 62, fx: 64, mx: 78 }, // narrowest gap
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis rails */}
      <line x1="12" y1="72" x2="112" y2="72" stroke="var(--color-hairline)" />
      <line x1="12" y1="8" x2="12" y2="72" stroke="var(--color-hairline)" />
      {rows.map((r, i) => (
        <g key={i}>
          <line
            x1={r.fx}
            x2={r.mx}
            y1={r.y}
            y2={r.y}
            stroke="var(--color-ink)"
            strokeOpacity={0.35}
            strokeWidth="1.6"
          />
          <circle
            cx={r.fx}
            cy={r.y}
            r="2.4"
            fill="var(--color-ink)"
            fillOpacity={0.5}
          />
          <circle cx={r.mx} cy={r.y} r="2.4" fill="var(--color-ink)" />
        </g>
      ))}
    </svg>
  );
}
