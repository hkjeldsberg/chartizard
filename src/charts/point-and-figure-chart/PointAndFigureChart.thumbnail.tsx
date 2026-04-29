export function PointAndFigureThumbnail() {
  // Simplified P&F grid: 5 alternating X/O columns
  // Grid area: x 14..106, y 8..68
  // 5 columns, 4 rows of boxes
  const colXs = [22, 36, 50, 64, 78, 92];
  const rowYs = [18, 30, 42, 54, 66];

  // Define which cells have X or O (col-index → row-indices with symbol)
  const xCells: [number, number[]][] = [
    [0, [2, 3, 4]],   // X column: rows 2,3,4 (rising)
    [2, [1, 2, 3, 4]], // X column: rows 1-4
    [4, [3, 4]],       // X column: rows 3,4 (shorter)
  ];
  const oCells: [number, number[]][] = [
    [1, [1, 2, 3]],   // O column: rows 1,2,3 (falling)
    [3, [2, 3, 4]],   // O column: rows 2,3,4
    [5, [1, 2, 3]],   // O column: rows 1,2,3
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="12" y1="10" x2="12" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="12" y1="72" x2="108" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* Horizontal grid lines */}
      {rowYs.map((y) => (
        <line key={y} x1="12" x2="108" y1={y} y2={y} stroke="var(--color-hairline)" strokeWidth="0.5" strokeDasharray="2 3" />
      ))}

      {/* Column separators */}
      {[1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={colXs[i] - 7} x2={colXs[i] - 7} y1="10" y2="72" stroke="var(--color-hairline)" strokeWidth="0.4" />
      ))}

      {/* X symbols */}
      {xCells.map(([ci, rows]) =>
        rows.map((ri) => (
          <text
            key={`x-${ci}-${ri}`}
            x={colXs[ci]}
            y={rowYs[ri] + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fontFamily="monospace"
            fill="var(--color-ink)"
            fontWeight="600"
          >
            X
          </text>
        ))
      )}

      {/* O symbols */}
      {oCells.map(([ci, rows]) =>
        rows.map((ri) => (
          <text
            key={`o-${ci}-${ri}`}
            x={colXs[ci]}
            y={rowYs[ri] + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fontFamily="monospace"
            fill="var(--color-ink-soft)"
          >
            O
          </text>
        ))
      )}
    </svg>
  );
}
