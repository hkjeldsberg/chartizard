export function LexisDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="14" y1="10" x2="14" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Horizontal gridlines (age) */}
      {[20, 34, 48, 62].map((y, i) => (
        <line
          key={i}
          x1="14"
          x2="112"
          y1={y}
          y2={y}
          stroke="var(--color-hairline)"
          strokeWidth="0.5"
        />
      ))}

      {/* Vertical gridlines (period) */}
      {[34, 54, 74, 94].map((x, i) => (
        <line
          key={i}
          x1={x}
          x2={x}
          y1="10"
          y2="68"
          stroke="var(--color-hairline)"
          strokeWidth="0.5"
        />
      ))}

      {/* 1918 period shading (vertical band) */}
      <rect x="52" y="10" width="12" height="58" fill="var(--color-ink)" fillOpacity="0.08" />

      {/* Young-adult age band (horizontal) */}
      <rect x="14" y="28" width="98" height="22" fill="var(--color-ink)" fillOpacity="0.08" />

      {/* Intersection — darkest */}
      <rect x="52" y="28" width="12" height="22" fill="var(--color-ink)" fillOpacity="0.28" />

      {/* Cohort diagonals (45°) */}
      {[
        [14, 68, 62, 20],
        [14, 48, 82, 10],
        [34, 68, 82, 20],
        [54, 68, 102, 20],
        [74, 68, 112, 30],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--color-ink)"
          strokeWidth="0.7"
          strokeOpacity="0.4"
          strokeDasharray="2 2"
        />
      ))}
    </svg>
  );
}
