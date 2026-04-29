// Quadrant-chart silhouette: a 2×2 grid with a tinted top-left
// "quick wins" cell and a scatter of dots sitting mostly in the top
// quadrants. Meant to read as "prioritisation grid" at a glance.

export function QuadrantThumbnail() {
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
      {/* Quadrant tints — top row a little denser to suggest weight */}
      <rect x={10} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.1} />
      <rect x={60} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.14} />
      <rect x={10} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.04} />
      <rect x={60} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.06} />

      {/* Dividers */}
      <line x1={60} y1={8} x2={60} y2={72} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={10} y1={40} x2={110} y2={40} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Initiative dots — most in top row, two down-right, a couple down-left */}
      {[
        // quick wins (top-left) — denser cluster
        [20, 20], [26, 26], [32, 18], [40, 24], [46, 30],
        // major projects (top-right)
        [70, 22], [80, 16], [88, 28], [96, 20], [102, 30],
        // fill-ins (bottom-left) — few
        [22, 58], [34, 64], [44, 54],
        // time sinks (bottom-right) — fewest
        [82, 60], [98, 66],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.7} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
