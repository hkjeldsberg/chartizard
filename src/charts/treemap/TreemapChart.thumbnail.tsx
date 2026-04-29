export function TreemapThumbnail() {
  // A silhouette of nested rectangles — one dominant block (Tech),
  // two mid-size (Financials, Healthcare), then a handful of small ones.
  // Hand-placed at 120×80 to echo the live chart's squarified layout
  // without doing any actual layout.
  const cells: Array<{ x: number; y: number; w: number; h: number; o: number }> = [
    // Dominant Tech block (top-left, subdivided)
    { x: 6, y: 6, w: 60, h: 44, o: 0.9 }, // Apple (inside Tech)
    { x: 66, y: 6, w: 26, h: 22, o: 0.75 }, // Microsoft
    { x: 66, y: 28, w: 26, h: 22, o: 0.6 }, // Nvidia
    // Financials mid-block (top-right)
    { x: 92, y: 6, w: 22, h: 30, o: 0.5 },
    // Healthcare (right column lower)
    { x: 92, y: 36, w: 22, h: 16, o: 0.35 },
    // Consumer Disc (lower-left)
    { x: 6, y: 50, w: 34, h: 24, o: 0.55 },
    // Remaining small sector cells
    { x: 40, y: 50, w: 20, h: 24, o: 0.4 },
    { x: 60, y: 50, w: 20, h: 12, o: 0.3 },
    { x: 60, y: 62, w: 20, h: 12, o: 0.22 },
    { x: 80, y: 52, w: 34, h: 22, o: 0.28 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={c.w - 1}
          height={c.h - 1}
          fill="var(--color-ink)"
          opacity={c.o}
        />
      ))}
    </svg>
  );
}
