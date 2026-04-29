// Star-glyph-plot thumbnail: a 3x3 lattice of tiny glyphs. The lattice —
// not the glyph — is the identifying silhouette; a single glyph would read
// as "star plot / radar" instead.

const N_AXES = 6;

function angleFor(i: number) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / N_AXES;
}

function polygonPoints(values: ReadonlyArray<number>, cx: number, cy: number, r: number) {
  return values
    .map((v, i) => {
      const rad = r * v;
      return `${(cx + rad * Math.cos(angleFor(i))).toFixed(2)},${(
        cy +
        rad * Math.sin(angleFor(i))
      ).toFixed(2)}`;
    })
    .join(" ");
}

// 9 hand-tuned glyph shapes so no two mini-glyphs look identical.
const GLYPHS: ReadonlyArray<ReadonlyArray<number>> = [
  [0.9, 0.3, 0.4, 0.8, 0.4, 0.3], // economy
  [0.8, 0.5, 0.5, 0.7, 0.4, 0.4],
  [0.3, 0.95, 0.9, 0.9, 0.9, 0.85], // truck
  [0.95, 0.6, 0.6, 0.95, 0.1, 0.7], // EV
  [0.5, 0.7, 0.6, 0.6, 0.4, 0.75],
  [0.35, 0.9, 0.55, 0.95, 0.7, 1.0], // sports
  [0.3, 0.7, 0.8, 0.65, 0.7, 0.6],
  [0.7, 0.4, 0.5, 0.55, 0.4, 0.35],
  [0.85, 0.35, 0.4, 0.6, 0.4, 0.3],
];

export function StarGlyphPlotThumbnail() {
  const COLS = 3;
  const ROWS = 3;
  const padX = 10;
  const padY = 8;
  const W = 120;
  const H = 80;
  const cellW = (W - padX * 2) / COLS;
  const cellH = (H - padY * 2) / ROWS;
  const r = Math.min(cellW, cellH) / 2 - 2;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {GLYPHS.map((values, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const cx = padX + col * cellW + cellW / 2;
        const cy = padY + row * cellH + cellH / 2;
        return (
          <g key={i}>
            {/* Reference ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
            />
            {/* Spokes */}
            {Array.from({ length: N_AXES }, (_, ai) => {
              const end = {
                x: cx + r * Math.cos(angleFor(ai)),
                y: cy + r * Math.sin(angleFor(ai)),
              };
              return (
                <line
                  key={ai}
                  x1={cx}
                  y1={cy}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--color-hairline)"
                  strokeWidth={0.4}
                />
              );
            })}
            {/* Glyph polygon */}
            <polygon
              points={polygonPoints(values, cx, cy, r)}
              fill="rgba(26,22,20,0.22)"
              stroke="var(--color-ink)"
              strokeWidth={0.9}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
