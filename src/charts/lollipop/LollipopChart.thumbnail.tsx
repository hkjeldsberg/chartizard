export function LollipopThumbnail() {
  // Descending ranked lollipops — thin stems, circle heads carry the signal.
  const heights = [46, 42, 38, 32, 28, 24, 22, 18, 14];
  const stemWidth = 1; // visual weight of the stem (stroke width)
  const baseline = 68;
  const startX = 16;
  const step = 10;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Left hairline axis */}
      <line x1="12" y1="14" x2="12" y2={baseline} stroke="var(--color-hairline)" />
      {/* Baseline */}
      <line x1="12" y1={baseline} x2="112" y2={baseline} stroke="var(--color-ink)" />
      {/* Lollipops */}
      {heights.map((h, i) => {
        const x = startX + i * step;
        const y = baseline - h;
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={baseline}
              y2={y}
              stroke="var(--color-ink-mute)"
              strokeWidth={stemWidth}
            />
            <circle cx={x} cy={y} r={2.6} fill="var(--color-ink)" />
          </g>
        );
      })}
    </svg>
  );
}
