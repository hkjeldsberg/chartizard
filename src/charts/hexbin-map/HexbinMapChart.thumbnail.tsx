export function HexbinMapThumbnail() {
  // A small honeycomb of point-top hexagons. 4 rows × 5 cols-ish with odd-row
  // offset — enough to read as "hex tessellation" at 120×80.
  const r = 8; // hex radius
  const s3 = Math.sqrt(3);
  const hexW = s3 * r;
  const vStep = 1.5 * r;
  const cols = 5;
  const rows = 4;
  const gridW = cols * hexW + hexW / 2;
  const gridH = (rows - 1) * vStep + 2 * r;
  const offsetX = (120 - gridW) / 2 + hexW / 2;
  const offsetY = (80 - gridH) / 2 + r;

  // Shading pattern — denser on the right to hint at the Northeast story.
  const OPACITIES: ReadonlyArray<number> = [
    0.25, 0.3, 0.35, 0.55, 0.8,
    0.3, 0.4, 0.5, 0.7, 0.9,
    0.4, 0.35, 0.25, 0.5, 0.75,
    0.55, 0.25, 0.2, 0.3, 0.4,
  ];

  const hexPath = (() => {
    const pts: Array<[number, number]> = [
      [0, -r],
      [(s3 / 2) * r, -r / 2],
      [(s3 / 2) * r, r / 2],
      [0, r],
      [-(s3 / 2) * r, r / 2],
      [-(s3 / 2) * r, -r / 2],
    ];
    return "M" + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join("L") + "Z";
  })();

  const cells: Array<{ cx: number; cy: number; op: number }> = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOdd = row % 2 === 1 ? hexW / 2 : 0;
      const cx = offsetX + col * hexW + xOdd;
      const cy = offsetY + row * vStep;
      const idx = row * cols + col;
      cells.push({ cx, cy, op: OPACITIES[idx] ?? 0.3 });
    }
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${c.cx}, ${c.cy})`}>
          <path d={hexPath} fill={`rgba(26,22,20,${c.op.toFixed(2)})`} />
        </g>
      ))}
    </svg>
  );
}
