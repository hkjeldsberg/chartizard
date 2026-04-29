export function ScreeThumbnail() {
  // 10 bars with a sharp elbow around bar 3, plus a connecting line.
  const baseline = 68;
  const leftX = 10;
  const barWidth = 8;
  const gap = 2;
  // Eigenvalue-like: two tall, elbow at bar 3, long low tail.
  const heights = [50, 40, 22, 14, 10, 8, 6, 5, 4, 3];

  const points = heights.map((h, i) => ({
    x: leftX + i * (barWidth + gap) + barWidth / 2,
    y: baseline - h,
  }));

  const path =
    "M " +
    points
      .map((p, i) => (i === 0 ? `${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

  // Kaiser reference line at eigenvalue ~ 1, placed where bar 5 or 6 lands.
  const kaiserY = baseline - 10;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="6" y1={baseline} x2="114" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="6" y1="10" x2="6" y2={baseline} stroke="var(--color-hairline)" />

      {/* Kaiser dashed reference */}
      <line
        x1="6"
        y1={kaiserY}
        x2="114"
        y2={kaiserY}
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.55"
      />

      {/* Bars */}
      {heights.map((h, i) => {
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

      {/* Connecting line + markers */}
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
