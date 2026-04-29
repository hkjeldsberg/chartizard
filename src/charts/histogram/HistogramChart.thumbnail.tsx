export function HistogramThumbnail() {
  // Right-skewed silhouette: rises to a mode around bin 5, then a long tail.
  const heights = [6, 14, 26, 38, 44, 46, 40, 32, 24, 18, 13, 10, 8, 6, 5, 4, 3];
  const barWidth = 5.6;
  const gap = 0.4;
  const baseline = 68;
  const x0 = 12;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1={x0} y1={baseline} x2={112} y2={baseline} stroke="var(--color-hairline)" />
      <line x1={x0} y1="12" x2={x0} y2={baseline} stroke="var(--color-hairline)" />
      {heights.map((h, i) => (
        <rect
          key={i}
          x={x0 + i * (barWidth + gap)}
          y={baseline - h}
          width={barWidth}
          height={h}
          fill="var(--color-ink)"
          opacity={0.9}
        />
      ))}
    </svg>
  );
}
