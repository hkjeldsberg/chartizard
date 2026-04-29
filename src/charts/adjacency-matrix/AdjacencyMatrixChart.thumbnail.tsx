export function AdjacencyMatrixThumbnail() {
  // Three small clusters on the diagonal + a couple of bridge cells.
  // 9×9 grid, centred in a 120×80 viewBox.
  const n = 9;
  const cell = 7;
  const gridSize = n * cell;
  const ox = (120 - gridSize) / 2;
  const oy = (80 - gridSize) / 2;

  // Filled cells — two clusters of 3, one cluster of 3, plus 2 bridges.
  // Symmetric.
  const pairs: Array<[number, number]> = [
    // Cluster 1 (rows/cols 0-2)
    [1, 0], [2, 0], [2, 1],
    // Cluster 2 (rows/cols 3-5)
    [4, 3], [5, 3], [5, 4],
    // Cluster 3 (rows/cols 6-8)
    [7, 6], [8, 6], [8, 7],
    // Bridges
    [3, 2], [6, 5],
  ];
  const filled = new Set<string>();
  for (const [a, b] of pairs) {
    filled.add(`${a}|${b}`);
    filled.add(`${b}|${a}`);
  }

  const cells: Array<{ i: number; j: number }> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (filled.has(`${i}|${j}`)) {
        cells.push({ i, j });
      }
    }
  }

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <rect
        x={ox}
        y={oy}
        width={gridSize}
        height={gridSize}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
      />
      {/* faint grid lines */}
      {Array.from({ length: n - 1 }).map((_, k) => (
        <g key={k}>
          <line
            x1={ox + (k + 1) * cell}
            y1={oy}
            x2={ox + (k + 1) * cell}
            y2={oy + gridSize}
            stroke="var(--color-hairline)"
            strokeWidth={0.4}
          />
          <line
            x1={ox}
            y1={oy + (k + 1) * cell}
            x2={ox + gridSize}
            y2={oy + (k + 1) * cell}
            stroke="var(--color-hairline)"
            strokeWidth={0.4}
          />
        </g>
      ))}
      {/* filled cells */}
      {cells.map(({ i, j }) => (
        <rect
          key={`${i}-${j}`}
          x={ox + j * cell + 0.5}
          y={oy + i * cell + 0.5}
          width={cell - 1}
          height={cell - 1}
          fill="var(--color-ink)"
        />
      ))}
    </svg>
  );
}
