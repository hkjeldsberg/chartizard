// Silhouette of an icicle chart — 4 stacked rows where each row's children
// split the parent's width. Hand-placed, no layout library.
export function IcicleThumbnail() {
  const rowH = 18;
  const rows = [
    // Row 0 — root (full width)
    [{ x: 2, w: 116, o: 0.34 }],
    // Row 1 — three children (60ms / 30ms / 10ms)
    [
      { x: 2, w: 70, o: 0.26 },
      { x: 73, w: 34, o: 0.26 },
      { x: 108, w: 10, o: 0.26 },
    ],
    // Row 2 — grandchildren
    [
      { x: 2, w: 46, o: 0.2 }, // LiveChartView (40ms)
      { x: 49, w: 18, o: 0.2 }, // FilterSidebar (15ms)
      { x: 68, w: 4, o: 0.2 }, // other (5ms)
      { x: 73, w: 12, o: 0.2 }, // createRoot (10ms)
      { x: 86, w: 17, o: 0.2 }, // applyPatches (15ms)
      { x: 104, w: 3, o: 0.2 }, // hydrate other
    ],
    // Row 3 — deepest (only under LiveChartView + FilterSidebar)
    [
      { x: 2, w: 6, o: 0.14 }, // ParentSize.measure
      { x: 9, w: 34, o: 0.14 }, // Visx.render (widest leaf)
      { x: 44, w: 4, o: 0.14 }, // React.reconcile
      { x: 49, w: 12, o: 0.14 }, // computeCounts
      { x: 62, w: 4, o: 0.14 }, // useSearchParams
      { x: 67, w: 0, o: 0 },
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
        row.map((c, ci) =>
          c.w > 0 ? (
            <rect
              key={`r${ri}-${ci}`}
              x={c.x}
              y={ri * rowH + 2}
              width={Math.max(0, c.w - 0.8)}
              height={rowH - 1}
              fill="var(--color-ink)"
              opacity={c.o}
              stroke="var(--color-page)"
              strokeWidth={0.5}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
