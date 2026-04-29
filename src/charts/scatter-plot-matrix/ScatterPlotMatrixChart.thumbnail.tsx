export function ScatterPlotMatrixThumbnail() {
  // 3×3 grid at thumbnail scale — the diagonal reads as labels, off-diagonal
  // panels carry tiny scatter clouds with visibly different correlations.
  const n = 3;
  const x0 = 14;
  const y0 = 8;
  const cell = 22;
  const gap = 4;

  // Hand-placed points per off-diagonal panel. (row, col) pairs:
  // (0,1) strong negative; (0,2) mild negative; (1,0) mirror of (0,1);
  // (1,2) mild positive; (2,0) mirror of (0,2); (2,1) mirror of (1,2).
  const clouds: Record<string, Array<[number, number]>> = {
    // strong negative
    neg: [
      [3, 16], [5, 14], [6, 13], [8, 11], [9, 10], [11, 9],
      [13, 7], [14, 6], [16, 5], [17, 4], [4, 15], [10, 8],
      [12, 8], [15, 6],
    ],
    // mild negative
    mild_neg: [
      [3, 14], [5, 15], [7, 10], [9, 12], [10, 9], [12, 8],
      [13, 11], [15, 7], [16, 9], [17, 6], [6, 12], [14, 10],
    ],
    // mild positive
    mild_pos: [
      [3, 5], [5, 6], [7, 9], [9, 8], [10, 11], [12, 10],
      [13, 13], [15, 14], [16, 12], [17, 16], [6, 7], [14, 11],
    ],
  };

  const kindFor = (r: number, c: number): keyof typeof clouds => {
    // Map (r,c) to cloud kind. Mirrored pairs share a kind.
    if ((r === 0 && c === 1) || (r === 1 && c === 0)) return "neg";
    if ((r === 0 && c === 2) || (r === 2 && c === 0)) return "mild_neg";
    return "mild_pos"; // (1,2) and (2,1)
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {Array.from({ length: n }).map((_, r) =>
        Array.from({ length: n }).map((_, c) => {
          const px = x0 + c * (cell + gap);
          const py = y0 + r * (cell + gap);
          const isDiag = r === c;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={px}
                y={py}
                width={cell}
                height={cell}
                fill="none"
                stroke="var(--color-hairline)"
              />
              {isDiag ? (
                // Little density bump + "var" label
                <>
                  <path
                    d={`M ${px + 3} ${py + cell - 4}
                        Q ${px + cell / 2} ${py + 6},
                          ${px + cell - 3} ${py + cell - 4}`}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={1}
                  />
                  <text
                    x={px + cell / 2}
                    y={py + cell / 2 + 1}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={5}
                    fill="var(--color-ink)"
                  >
                    {`x${r + 1}`}
                  </text>
                </>
              ) : (
                clouds[kindFor(r, c)].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={px + cx}
                    cy={py + cy}
                    r={0.9}
                    fill="var(--color-ink)"
                    fillOpacity={0.75}
                  />
                ))
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}
