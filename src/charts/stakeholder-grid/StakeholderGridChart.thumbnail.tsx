// Stakeholder Power-Interest Grid silhouette: a 2×2 grid with the
// top-right "Manage Closely" cell tinted heaviest, and a handful of
// stakeholder dots distributed across the four quadrants.

export function StakeholderGridThumbnail() {
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
      {/* Quadrant tints — top-right (Manage Closely) heaviest */}
      <rect x={10} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.08} />
      <rect x={60} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.16} />
      <rect x={10} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.04} />
      <rect x={60} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.1} />

      {/* Dividers */}
      <line x1={60} y1={8} x2={60} y2={72} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={10} y1={40} x2={110} y2={40} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Stakeholder dots — largest in Manage Closely */}
      {[
        // Keep Informed (top-left)
        [22, 18], [30, 26], [44, 22],
        // Manage Closely (top-right) — bigger to suggest CEO etc.
        [74, 18, 2.2], [86, 26, 2.0], [96, 20, 2.0],
        // Monitor (bottom-left) — small
        [20, 62], [32, 56], [42, 66],
        // Keep Satisfied (bottom-right)
        [72, 58], [86, 64], [100, 54],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={(r as number) ?? 1.7} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
