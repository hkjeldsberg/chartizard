// Bivariate-choropleth silhouette: a grid of cells filled from a 3×3
// bivariate palette plus an inline mini-legend. The key visual is the
// palette itself — light neutral in one corner, deep purple in the
// opposite, with two distinct colour ramps at the other two corners.

const PALETTE: ReadonlyArray<ReadonlyArray<string>> = [
  ["#e8e8e8", "#b5c0da", "#6c83b5"], // low edu
  ["#d8b9c9", "#a6a6c1", "#627f9b"], // mid edu
  ["#c97593", "#9668a0", "#3f2449"], // high edu
];

// Tier grid for the thumbnail — 7 cols × 5 rows of (incomeBin, eduBin)
// pairs. Hand-picked so the corners (high-high, low-low) and two
// mismatched regions read at a glance.
const TIERS: ReadonlyArray<ReadonlyArray<[0 | 1 | 2, 0 | 1 | 2]>> = [
  [[1, 2], [2, 2], [1, 2], [2, 2], [1, 1], [2, 2], [2, 2]],
  [[1, 1], [0, 0], [0, 0], [1, 1], [0, 0], [1, 1], [2, 2]],
  [[2, 2], [1, 1], [2, 2], [2, 2], [2, 2], [0, 0], [0, 1]],
  [[1, 1], [0, 0], [1, 1], [0, 0], [0, 0], [0, 0], [1, 1]],
  [[2, 1], [1, 1], [2, 1], [1, 0], [1, 1], [2, 2], [1, 1]],
];

export function BivariateChoroplethThumbnail() {
  const x0 = 6;
  const y0 = 10;
  const cellW = 11;
  const cellH = 11;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Map cells */}
      {TIERS.map((row, r) =>
        row.map((tier, c) => {
          const [inc, edu] = tier;
          const fill = PALETTE[edu][inc];
          return (
            <rect
              key={`${r}-${c}`}
              x={x0 + c * cellW}
              y={y0 + r * cellH}
              width={cellW - 0.8}
              height={cellH - 0.8}
              fill={fill}
            />
          );
        }),
      )}

      {/* 3×3 inline legend in the right margin */}
      {PALETTE.map((row, edu) =>
        row.map((fill, inc) => {
          const yIdx = 2 - edu;
          return (
            <rect
              key={`lg-${edu}-${inc}`}
              x={92 + inc * 7}
              y={14 + yIdx * 7}
              width={6}
              height={6}
              fill={fill}
            />
          );
        }),
      )}
      {/* Axis arrows — tiny lines, not text */}
      <line
        x1={92}
        y1={39}
        x2={113}
        y2={39}
        stroke="var(--color-ink-mute)"
        strokeWidth={0.5}
      />
      <line
        x1={90}
        y1={14}
        x2={90}
        y2={35}
        stroke="var(--color-ink-mute)"
        strokeWidth={0.5}
      />
    </svg>
  );
}
