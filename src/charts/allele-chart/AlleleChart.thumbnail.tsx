export function AlleleChartThumbnail() {
  // 5 stacked bars representing allele frequencies across 5 populations
  // Bar data: [A-freq, G-freq] for AFR, EUR, EAS, AMR, SAS
  const bars = [
    { label: "AFR", A: 0.01, G: 0.99 },
    { label: "EUR", A: 0.99, G: 0.01 },
    { label: "EAS", A: 0.02, G: 0.98 },
    { label: "AMR", A: 0.38, G: 0.62 },
    { label: "SAS", A: 0.78, G: 0.22 },
  ];

  const padL = 8;
  const padR = 6;
  const padT = 6;
  const padB = 14;
  const chartW = 120 - padL - padR;
  const chartH = 80 - padT - padB;

  const n = bars.length;
  const barWidth = (chartW / n) * 0.65;
  const gap = chartW / n;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis lines */}
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={padT + chartH}
        stroke="var(--color-hairline)"
        strokeWidth={0.8}
      />
      <line
        x1={padL}
        y1={padT + chartH}
        x2={padL + chartW}
        y2={padT + chartH}
        stroke="var(--color-hairline)"
        strokeWidth={0.8}
      />

      {bars.map(({ A, G }, i) => {
        const x = padL + i * gap + (gap - barWidth) / 2;
        const gH = G * chartH;
        const aH = A * chartH;
        const gY = padT + aH;
        const aY = padT;

        return (
          <g key={i}>
            {/* G (ancestral) — light — bottom stack */}
            <rect
              x={x}
              y={gY}
              width={barWidth}
              height={gH}
              fill="var(--color-hairline)"
            />
            {/* A (derived) — dark — top stack */}
            <rect
              x={x}
              y={aY}
              width={barWidth}
              height={aH}
              fill="var(--color-ink)"
            />
          </g>
        );
      })}

      {/* Tick labels */}
      {["AFR", "EUR", "EAS", "AMR", "SAS"].map((label, i) => (
        <text
          key={label}
          x={padL + i * gap + gap / 2}
          y={padT + chartH + 9}
          textAnchor="middle"
          fontSize={5.5}
          fontFamily="var(--font-mono)"
          fill="var(--color-ink-soft)"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
