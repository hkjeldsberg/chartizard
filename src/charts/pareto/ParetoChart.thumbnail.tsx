export function ParetoThumbnail() {
  // 8 descending bars + a cumulative curve rising to ~100%.
  const baseline = 68;
  const leftX = 12;
  const barWidth = 10;
  const gap = 2;
  const counts = [48, 36, 22, 15, 11, 7, 4, 3];
  const total = counts.reduce((a, b) => a + b, 0);
  const maxCount = counts[0];

  // Cumulative percentage points (0-100); y maps pct -> (baseline - 54*pct/100).
  let running = 0;
  const curveTopY = 14;
  const curveBaseY = baseline;
  const points = counts.map((c, i) => {
    running += c;
    const pct = (running / total) * 100;
    const x = leftX + i * (barWidth + gap) + barWidth / 2;
    const y = curveBaseY - (pct / 100) * (curveBaseY - curveTopY);
    return { x, y };
  });

  const path =
    "M " +
    points
      .map((p, i) => (i === 0 ? `${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

  // 80% reference line
  const eightyY = curveBaseY - 0.8 * (curveBaseY - curveTopY);

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line
        x1="8"
        y1={baseline}
        x2="112"
        y2={baseline}
        stroke="var(--color-hairline)"
      />
      <line x1="8" y1="14" x2="8" y2={baseline} stroke="var(--color-hairline)" />
      <line
        x1="112"
        y1="14"
        x2="112"
        y2={baseline}
        stroke="var(--color-hairline)"
      />

      {/* 80% dashed line */}
      <line
        x1="8"
        y1={eightyY}
        x2="112"
        y2={eightyY}
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.55"
      />

      {/* Bars */}
      {counts.map((c, i) => {
        const h = (c / maxCount) * 50;
        const x = leftX + i * (barWidth + gap);
        return (
          <rect
            key={i}
            x={x}
            y={baseline - h}
            width={barWidth}
            height={h}
            fill="var(--color-ink)"
          />
        );
      })}

      {/* Cumulative curve */}
      <path
        d={path}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.2" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
