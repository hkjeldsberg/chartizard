export function TileMapThumbnail() {
  // A 6×4 mini grid of equal squares, shaded to hint at a choropleth-style
  // signal without pretending to be a real map.
  const cols = 6;
  const rows = 4;
  const size = 14;
  const gap = 2;
  const startX = (120 - (cols * size + (cols - 1) * gap)) / 2;
  const startY = (80 - (rows * size + (rows - 1) * gap)) / 2;

  // Hand-tuned opacity pattern — darker band on the right (the "Northeast"),
  // lighter on the lower-middle (the "Deep South").
  const OPACITIES: ReadonlyArray<number> = [
    0.25, 0.35, 0.45, 0.55, 0.75, 0.9,
    0.3, 0.4, 0.5, 0.55, 0.7, 0.85,
    0.55, 0.4, 0.2, 0.2, 0.4, 0.65,
    0.7, 0.2, 0.15, 0.15, 0.25, 0.3,
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const op = OPACITIES[idx] ?? 0.3;
          return (
            <rect
              key={`${r}-${c}`}
              x={startX + c * (size + gap)}
              y={startY + r * (size + gap)}
              width={size}
              height={size}
              fill={`rgba(26,22,20,${op.toFixed(2)})`}
            />
          );
        }),
      )}
    </svg>
  );
}
