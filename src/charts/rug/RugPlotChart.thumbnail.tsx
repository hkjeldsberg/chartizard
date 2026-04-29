export function RugPlotThumbnail() {
  // Thin density curve above a fringe of vertical ticks on a number line —
  // the canonical "rug + smooth" idiom. Tick positions are hand-placed,
  // deterministic, roughly Gaussian.
  const baseline = 62;
  const tickTop = baseline - 4;
  const tickBottom = baseline + 4;
  const x0 = 12;
  const x1 = 112;

  const ticks = [
    16, 20, 24, 28, 32, 34, 38, 40, 42, 44, 46, 48, 50, 52, 54,
    55, 57, 58, 60, 60, 62, 63, 64, 66, 68, 70, 72, 74, 76, 78,
    80, 82, 84, 86, 88, 90, 92, 94, 98, 102, 106,
  ];

  // Density curve above — Gaussian-ish shape over [16, 106].
  const points: Array<[number, number]> = [];
  const n = 32;
  const mu = 62;
  const sigma = 16;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + t * (x1 - x0);
    const g = Math.exp(-Math.pow((x - mu) / sigma, 2));
    const y = 18 + (1 - g) * 22;
    points.push([x, y]);
  }
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Density overlay */}
      <path
        d={path}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.55"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Baseline */}
      <line x1={x0} y1={baseline} x2={x1} y2={baseline} stroke="var(--color-hairline)" />
      {/* Rug ticks */}
      {ticks.map((x, i) => (
        <line
          key={i}
          x1={x}
          x2={x}
          y1={tickTop}
          y2={tickBottom}
          stroke="var(--color-ink)"
          strokeOpacity="0.7"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
