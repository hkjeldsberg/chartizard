export function ControlFlowGraphThumbnail() {
  // Minimal CFG silhouette: entry → block → diamond → two branches → exit,
  // with a back-edge curving around the left side to mark the loop.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Entry (small oval) */}
      <rect
        x={52}
        y={4}
        width={16}
        height={6}
        rx={3}
        ry={3}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
      />

      {/* Edge entry → block */}
      <line x1={60} y1={10} x2={60} y2={16} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,18 57,15 63,15" fill="var(--color-ink)" />

      {/* Basic block (rectangle) */}
      <rect
        x={44}
        y={18}
        width={32}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Edge block → diamond */}
      <line x1={60} y1={30} x2={60} y2={36} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,38 57,35 63,35" fill="var(--color-ink)" />

      {/* Diamond (conditional) */}
      <polygon
        points="60,38 76,48 60,58 44,48"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* T edge → block3 (down-right) */}
      <line x1={66} y1={54} x2={86} y2={64} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="88,65 84,64 85,68" fill="var(--color-ink)" />
      <rect
        x={88}
        y={62}
        width={24}
        height={10}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
      />
      <text x={73} y={59} fontFamily="var(--font-mono)" fontSize={7} fill="var(--color-ink-soft)">
        T
      </text>

      {/* F edge → exit (down) */}
      <line x1={60} y1={58} x2={60} y2={72} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,74 57,71 63,71" fill="var(--color-ink)" />
      <text x={52} y={66} fontFamily="var(--font-mono)" fontSize={7} fill="var(--color-ink-soft)">
        F
      </text>
      <rect
        x={52}
        y={74}
        width={16}
        height={5}
        rx={2.5}
        ry={2.5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Back-edge (dashed): block3 → block, routed around the left gutter */}
      <path
        d="M 88 67 C 16 67, 16 22, 44 22"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
        strokeDasharray="3 2"
        opacity={0.75}
      />
      <polygon points="46,22 42,20 42,24" fill="var(--color-ink-mute)" />
    </svg>
  );
}
