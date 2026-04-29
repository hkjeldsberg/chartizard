export function LiftThumbnail() {
  // Descending lift bars + curve crossing baseline at lift = 1.
  const heights = [44, 36, 30, 24, 18, 14, 10, 8, 5, 3];
  const barWidth = 7;
  const gap = 2;
  const baseline = 68;
  const startX = 16;
  // lift = 1.0 reference — roughly 1/3 up the plot on this scale
  const liftOneY = 40;
  // Midpoints of bars — for the overlaid curve.
  const curvePoints = heights.map((h, i) => {
    const cx = startX + i * (barWidth + gap) + barWidth / 2;
    const cy = baseline - h;
    return `${cx},${cy}`;
  });

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* axes */}
      <line x1="14" y1="14" x2="14" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="14" y1={baseline} x2="112" y2={baseline} stroke="var(--color-ink)" />
      {/* lift = 1 baseline */}
      <line
        x1="14"
        y1={liftOneY}
        x2="112"
        y2={liftOneY}
        stroke="var(--color-hairline)"
        strokeDasharray="3 3"
      />
      {/* decile bars */}
      {heights.map((h, i) => {
        const x = startX + i * (barWidth + gap);
        const y = baseline - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            fill="var(--color-ink)"
            fillOpacity="0.22"
          />
        );
      })}
      {/* lift curve */}
      <polyline
        points={curvePoints.join(" ")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
