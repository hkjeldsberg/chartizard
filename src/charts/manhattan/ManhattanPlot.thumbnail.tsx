export function ManhattanThumbnail() {
  // Five horizontal chromosome "bands" of low dots, with one tall peak
  // piercing the dashed significance line.
  const bandWidths: ReadonlyArray<[number, number]> = [
    [12, 32],
    [32, 54],
    [54, 74],
    [74, 94],
    [94, 112],
  ];

  // Baseline-level dots (low -log10p) across each band.
  const baseline: Array<[number, number]> = [];
  let seed = 5;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  bandWidths.forEach(([x0, x1], bi) => {
    const count = 7 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const x = x0 + rand() * (x1 - x0);
      const y = 54 + rand() * 10; // low, above baseline
      baseline.push([x, y]);
    }
    // Alternate band shade via a ghost rect — drawn separately below.
    void bi;
  });

  // One tall peak cluster (GWAS hit) on band 3.
  const peak: ReadonlyArray<[number, number]> = [
    [64, 22],
    [66, 18],
    [68, 26],
    [70, 20],
    [72, 28],
    [67, 14],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Alternating band shades */}
      {bandWidths.map(([x0, x1], i) =>
        i % 2 === 0 ? (
          <rect
            key={`band-${i}`}
            x={x0}
            y={10}
            width={x1 - x0}
            height={58}
            fill="var(--color-ink)"
            opacity={0.05}
          />
        ) : null,
      )}

      {/* Axes */}
      <line x1={12} y1={68} x2={112} y2={68} stroke="var(--color-hairline)" />
      <line x1={12} y1={10} x2={12} y2={68} stroke="var(--color-hairline)" />

      {/* Significance threshold (dashed horizontal) */}
      <line
        x1={12}
        y1={34}
        x2={112}
        y2={34}
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeDasharray="2 2"
      />

      {/* Baseline noise */}
      {baseline.map(([x, y], i) => (
        <circle
          key={`b-${i}`}
          cx={x}
          cy={y}
          r={1.1}
          fill="var(--color-ink-mute)"
          opacity={0.6}
        />
      ))}

      {/* Peak hits above the line */}
      {peak.map(([x, y], i) => (
        <circle
          key={`p-${i}`}
          cx={x}
          cy={y}
          r={1.6}
          fill="var(--color-ink)"
        />
      ))}
    </svg>
  );
}
