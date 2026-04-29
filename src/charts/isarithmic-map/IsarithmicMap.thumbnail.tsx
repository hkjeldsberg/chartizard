export function IsarithmicMapThumbnail() {
  // Simplified US silhouette in a 120×80 viewBox with 4 nested isarithms —
  // visible as concentric curves plus a couple of outliers. No labels, no
  // scale — the thumbnail is a recognisable silhouette of the chart family.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Basemap silhouette */}
      <path
        d="M 10 30 Q 14 24 22 20 Q 40 16 60 18 Q 80 18 96 22 Q 108 26 110 34 Q 108 44 98 52 Q 80 60 60 60 Q 40 58 22 52 Q 12 44 10 30 Z"
        fill="var(--color-hairline)"
        fillOpacity="0.35"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.6"
      />
      {/* Outermost contour (low value) */}
      <path
        d="M 18 34 Q 22 22 42 22 Q 64 22 86 24 Q 104 28 104 38 Q 100 52 80 54 Q 52 54 30 50 Q 16 42 18 34 Z"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      {/* Mid contour */}
      <path
        d="M 30 34 Q 40 26 60 26 Q 80 26 92 32 Q 96 42 82 48 Q 58 50 40 46 Q 28 40 30 34 Z"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.65"
        strokeWidth="1.1"
      />
      {/* Inner contour — east */}
      <path
        d="M 54 30 Q 70 28 84 34 Q 86 42 72 44 Q 58 44 52 38 Q 50 32 54 30 Z"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.8"
        strokeWidth="1.2"
      />
      {/* Tight peak contour — west (Pacific NW analogue) */}
      <path
        d="M 22 28 Q 26 24 30 28 Q 30 34 26 34 Q 22 34 22 28 Z"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.92"
        strokeWidth="1.3"
      />
      {/* Station points */}
      {[
        [28, 30],
        [46, 34],
        [60, 38],
        [72, 36],
        [86, 40],
        [40, 44],
        [68, 48],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1.2"
          fill="var(--color-ink)"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}
