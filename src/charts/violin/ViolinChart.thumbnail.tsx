export function ViolinThumbnail() {
  // Three violin silhouettes, from wide/round (old, wide distribution) to
  // narrow/tall (recent, tight distribution). Bimodal middle violin hints at
  // the density story.
  const violins = [
    // Wide, roughly unimodal
    { cx: 28, d: "M28,18 C46,24 46,48 28,58 C10,48 10,24 28,18 Z", medY: 38 },
    // Middle — bimodal
    {
      cx: 62,
      d: "M62,16 C78,20 78,30 62,34 C78,38 78,54 62,60 C46,54 46,38 62,34 C46,30 46,20 62,16 Z",
      medY: 34,
    },
    // Narrow, tall
    { cx: 96, d: "M96,14 C104,22 104,50 96,62 C88,50 88,22 96,14 Z", medY: 36 },
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {violins.map((v, i) => (
        <g key={i}>
          <path
            d={v.d}
            fill="var(--color-ink)"
            fillOpacity="0.16"
            stroke="var(--color-ink)"
            strokeWidth="1"
          />
          <line
            x1={v.cx - 8}
            y1={v.medY}
            x2={v.cx + 8}
            y2={v.medY}
            stroke="var(--color-ink)"
            strokeWidth="1.4"
          />
        </g>
      ))}
    </svg>
  );
}
