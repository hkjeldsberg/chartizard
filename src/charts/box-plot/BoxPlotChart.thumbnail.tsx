export function BoxPlotThumbnail() {
  // Five shrinking-and-descending boxes, evoking medians dropping and spread
  // tightening across decades.
  const boxes = [
    { cx: 24, median: 30, q1: 38, q3: 22, wHi: 16, wLo: 44 },
    { cx: 44, median: 34, q1: 42, q3: 28, wHi: 22, wLo: 48 },
    { cx: 64, median: 40, q1: 46, q3: 34, wHi: 28, wLo: 52 },
    { cx: 84, median: 46, q1: 50, q3: 42, wHi: 38, wLo: 56 },
    { cx: 104, median: 52, q1: 55, q3: 48, wHi: 44, wLo: 60 },
  ];
  const boxW = 10;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {boxes.map((b, i) => (
        <g key={i}>
          {/* whisker vertical */}
          <line x1={b.cx} y1={b.wHi} x2={b.cx} y2={b.wLo} stroke="var(--color-ink)" strokeWidth="1" />
          {/* whisker caps */}
          <line x1={b.cx - 3} y1={b.wHi} x2={b.cx + 3} y2={b.wHi} stroke="var(--color-ink)" strokeWidth="1" />
          <line x1={b.cx - 3} y1={b.wLo} x2={b.cx + 3} y2={b.wLo} stroke="var(--color-ink)" strokeWidth="1" />
          {/* IQR box */}
          <rect
            x={b.cx - boxW / 2}
            y={b.q3}
            width={boxW}
            height={b.q1 - b.q3}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth="1"
          />
          {/* median */}
          <line
            x1={b.cx - boxW / 2}
            y1={b.median}
            x2={b.cx + boxW / 2}
            y2={b.median}
            stroke="var(--color-ink)"
            strokeWidth="1.6"
          />
        </g>
      ))}
    </svg>
  );
}
