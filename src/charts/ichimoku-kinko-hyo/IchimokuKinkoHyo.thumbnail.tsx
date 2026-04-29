export function IchimokuKinkoHyoThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="8" x2="12" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Kumo cloud — bullish left half */}
      <polygon
        points="20,48 50,40 50,52 20,58"
        fill="rgba(74,153,130,0.22)"
        stroke="none"
      />
      {/* Kumo cloud — bearish right half */}
      <polygon
        points="50,40 90,32 90,42 50,52"
        fill="rgba(180,80,80,0.22)"
        stroke="none"
      />

      {/* Senkou A top edge */}
      <polyline
        points="20,48 50,40 90,32"
        fill="none"
        stroke="rgba(74,153,130,0.7)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      {/* Senkou B bottom edge */}
      <polyline
        points="20,58 50,52 90,42"
        fill="none"
        stroke="rgba(180,80,80,0.7)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Kijun-sen (slow, red) */}
      <polyline
        points="14,55 30,52 50,46 70,38 90,34 110,30"
        fill="none"
        stroke="rgba(200,60,60,0.85)"
        strokeWidth="1.5"
      />

      {/* Tenkan-sen (fast, blue) */}
      <polyline
        points="18,50 30,44 42,40 56,32 70,28 84,25 100,22"
        fill="none"
        stroke="rgba(60,110,200,0.85)"
        strokeWidth="1.2"
      />

      {/* Chikou span (lagged, purple, dashed) */}
      <polyline
        points="14,62 28,56 44,50 58,42 70,38"
        fill="none"
        stroke="rgba(120,80,180,0.7)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Candlestick silhouettes */}
      {(
        [
          [20, 52, 48, 56, true],
          [28, 46, 42, 54, true],
          [36, 40, 38, 48, true],
          [44, 36, 34, 44, false],
          [52, 32, 28, 38, true],
          [60, 28, 26, 36, false],
          [68, 24, 22, 30, true],
          [76, 20, 18, 26, true],
        ] as [number, number, number, number, boolean][]
      ).map(([x, bTop, wTop, bBot, bull], i) => (
        <g key={i}>
          <line x1={x} y1={wTop} x2={x} y2={bBot + 2} stroke="var(--color-ink)" strokeWidth={0.6} opacity={0.5} />
          <rect
            x={x - 2} y={bTop}
            width={4} height={Math.max(1, bBot - bTop)}
            fill={bull ? "rgba(74,153,130,0.5)" : "var(--color-ink)"}
            stroke="var(--color-ink)"
            strokeWidth={0.4}
            opacity={0.65}
          />
        </g>
      ))}
    </svg>
  );
}
