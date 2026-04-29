export function HorizontalBarThumbnail() {
  // Descending horizontal bars — category first, bar second.
  const widths = [88, 72, 60, 50, 40, 30, 22];
  const barHeight = 5;
  const gap = 3;
  const leftEdge = 30;
  const topStart = 14;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline along the left edge + bottom */}
      <line x1={leftEdge} y1={topStart - 2} x2={leftEdge} y2={72} stroke="var(--color-ink)" />
      <line x1={leftEdge} y1={72} x2={112} y2={72} stroke="var(--color-hairline)" />

      {/* Category label tick marks (short strokes) */}
      {widths.map((_, i) => {
        const y = topStart + i * (barHeight + gap) + barHeight / 2;
        return (
          <line
            key={`t-${i}`}
            x1={12}
            x2={28}
            y1={y}
            y2={y}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        );
      })}

      {/* Bars */}
      {widths.map((w, i) => {
        const y = topStart + i * (barHeight + gap);
        return (
          <rect
            key={i}
            x={leftEdge}
            y={y}
            width={w}
            height={barHeight}
            fill="var(--color-ink)"
          />
        );
      })}
    </svg>
  );
}
