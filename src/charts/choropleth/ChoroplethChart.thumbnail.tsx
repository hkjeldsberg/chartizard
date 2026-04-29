export function ChoroplethThumbnail() {
  // Abstract 7×5 grid silhouette of the choropleth — cells shaded by a
  // hand-tuned population proxy. No labels, no legend; just the colour field.
  const rows: ReadonlyArray<ReadonlyArray<number>> = [
    [0.12, 0.12, 0.06, 0.35, 0.10, 0.22, 0.92],
    [0.62, 0.58, 0.36, 0.60, 0.50, 0.30, 0.30],
    [0.46, 0.10, 0.32, 0.08, 0.44, 0.24, 0.32],
    [0.54, 0.28, 0.56, 0.26, 0.18, 0.24, 0.98],
    [1.00, 0.22, 0.40, 0.18, 0.38, 0.30, 0.78],
  ];

  const x0 = 10;
  const y0 = 10;
  const cellW = 13.5;
  const cellH = 11;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((row, r) =>
        row.map((v, c) => {
          const opacity = 0.08 + v * 0.85;
          return (
            <rect
              key={`${r}-${c}`}
              x={x0 + c * cellW}
              y={y0 + r * cellH}
              width={cellW - 0.8}
              height={cellH - 0.8}
              fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
            />
          );
        }),
      )}
      {/* Legend strip — right edge, vertical ramp */}
      {Array.from({ length: 8 }).map((_, i) => {
        const t = 1 - i / 7;
        const opacity = 0.08 + t * 0.85;
        return (
          <rect
            key={i}
            x={110}
            y={12 + i * 7}
            width={4}
            height={6.5}
            fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
          />
        );
      })}
    </svg>
  );
}
