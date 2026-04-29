export function StackedBarThumbnail() {
  const bars = [
    [18, 30, 14], // heights per segment (bottom → top) in px
    [24, 24, 10],
    [20, 34, 16],
    [28, 20, 18],
    [22, 28, 22],
  ];
  const barWidth = 14;
  const gap = 6;
  const baseline = 68;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1={baseline} x2="112" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2={baseline} stroke="var(--color-hairline)" />
      {bars.map((segs, i) => {
        const x = 18 + i * (barWidth + gap);
        let y = baseline;
        return (
          <g key={i}>
            {segs.map((h, j) => {
              y -= h;
              const opacity = 0.9 - j * 0.25;
              return (
                <rect
                  key={j}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h - 0.75}
                  fill="var(--color-ink)"
                  opacity={opacity}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
