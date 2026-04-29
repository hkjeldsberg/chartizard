export function ArrheniusPlotThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Y-axis */}
      <line x1="16" y1="6" x2="16" y2="68" stroke="var(--color-hairline)" />
      {/* X-axis */}
      <line x1="16" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      {/* Best-fit line — straight, descending right (higher 1/T = lower T = lower ln k) */}
      <line
        x1="20" y1="14"
        x2="108" y2="62"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="5 2"
        opacity="0.6"
      />
      {/* Data points on the line */}
      {([
        [22, 16],
        [37, 24],
        [52, 32],
        [66, 40],
        [81, 48],
        [96, 56],
      ] as [number, number][]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
