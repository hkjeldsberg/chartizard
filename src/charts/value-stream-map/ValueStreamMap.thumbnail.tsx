// VSM silhouette: entity boxes on top, four process boxes in a row with
// inventory triangles between them, sawtooth timeline at the bottom.

export function ValueStreamMapThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Supplier / control / customer (entity row) */}
      <rect x={4} y={6} width={22} height={12} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={49} y={6} width={22} height={12} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={94} y={6} width={22} height={12} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Zigzag info flows */}
      <path d="M 26 12 l 3 -2 l 3 2 l 3 -2 l 3 2 l 3 -2 l 3 2 l 3 -2 l 3 2 L 49 12" fill="none" stroke="var(--color-ink-mute)" strokeWidth={0.8} />
      <path d="M 71 12 l 3 -2 l 3 2 l 3 -2 l 3 2 l 3 -2 l 3 2 l 3 -2 l 3 2 L 94 12" fill="none" stroke="var(--color-ink-mute)" strokeWidth={0.8} />

      {/* Process boxes */}
      {[10, 38, 66, 94].map((x, i) => (
        <g key={i}>
          <rect x={x} y={30} width={16} height={10} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
          {/* Data tile (stacked rows under the process) */}
          <rect x={x} y={42} width={16} height={14} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.8} />
          <line x1={x} y1={45.5} x2={x + 16} y2={45.5} stroke="var(--color-hairline)" strokeWidth={0.6} />
          <line x1={x} y1={49} x2={x + 16} y2={49} stroke="var(--color-hairline)" strokeWidth={0.6} />
          <line x1={x} y1={52.5} x2={x + 16} y2={52.5} stroke="var(--color-hairline)" strokeWidth={0.6} />
        </g>
      ))}

      {/* Inventory triangles between processes */}
      {[27, 55, 83].map((cx, i) => (
        <polygon
          key={i}
          points={`${cx},33 ${cx + 3},38 ${cx - 3},38`}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={0.8}
        />
      ))}

      {/* Sawtooth timeline (bottom) */}
      <path
        d="M 4 70 L 20 70 L 22 62 L 24 70 L 40 70 L 42 62 L 44 70 L 60 70 L 62 62 L 64 70 L 80 70 L 82 62 L 84 70 L 100 70"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* LT/PT summary stub */}
      <rect x={102} y={66} width={14} height={8} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.8} />
    </svg>
  );
}
