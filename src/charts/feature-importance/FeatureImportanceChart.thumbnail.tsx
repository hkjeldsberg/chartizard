export function FeatureImportanceThumbnail() {
  // Descending horizontal bars — ranking is the whole point.
  const widths = [92, 74, 50, 40, 32, 24, 18, 14, 10, 6];
  const barHeight = 4;
  const gap = 2;
  const leftEdge = 26;
  const topStart = 10;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline along the left edge */}
      <line
        x1={leftEdge}
        y1={topStart - 2}
        x2={leftEdge}
        y2={topStart + widths.length * (barHeight + gap)}
        stroke="var(--color-ink)"
      />

      {/* Feature-name hint marks (short strokes) */}
      {widths.map((_, i) => {
        const y = topStart + i * (barHeight + gap) + barHeight / 2;
        return (
          <line
            key={`t-${i}`}
            x1={8}
            x2={24}
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
