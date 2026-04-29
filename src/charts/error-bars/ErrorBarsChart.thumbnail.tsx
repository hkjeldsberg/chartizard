export function ErrorBarsThumbnail() {
  // Five short bars with whiskers on top — rising trend, mirroring the live
  // chart's A/B-variant story at tile scale.
  // Bar tops (mean), whisker hi/lo — in SVG y-space (baseline=68, top=14).
  const bars = [
    { x: 18, mean: 48, hi: 40, lo: 56 },
    { x: 36, mean: 44, hi: 35, lo: 52 },
    { x: 54, mean: 36, hi: 28, lo: 44 },
    { x: 72, mean: 28, hi: 18, lo: 38 },
    { x: 90, mean: 24, hi: 14, lo: 34 },
  ];
  const barWidth = 10;
  const baseline = 68;
  const capHalf = 4;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline and y-axis */}
      <line x1="12" y1="14" x2="12" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="12" y1={baseline} x2="112" y2={baseline} stroke="var(--color-ink)" />
      {/* Bars — faded fill so the whiskers read as the subject */}
      {bars.map((b, i) => (
        <rect
          key={`b-${i}`}
          x={b.x - barWidth / 2}
          y={b.mean}
          width={barWidth}
          height={baseline - b.mean}
          fill="var(--color-ink)"
          opacity="0.22"
        />
      ))}
      {/* Whiskers — vertical line + upper and lower caps */}
      {bars.map((b, i) => (
        <g key={`w-${i}`} stroke="var(--color-ink)" strokeWidth="1.2">
          <line x1={b.x} y1={b.hi} x2={b.x} y2={b.lo} />
          <line x1={b.x - capHalf} y1={b.hi} x2={b.x + capHalf} y2={b.hi} />
          <line x1={b.x - capHalf} y1={b.lo} x2={b.x + capHalf} y2={b.lo} />
          {/* Mean tick */}
          <line
            x1={b.x - capHalf * 0.8}
            y1={b.mean}
            x2={b.x + capHalf * 0.8}
            y2={b.mean}
            strokeWidth="1.6"
          />
        </g>
      ))}
    </svg>
  );
}
