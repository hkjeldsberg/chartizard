export function PartialAutocorrelationThumbnail() {
  // PACF silhouette: tall stem at lag 0 and lag 1, all remaining stems near zero.
  // This is the "cuts off after lag 1" signature of an AR(1) process.
  const baseline = 64;
  const startX = 14;
  const step = 11;
  const confBandY = baseline - 9; // ±1.96/sqrt(n) dashed line

  // Heights for lags 0..8: lag-0 = 46, lag-1 = 32, rest near zero (2-5px noise)
  const stemHeights = [46, 32, 4, 3, 5, 2, 4, 3, 5];

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
        const isSignificant = i < 2;
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={baseline}
              y2={y}
              stroke={isSignificant ? "var(--color-ink)" : "var(--color-ink-mute)"}
              strokeWidth={i === 0 ? 1.8 : isSignificant ? 1.5 : 1}
            />
            <circle
              cx={x}
              cy={y}
              r={i === 0 ? 2.8 : isSignificant ? 2.4 : 1.6}
              fill={isSignificant ? "var(--color-ink)" : "var(--color-ink-soft)"}
            />
          </g>
        );
      })}
    </svg>
  );
}
