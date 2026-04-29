export function MatrixDiagramThumbnail() {
  // House of Quality thumbnail: L-matrix body + roof triangle
  // viewBox 120x80
  const colW = 18;
  const rowH = 10;
  const cols = 4;
  const rows = 4;
  const gx = 36; // grid start x (after row labels)
  const gy = 34; // grid start y (after roof + col headers)
  const roofApex = 8;

  // Column centre x coords
  const cx = (i: number) => gx + i * colW + colW / 2;

  // Relationships: [row][col]
  const rels: Array<Array<string>> = [
    ["●", "", "", ""],
    ["", "●", "", ""],
    ["", "", "●", ""],
    ["", "○", "", "●"],
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Roof triangle */}
      <polygon
        points={`${cx(0)},${gy} ${cx(cols - 1)},${gy} ${(cx(0) + cx(cols - 1)) / 2},${roofApex}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.8"
        opacity="0.6"
      />
      {/* Roof internal lines */}
      {[1, 2].map((i) => (
        <line
          key={i}
          x1={cx(i)}
          y1={gy}
          x2={(cx(0) + cx(cols - 1)) / 2}
          y2={roofApex}
          stroke="var(--color-hairline)"
          strokeWidth="0.5"
        />
      ))}
      {/* Roof symbol (+) */}
      <text x={(cx(0) + cx(1)) / 2} y={gy - 8} textAnchor="middle" fontSize="5" fill="var(--color-ink)" opacity="0.6">+</text>
      <text x={(cx(1) + cx(2)) / 2} y={gy - 12} textAnchor="middle" fontSize="5" fill="var(--color-ink)" opacity="0.6">−</text>

      {/* Column headers (tiny rotated marks) */}
      {Array.from({ length: cols }).map((_, j) => (
        <line key={`ch-${j}`} x1={cx(j)} y1={gy - 2} x2={cx(j) - 5} y2={gy - 16} stroke="var(--color-ink)" strokeWidth="0.6" opacity="0.5" />
      ))}

      {/* Row labels (small rects) */}
      {Array.from({ length: rows }).map((_, i) => (
        <rect key={`rl-${i}`} x="2" y={gy + i * rowH + 1} width={gx - 4} height={rowH - 2} rx="1" fill="var(--color-hairline)" opacity="0.5" />
      ))}

      {/* Grid cells */}
      {Array.from({ length: rows }).map((_, i) =>
        Array.from({ length: cols }).map((_, j) => (
          <rect
            key={`cell-${i}-${j}`}
            x={gx + j * colW}
            y={gy + i * rowH}
            width={colW}
            height={rowH}
            fill={i % 2 === 0 ? "var(--color-surface)" : "transparent"}
            stroke="var(--color-hairline)"
            strokeWidth="0.5"
          />
        ))
      )}

      {/* Relationship symbols */}
      {rels.map((row, i) =>
        row.map((sym, j) =>
          sym ? (
            <text
              key={`sym-${i}-${j}`}
              x={gx + j * colW + colW / 2}
              y={gy + i * rowH + rowH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={sym === "●" ? 7 : 6}
              fill="var(--color-ink)"
            >
              {sym}
            </text>
          ) : null
        )
      )}

      {/* Legend */}
      <text x={gx} y={gy + rows * rowH + 8} fontSize="5" fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">● strong  ○ medium  △ weak</text>
    </svg>
  );
}
