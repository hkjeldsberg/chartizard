export function ArcMatrixThumbnail() {
  // Two tiny matrices side-by-side. Left: scattered cells. Right: three
  // clear diagonal blocks. The thumbnail job is to telegraph "reordering".
  const n = 9;
  const cell = 4;
  const side = n * cell;
  const gap = 10;
  const totalW = 2 * side + gap;
  const ox = (120 - totalW) / 2;
  const oy = (80 - side) / 2;

  // Left: scattered pattern (hand-picked to look random but dense).
  const leftCells: Array<[number, number]> = [
    [0, 5], [5, 0], [1, 4], [4, 1], [2, 7], [7, 2],
    [3, 6], [6, 3], [0, 8], [8, 0], [2, 3], [3, 2],
    [4, 6], [6, 4], [1, 7], [7, 1], [0, 2], [2, 0],
    [5, 8], [8, 5], [3, 5], [5, 3],
  ];

  // Right: three diagonal blocks (0-2, 3-5, 6-8) + 2 bridges.
  const rightCells: Array<[number, number]> = [];
  // Block 1
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) if (i !== j) rightCells.push([i, j]);
  // Block 2
  for (let i = 3; i < 6; i++)
    for (let j = 3; j < 6; j++) if (i !== j) rightCells.push([i, j]);
  // Block 3
  for (let i = 6; i < 9; i++)
    for (let j = 6; j < 9; j++) if (i !== j) rightCells.push([i, j]);
  // Bridges (symmetric)
  rightCells.push([2, 6], [6, 2], [5, 8], [8, 5]);

  const leftOx = ox;
  const rightOx = ox + side + gap;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Left matrix frame */}
      <rect
        x={leftOx}
        y={oy}
        width={side}
        height={side}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.6}
      />
      {/* Right matrix frame */}
      <rect
        x={rightOx}
        y={oy}
        width={side}
        height={side}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.6}
      />

      {/* Left cells */}
      {leftCells.map(([i, j], k) => (
        <rect
          key={`l-${k}`}
          x={leftOx + j * cell + 0.25}
          y={oy + i * cell + 0.25}
          width={cell - 0.5}
          height={cell - 0.5}
          fill="var(--color-ink)"
        />
      ))}

      {/* Right cells */}
      {rightCells.map(([i, j], k) => (
        <rect
          key={`r-${k}`}
          x={rightOx + j * cell + 0.25}
          y={oy + i * cell + 0.25}
          width={cell - 0.5}
          height={cell - 0.5}
          fill="var(--color-ink)"
        />
      ))}

      {/* Arrow between them */}
      <line
        x1={leftOx + side + 1}
        y1={oy + side / 2}
        x2={rightOx - 1}
        y2={oy + side / 2}
        stroke="var(--color-ink-mute)"
        strokeWidth={0.7}
      />
      <polyline
        points={`${rightOx - 3},${oy + side / 2 - 2} ${rightOx - 1},${oy + side / 2} ${rightOx - 3},${oy + side / 2 + 2}`}
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={0.7}
        strokeLinejoin="round"
      />
    </svg>
  );
}
