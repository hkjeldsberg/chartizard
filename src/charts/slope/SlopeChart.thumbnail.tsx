export function SlopeThumbnail() {
  // Two columns at x=24 and x=96, five lines with a mix of rise, fall, flat.
  const x0 = 24;
  const x1 = 96;
  const lines = [
    { y0: 58, y1: 30, kind: "rise" as const }, // steep rise
    { y0: 46, y1: 22, kind: "rise" as const }, // rise
    { y0: 36, y1: 38, kind: "flat" as const }, // flat
    { y0: 28, y1: 48, kind: "fall" as const }, // fall
    { y0: 20, y1: 16, kind: "flat" as const }, // near-flat near top
  ];

  const colour = (k: "rise" | "fall" | "flat") =>
    k === "rise" ? "#4a6a68" : k === "fall" ? "#a55a4a" : "var(--color-ink-soft)";

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Vertical rails */}
      <line x1={x0} y1="12" x2={x0} y2="68" stroke="var(--color-hairline)" />
      <line x1={x1} y1="12" x2={x1} y2="68" stroke="var(--color-hairline)" />
      {/* Slope lines */}
      {lines.map((l, i) => (
        <g key={i}>
          <line
            x1={x0}
            y1={l.y0}
            x2={x1}
            y2={l.y1}
            stroke={colour(l.kind)}
            strokeWidth={l.kind === "flat" ? "1" : "1.4"}
            strokeOpacity={l.kind === "flat" ? "0.7" : "1"}
          />
          <circle cx={x0} cy={l.y0} r="1.6" fill={colour(l.kind)} />
          <circle cx={x1} cy={l.y1} r="1.6" fill={colour(l.kind)} />
        </g>
      ))}
      {/* Year headers */}
      <text
        x={x0}
        y="8"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink)"
      >
        2014
      </text>
      <text
        x={x1}
        y="8"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink)"
      >
        2024
      </text>
    </svg>
  );
}
