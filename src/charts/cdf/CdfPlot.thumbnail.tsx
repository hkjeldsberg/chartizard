export function CdfThumbnail() {
  // Sampled points of Φ(x) over x ∈ [-3, 3], mapped into the 120×80 viewBox.
  // Hand-tuned smooth S-curve.
  const points = [
    [12, 68],
    [24, 66],
    [36, 62],
    [48, 52],
    [60, 40],
    [72, 28],
    [84, 18],
    [96, 14],
    [108, 12],
  ];
  const pathD =
    "M " +
    points.map(([x, y], i) => (i === 0 ? `${x},${y}` : `L ${x},${y}`)).join(" ");

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="12" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* y = 0.5 gridline */}
      <line
        x1="12"
        y1="40"
        x2="112"
        y2="40"
        stroke="var(--color-hairline)"
        strokeDasharray="2 3"
      />
      {/* The CDF S-curve */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Median crosshair at (60, 40) */}
      <line
        x1="60"
        y1="40"
        x2="60"
        y2="68"
        stroke="var(--color-ink)"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <circle cx="60" cy="40" r="2" fill="var(--color-ink)" />
    </svg>
  );
}
