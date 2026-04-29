export function LeverageThumbnail() {
  // Scatter silhouette: dense low-leverage cloud plus 3 high-leverage points
  // above a dashed threshold line.
  const lowPoints = [
    [22, 52], [30, 55], [35, 48], [42, 50], [48, 54],
    [54, 47], [60, 51], [66, 55], [72, 49], [78, 53],
    [28, 44], [44, 58], [58, 42], [70, 57], [84, 50],
    [38, 46], [52, 56], [64, 44], [76, 52], [86, 48],
  ];
  const highPoints = [
    [18, 22], // high leverage, far left
    [96, 26], // high leverage, far right
    [30, 28], // high leverage, upper
  ];
  const thresholdY = 35;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* y-axis */}
      <line x1="10" y1="10" x2="10" y2="68" stroke="var(--color-hairline)" />
      {/* x-axis */}
      <line x1="10" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />

      {/* Threshold line */}
      <line
        x1="10"
        y1={thresholdY}
        x2="112"
        y2={thresholdY}
        stroke="var(--color-ink)"
        strokeOpacity="0.4"
        strokeWidth="0.8"
        strokeDasharray="3 2"
      />

      {/* Low-leverage cloud */}
      {lowPoints.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1.6"
          fill="var(--color-ink)"
          fillOpacity="0.7"
        />
      ))}

      {/* High-leverage points (open circles above threshold) */}
      {highPoints.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.5"
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}
