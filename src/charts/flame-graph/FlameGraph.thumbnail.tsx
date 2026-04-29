// Silhouette of a flame graph — stacked rectangles with root at the BOTTOM
// (this is what distinguishes it from the icicle thumbnail). Not colourised
// here — the tile palette stays ink/hairline; the warm palette is reserved
// for the live chart itself.
export function FlameGraphThumbnail() {
  const rowH = 12;
  const bottomY = 72;
  // Each row's rectangles, bottom-to-top (row 0 = root).
  const rows = [
    // Row 0 — main(), full width.
    [{ x: 4, w: 112, o: 0.34 }],
    // Row 1 — handleRequest (70%) + backgroundJob (30%).
    [
      { x: 4, w: 78, o: 0.28 },
      { x: 83, w: 33, o: 0.28 },
    ],
    // Row 2 — parseJSON (5), authenticate (10), queryDB (50), render (5) /
    //         serializeBatch (20), uploadToS3 (10).
    [
      { x: 4, w: 6, o: 0.22 }, // parseJSON
      { x: 11, w: 11, o: 0.22 }, // authenticate
      { x: 23, w: 55, o: 0.22 }, // queryDB
      { x: 79, w: 3, o: 0.22 }, // render
      { x: 83, w: 22, o: 0.22 }, // serializeBatch
      { x: 106, w: 10, o: 0.22 }, // uploadToS3
    ],
    // Row 3 — driver.prepare (10) + driver.execute (40) under queryDB.
    [
      { x: 23, w: 11, o: 0.18 }, // driver.prepare
      { x: 35, w: 43, o: 0.18 }, // driver.execute
    ],
    // Row 4 — socketRead (35, widest) + decodeRow (5) under driver.execute.
    [
      { x: 35, w: 38, o: 0.14 }, // socketRead — HOT PATH (widest at top)
      { x: 74, w: 4, o: 0.14 }, // decodeRow
    ],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((row, ri) =>
        row.map((c, ci) => (
          <rect
            key={`r${ri}-${ci}`}
            x={c.x}
            y={bottomY - (ri + 1) * rowH + 1}
            width={Math.max(0, c.w - 0.8)}
            height={rowH - 1}
            fill="var(--color-ink)"
            opacity={c.o}
            stroke="var(--color-page)"
            strokeWidth="0.5"
          />
        )),
      )}
      {/* baseline */}
      <line
        x1="4"
        y1="72"
        x2="116"
        y2="72"
        stroke="var(--color-hairline)"
        strokeWidth="0.5"
      />
    </svg>
  );
}
