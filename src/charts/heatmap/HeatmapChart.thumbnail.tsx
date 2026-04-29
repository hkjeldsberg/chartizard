export function HeatmapThumbnail() {
  // 7 rows × 12 columns tiny grid — abbreviated heatmap silhouette.
  // Values hand-picked to suggest a commuter-peak pattern (two dark vertical
  // bands mid-width) plus a softer weekend tail at the bottom rows.
  const rows = [
    [0.10, 0.10, 0.20, 0.70, 0.95, 0.55, 0.50, 0.60, 0.90, 0.75, 0.40, 0.20],
    [0.10, 0.12, 0.22, 0.72, 1.00, 0.55, 0.50, 0.62, 0.92, 0.78, 0.42, 0.20],
    [0.10, 0.10, 0.22, 0.70, 0.95, 0.54, 0.50, 0.62, 0.90, 0.76, 0.40, 0.20],
    [0.12, 0.12, 0.24, 0.72, 0.95, 0.55, 0.52, 0.62, 0.90, 0.76, 0.42, 0.22],
    [0.14, 0.14, 0.26, 0.70, 0.90, 0.55, 0.54, 0.66, 0.86, 0.70, 0.50, 0.38],
    [0.30, 0.20, 0.18, 0.28, 0.46, 0.60, 0.68, 0.74, 0.78, 0.80, 0.68, 0.48],
    [0.36, 0.24, 0.16, 0.22, 0.36, 0.50, 0.58, 0.62, 0.64, 0.62, 0.50, 0.34],
  ];

  const x0 = 14;
  const y0 = 10;
  const cellW = 7.5;
  const cellH = 7.5;

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
              width={cellW - 0.6}
              height={cellH - 0.6}
              fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
            />
          );
        }),
      )}
      {/* Legend strip — right edge */}
      {Array.from({ length: 8 }).map((_, i) => {
        const t = 1 - i / 7;
        const opacity = 0.08 + t * 0.85;
        return (
          <rect
            key={i}
            x={111}
            y={10 + i * 7}
            width={4}
            height={6.5}
            fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
          />
        );
      })}
    </svg>
  );
}
