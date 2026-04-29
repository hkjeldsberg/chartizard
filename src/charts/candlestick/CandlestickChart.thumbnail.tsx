export function CandlestickThumbnail() {
  // Hand-placed candles: [x, bodyTop, bodyBottom, wickTop, wickBottom, isBull]
  // The sequence drifts upward with a mix of bull (teal ink) and bear (ink) days.
  const candles: Array<[number, number, number, number, number, boolean]> = [
    [16, 48, 58, 42, 62, false],
    [26, 42, 52, 38, 58, true],
    [36, 38, 48, 34, 54, true],
    [46, 44, 52, 40, 58, false],
    [56, 32, 42, 22, 50, true], // long upper wick
    [66, 30, 38, 26, 44, true],
    [76, 26, 34, 18, 40, false], // volatility signal: long-ish wick, short body
    [86, 20, 28, 16, 34, true],
    [96, 16, 24, 12, 30, true],
    [106, 18, 24, 14, 28, false],
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="8" y1="68" x2="116" y2="68" stroke="var(--color-hairline)" />
      <line x1="8" y1="10" x2="8" y2="68" stroke="var(--color-hairline)" />
      {candles.map(([x, bt, bb, wt, wb, bull], i) => (
        <g key={i}>
          <line
            x1={x}
            x2={x}
            y1={wt}
            y2={wb}
            stroke="var(--color-ink)"
            strokeWidth="1"
          />
          <rect
            x={x - 3}
            y={bt}
            width={6}
            height={bb - bt}
            fill={bull ? "var(--color-ink)" : "var(--color-ink)"}
            opacity={bull ? 0.45 : 0.95}
          />
        </g>
      ))}
    </svg>
  );
}
