// Orthogonal dendrogram silhouette — leaves along the bottom, right-angle
// merges at increasing heights, one dashed cut line near the top.

export function DendrogramThumbnail() {
  const leafY = 68;
  // 8 leaf x positions spread across 120×80.
  const leafX = [12, 24, 36, 48, 64, 76, 92, 108];

  // Each vertical segment: x, y1 (lower), y2 (upper).
  const verticals: Array<[number, number, number]> = [
    // leaves up to pair merges
    [12, leafY, 60], [24, leafY, 60],
    [36, leafY, 58], [48, leafY, 58],
    [64, leafY, 60], [76, leafY, 60],
    [92, leafY, 56], [108, leafY, 56],
    // pair midpoints up to block merges
    [18, 60, 46], [42, 58, 46],
    [70, 60, 42], [100, 56, 42],
    // block midpoints up to root
    [30, 46, 22], [85, 42, 22],
  ];

  // Horizontal merge bars: [leftX, rightX, y].
  const merges: Array<[number, number, number]> = [
    [12, 24, 60],
    [36, 48, 58],
    [18, 42, 46],
    [64, 76, 60],
    [92, 108, 56],
    [70, 100, 42],
    [30, 85, 22],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* y-axis hairline */}
      <line x1={6} x2={6} y1={18} y2={leafY} stroke="var(--color-hairline)" strokeWidth={0.8} />
      {/* cut line at dissimilarity ~1.5 */}
      <line
        x1={6}
        x2={114}
        y1={32}
        y2={32}
        stroke="var(--color-ink)"
        strokeDasharray="3 2"
        strokeWidth={0.8}
        opacity={0.7}
      />
      {/* vertical segments */}
      {verticals.map(([x, y1, y2], i) => (
        <line
          key={`v-${i}`}
          x1={x}
          x2={x}
          y1={y1}
          y2={y2}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      ))}
      {/* horizontal merge bars */}
      {merges.map(([lx, rx, y], i) => (
        <line
          key={`h-${i}`}
          x1={lx}
          x2={rx}
          y1={y}
          y2={y}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      ))}
      {/* leaf dots */}
      {leafX.map((x, i) => (
        <circle key={`leaf-${i}`} cx={x} cy={leafY} r={1.4} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
