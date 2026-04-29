export function DotPlotThumbnail() {
  // Stacked-dot silhouette of a roughly Gaussian distribution across 13
  // integer scores. Columns rise in the centre, thin at the tails — the
  // distribution's shape is the whole point. Hand-placed, deterministic.
  const heights = [1, 1, 2, 3, 5, 7, 8, 7, 5, 3, 2, 1, 1];
  const x0 = 14;
  const step = 7;
  const baseline = 68;
  const r = 1.7;
  const row = 4;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline (x-axis) */}
      <line x1={x0 - 2} y1={baseline} x2={112} y2={baseline} stroke="var(--color-hairline)" />
      {heights.map((h, i) => {
        const cx = x0 + i * step;
        return (
          <g key={i}>
            {Array.from({ length: h }, (_, j) => (
              <circle
                key={j}
                cx={cx}
                cy={baseline - r - j * row}
                r={r}
                fill="var(--color-ink)"
                opacity={0.9}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
