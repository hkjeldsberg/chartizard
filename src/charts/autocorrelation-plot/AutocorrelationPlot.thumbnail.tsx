export function AutocorrelationThumbnail() {
  // ACF stem-plot silhouette: stems decay geometrically from lag 0 (height 1)
  // through lag 8. Confidence bands shown as dashed horizontals.
  const baseline = 64;
  const startX = 14;
  const step = 11;
  // Heights in px for lags 0..8: lag-0 at full height, decaying exponentially
  const stemHeights = [46, 32, 22, 16, 11, 8, 6, 4, 3];
  const confBandY = baseline - 9; // ±1.96/sqrt(n) dashed line

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="14" x2="12" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="12" y1={baseline} x2="112" y2={baseline} stroke="var(--color-ink)" strokeWidth="1" />

      {/* Confidence band dashed lines */}
      <line
        x1="12"
        y1={confBandY}
        x2="112"
        y2={confBandY}
        stroke="var(--color-ink-mute)"
        strokeWidth="0.8"
        strokeDasharray="3 2"
      />
      <line
        x1="12"
        y1={baseline + 9}
        x2="112"
        y2={baseline + 9}
        stroke="var(--color-ink-mute)"
        strokeWidth="0.8"
        strokeDasharray="3 2"
      />

      {/* Stems with circle heads */}
      {stemHeights.map((h, i) => {
        const x = startX + i * step;
        const y = baseline - h;
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={baseline}
              y2={y}
              stroke="var(--color-ink)"
              strokeWidth={i === 0 ? 1.8 : 1.2}
            />
            <circle cx={x} cy={y} r={i === 0 ? 2.8 : 2} fill="var(--color-ink)" />
          </g>
        );
      })}
    </svg>
  );
}
