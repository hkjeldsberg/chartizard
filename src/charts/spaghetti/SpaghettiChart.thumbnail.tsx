export function SpaghettiThumbnail() {
  // Hand-rolled tangle of ~10 thin lines with a thicker median overlay.
  // Deterministic by construction — just polyline points.
  const lines: string[] = [
    "14,40 28,46 42,38 56,50 70,44 84,54 98,46 112,52",
    "14,30 28,42 42,36 56,48 70,40 84,46 98,52 112,46",
    "14,52 28,44 42,54 56,42 70,52 84,40 98,48 112,42",
    "14,20 28,30 42,24 56,34 70,28 84,36 98,30 112,38",
    "14,58 28,52 42,60 56,50 70,56 84,48 98,54 112,50",
    "14,36 28,44 42,32 56,40 70,34 84,42 98,36 112,44",
    "14,46 28,38 42,50 56,36 70,46 84,38 98,42 112,40",
    "14,24 28,34 42,30 56,42 70,36 84,44 98,38 112,46",
    "14,50 28,42 42,56 56,44 70,58 84,46 98,50 112,44",
    "14,32 28,40 42,28 56,38 70,30 84,34 98,28 112,36",
  ];
  // Median (centroid-ish line) drawn slightly heavier.
  const median = "14,38 28,40 42,40 56,42 70,42 84,42 98,42 112,44";
  // Outlier climbing up
  const outlier = "14,44 28,36 42,30 56,24 70,20 84,16 98,12 112,10";

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="12" x2="12" y2="68" stroke="var(--color-hairline)" />

      {/* IQR band (stylized) */}
      <path
        d="M14,34 L28,36 L42,36 L56,38 L70,38 L84,38 L98,38 L112,40 L112,46 L98,46 L84,46 L70,46 L56,46 L42,44 L28,44 L14,42 Z"
        fill="var(--color-ink)"
        fillOpacity="0.12"
      />

      {/* thin patient lines */}
      {lines.map((pts, i) => (
        <polyline
          key={i}
          points={pts}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity="0.35"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* outlier */}
      <polyline
        points={outlier}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.85"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* median overlay */}
      <polyline
        points={median}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
