// Magic Quadrant silhouette: 2×2 grid with cross-hair dividers and a
// handful of labelled bubble-positions. The top-right quadrant (Leaders)
// gets the heavier tint to signal the canonical reading.

export function MagicQuadrantThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer frame */}
      <rect
        x={10}
        y={8}
        width={100}
        height={64}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Quadrant tints */}
      <rect x={10} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.05} />
      <rect x={60} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.14} />
      <rect x={10} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.03} />
      <rect x={60} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.05} />

      {/* Cross-hair dividers */}
      <line x1={60} y1={8} x2={60} y2={72} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={10} y1={40} x2={110} y2={40} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Vendor bubbles with short labels */}
      {[
        // Leaders (top-right)
        [88, 20, 2.2],
        [96, 28, 2.0],
        [76, 24, 1.8],
        // Challengers (top-left)
        [30, 22, 1.8],
        [42, 30, 1.6],
        // Visionaries (bottom-right)
        [92, 56, 1.6],
        [80, 62, 1.6],
        // Niche Players (bottom-left)
        [24, 60, 1.4],
        [38, 66, 1.4],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
