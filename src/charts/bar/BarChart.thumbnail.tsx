export function BarThumbnail() {
  // Descending bar silhouette — ranked comparison, zero-baseline.
  const heights = [46, 42, 38, 32, 26, 22, 18, 14];
  const barWidth = 9;
  const gap = 4;
  const baseline = 68;
  const startX = 14;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1="12" y1="14" x2="12" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="12" y1={baseline} x2="112" y2={baseline} stroke="var(--color-ink)" />
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
          />
        );
      })}
    </svg>
  );
}
