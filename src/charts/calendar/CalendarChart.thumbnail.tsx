export function CalendarThumbnail() {
  // Miniature 7-row × 16-column contribution calendar. Values hand-tuned
  // to reproduce the live chart's story: weekday rhythm, a vacation gap
  // (column 9, all empty), and a launch-week spike (column 13 — darkest).
  const grid: number[][] = [
    // Mon..Sun rows
    [2, 4, 3, 5, 1, 3, 6, 4, 5, 0, 3, 5, 4, 9, 6, 3],
    [3, 5, 2, 4, 6, 2, 5, 7, 4, 0, 4, 6, 5, 9, 5, 4],
    [4, 3, 5, 6, 2, 4, 7, 5, 3, 0, 5, 7, 6, 9, 7, 2],
    [2, 6, 4, 3, 5, 3, 4, 6, 5, 0, 3, 4, 7, 9, 6, 3],
    [5, 4, 3, 5, 4, 6, 3, 4, 2, 0, 4, 5, 3, 9, 4, 2],
    [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 2, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  ];

  const x0 = 12;
  const y0 = 16;
  const cellW = 6;
  const cellH = 7;
  const gap = 0.8;
  const maxV = 9;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Month-label row (faint ticks across the top) */}
      <line x1={x0} y1={10} x2={x0 + 16 * (cellW + gap)} y2={10} stroke="var(--color-hairline)" />
      {[0, 4, 8, 12].map((c) => (
        <line
          key={c}
          x1={x0 + c * (cellW + gap)}
          y1={8}
          x2={x0 + c * (cellW + gap)}
          y2={12}
          stroke="var(--color-hairline)"
        />
      ))}

      {grid.map((row, r) =>
        row.map((v, c) => {
          const opacity = v === 0 ? 0.05 : 0.15 + (v / maxV) * 0.8;
          return (
            <rect
              key={`${r}-${c}`}
              x={x0 + c * (cellW + gap)}
              y={y0 + r * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={1}
              fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
            />
          );
        }),
      )}

      {/* Colour-scale legend — right edge */}
      {Array.from({ length: 5 }).map((_, i) => {
        const t = i / 4;
        const opacity = 0.15 + t * 0.8;
        return (
          <rect
            key={i}
            x={114}
            y={y0 + (4 - i) * 10}
            width={4}
            height={8}
            rx={1}
            fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
          />
        );
      })}
    </svg>
  );
}
