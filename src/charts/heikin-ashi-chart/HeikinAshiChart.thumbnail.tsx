export function HeikinAshiThumbnail() {
  // Simplified HA chart: up-trend (hollow bars) then down-trend (filled bars)
  // 8 candles across ~106px width
  const candles = [
    // Up-trend: hollow bodies, no lower wick (HA hallmark)
    { x: 16,  bodyTop: 58, bodyBot: 52, wickTop: 58, wickBot: 52, up: true },
    { x: 28,  bodyTop: 52, bodyBot: 44, wickTop: 52, wickBot: 44, up: true },
    { x: 40,  bodyTop: 44, bodyBot: 34, wickTop: 44, wickBot: 34, up: true },
    { x: 52,  bodyTop: 36, bodyBot: 26, wickTop: 34, wickBot: 24, up: true },
    // Transition / reversal
    { x: 64,  bodyTop: 30, bodyBot: 26, wickTop: 28, wickBot: 22, up: true },
    // Down-trend: filled bodies, no upper wick (HA hallmark)
    { x: 76,  bodyTop: 36, bodyBot: 42, wickTop: 36, wickBot: 44, up: false },
    { x: 88,  bodyTop: 44, bodyBot: 52, wickTop: 44, wickBot: 54, up: false },
    { x: 100, bodyTop: 52, bodyBot: 62, wickTop: 52, wickBot: 64, up: false },
  ];

  const barW = 8;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="8" y1="8" x2="8" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="8" y1="72" x2="112" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {candles.map((c, i) => {
        const bodyTop = Math.min(c.bodyTop, c.bodyBot);
        const bodyBot = Math.max(c.bodyTop, c.bodyBot);
        const bodyH = Math.max(2, bodyBot - bodyTop);
        const wickTop = Math.min(c.wickTop, c.wickBot);
        const wickBot = Math.max(c.wickTop, c.wickBot);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={c.x}
              x2={c.x}
              y1={wickTop}
              y2={wickBot}
              stroke={c.up ? "var(--color-ink)" : "var(--color-ink-soft)"}
              strokeWidth="1"
            />
            {/* Body */}
            {c.up ? (
              <rect
                x={c.x - barW / 2}
                y={bodyTop}
                width={barW}
                height={bodyH}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="1.2"
              />
            ) : (
              <rect
                x={c.x - barW / 2}
                y={bodyTop}
                width={barW}
                height={bodyH}
                fill="var(--color-ink-soft)"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
