export function IsotypeThumbnail() {
  // 5 rows, varying icon counts (scaled to fit 120x80)
  const rows = [
    { label: "China", count: 9 },
    { label: "India", count: 7 },
    { label: "USSR", count: 4 },
    { label: "USA", count: 3 },
    { label: "Japan", count: 2 },
  ];

  const iconH = 11;
  const iconW = 9;
  const offsetX = 22;
  const offsetY = 8;
  const rowH = 13;
  const headR = iconH * 0.13;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((row, ri) => {
        const cy = offsetY + ri * rowH + rowH * 0.5;
        return (
          <g key={row.label}>
            <text
              x={offsetX - 3}
              y={cy + 1}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={5.5}
              fontFamily="monospace"
              fill="var(--color-ink)"
              opacity={0.6}
            >
              {row.label}
            </text>
            {Array.from({ length: row.count }, (_, i) => {
              const cx = offsetX + i * iconW + iconW * 0.5;
              const bodyTop = cy - iconH * 0.5 + headR * 2 + iconH * 0.02;
              const bodyBot = cy + iconH * 0.1;
              const shoulderY = bodyTop + iconH * 0.08;
              const armEndY = shoulderY + iconH * 0.15;
              const hipY = bodyBot;
              const footY = cy + iconH * 0.5;
              const legSpread = iconH * 0.13;
              return (
                <g
                  key={i}
                  stroke="var(--color-ink)"
                  fill="var(--color-ink)"
                  strokeLinecap="round"
                  opacity={0.85}
                >
                  <circle cx={cx} cy={cy - iconH * 0.5 + headR} r={headR} />
                  <line
                    x1={cx}
                    y1={bodyTop}
                    x2={cx}
                    y2={bodyBot}
                    strokeWidth={iconH * 0.07}
                  />
                  <line
                    x1={cx - iconH * 0.18}
                    y1={armEndY}
                    x2={cx + iconH * 0.18}
                    y2={armEndY}
                    strokeWidth={iconH * 0.06}
                  />
                  <line
                    x1={cx}
                    y1={hipY}
                    x2={cx - legSpread}
                    y2={footY}
                    strokeWidth={iconH * 0.06}
                  />
                  <line
                    x1={cx}
                    y1={hipY}
                    x2={cx + legSpread}
                    y2={footY}
                    strokeWidth={iconH * 0.06}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
