export function CumulativeGainsThumbnail() {
  // Concave curve rising steeply then flattening to (1,1); diagonal reference.
  // Coordinates chosen so the shaded gain area reads clearly at 120x80.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* axes */}
      <line x1="14" y1="68" x2="110" y2="68" stroke="var(--color-hairline)" />
      <line x1="14" y1="12" x2="14" y2="68" stroke="var(--color-hairline)" />
      {/* random-targeting diagonal */}
      <line
        x1="14"
        y1="68"
        x2="110"
        y2="12"
        stroke="var(--color-hairline)"
        strokeDasharray="3 3"
      />
      {/* shaded gain area — between curve and diagonal */}
      <path
        d="M14,68 Q26,36 50,22 Q78,14 110,12 L14,68 Z"
        fill="var(--color-ink)"
        fillOpacity="0.14"
      />
      {/* cumulative gains curve */}
      <path
        d="M14,68 Q26,36 50,22 Q78,14 110,12"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* operating-point bead */}
      <circle cx="38" cy="28" r="2.4" fill="var(--color-ink)" />
    </svg>
  );
}
