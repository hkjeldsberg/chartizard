export function CyclePlotThumbnail() {
  // 12 mini-panels in a row. Each panel: a 5-point line (trend across 5
  // years for that month) + a dashed horizontal mean line.
  // Heights (y, SVG coord — smaller = higher on screen). Data is shaped so
  // the seasonal profile is obvious (Dec peaks, Jul dips) and the per-panel
  // slope differs month-to-month.
  const panels: Array<[number[], number]> = [
    // [5 y-values, mean]
    [[52, 52, 53, 54, 54], 53], // J flat
    [[55, 55, 55, 55, 55], 55], // F flat
    [[48, 46, 45, 44, 43], 45], // M growing
    [[44, 42, 40, 38, 36], 40], // A growing
    [[42, 40, 38, 36, 34], 38], // M growing
    [[48, 46, 45, 44, 43], 45], // J growing
    [[58, 58, 59, 60, 60], 59], // Jul flat-down
    [[50, 50, 50, 49, 49], 50], // A flat
    [[46, 44, 42, 40, 38], 42], // S growing
    [[42, 40, 38, 36, 34], 38], // O growing
    [[34, 32, 30, 28, 26], 30], // N growing
    [[20, 17, 14, 11, 8], 14],  // D big holiday peak + fastest growth
  ];

  const xLeft = 10;
  const xRight = 114;
  const yTop = 6;
  const yBot = 64;
  const gap = 1.5;
  const nPanels = panels.length;
  const totalW = xRight - xLeft;
  const panelW = (totalW - gap * (nPanels - 1)) / nPanels;

  const labels = "JFMAMJJASOND";

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Baseline and y-axis hairline */}
      <line x1={xLeft} y1={yBot} x2={xRight} y2={yBot} stroke="var(--color-hairline)" />
      <line x1={xLeft} y1={yTop} x2={xLeft} y2={yBot} stroke="var(--color-hairline)" />

      {panels.map(([values, mean], i) => {
        const ox = xLeft + i * (panelW + gap);
        const points = values
          .map((v, j) => {
            const x = ox + (j / (values.length - 1)) * panelW;
            return `${x},${v}`;
          })
          .join(" ");
        return (
          <g key={i}>
            {/* Panel separator tick (left) */}
            <line x1={ox} y1={yTop} x2={ox} y2={yBot} stroke="var(--color-hairline)" />
            {/* Mean line */}
            <line
              x1={ox}
              x2={ox + panelW}
              y1={mean}
              y2={mean}
              stroke="var(--color-ink)"
              strokeOpacity={0.35}
              strokeDasharray="1 2"
            />
            {/* 5-year line */}
            <polyline
              points={points}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Month label */}
            <text
              x={ox + panelW / 2}
              y={76}
              fontSize="6"
              fontFamily="var(--font-mono)"
              fill="var(--color-ink)"
              textAnchor="middle"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
      {/* Right closer */}
      <line x1={xRight} y1={yTop} x2={xRight} y2={yBot} stroke="var(--color-hairline)" />
    </svg>
  );
}
