export function ShmooPlotThumbnail() {
  // Tiny 10×8 pass/fail grid. Same rule shape as the live chart: the
  // diagonal pass/fail boundary runs from upper-left to lower-right.
  const cols = 10;
  const rows = 8;
  const x0 = 16;
  const y0 = 10;
  const cellW = 8.6;
  const cellH = 7;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          // Diagonal fail rule — fail when (c + (rows - 1 - r)) >= threshold.
          // Drawn with row 0 at the TOP of the thumbnail → low freq at top
          // visually. For a shmoo, pass is upper-left, fail is lower-right.
          const fail = c - r < -2;
          const x = x0 + c * cellW;
          const y = y0 + r * cellH;
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={cellW - 0.6}
              height={cellH - 0.6}
              fill={
                fail ? "rgba(26,22,20,0.72)" : "rgba(26,22,20,0.10)"
              }
            />
          );
        }),
      )}
      {/* Boundary contour — diagonal line approximating the pass/fail edge. */}
      <polyline
        points={(() => {
          const pts: string[] = [];
          for (let r = 0; r < rows; r++) {
            // Boundary is at c = r - 2 (the line where fail starts).
            const c = r - 2 + 0.5;
            const x = x0 + c * cellW;
            const y = y0 + (r + 0.5) * cellH;
            if (x >= x0 && x <= x0 + cols * cellW) {
              pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            }
          }
          return pts.join(" ");
        })()}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.3"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
