// Decision tree silhouette — horizontal, mixed-shape nodes (square / circle /
// triangle) with mid-edge labels. Must look clearly distinct from the
// vertical all-rectangle org-chart thumbnail.

export function DecisionTreeThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Edges drawn first so shapes overlap them cleanly. */}

      {/* root → chance circle (upper Launch branch) */}
      <path
        d="M 22 40 H 34 V 28 H 46"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />
      {/* root → terminal (lower Don't-launch branch) */}
      <path
        d="M 22 40 H 34 V 62 H 96"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />

      {/* chance → three terminals */}
      <path d="M 60 28 H 78 V 12 H 96" fill="none" stroke="var(--color-ink-mute)" strokeWidth={1} />
      <path d="M 60 28 H 78 V 28 H 96" fill="none" stroke="var(--color-ink-mute)" strokeWidth={1} />
      <path d="M 60 28 H 78 V 44 H 96" fill="none" stroke="var(--color-ink-mute)" strokeWidth={1} />

      {/* Mid-edge probability ticks */}
      <text x={78} y={18} fontFamily="var(--font-mono)" fontSize={6} fill="var(--color-ink-soft)" textAnchor="middle">
        0.3
      </text>
      <text x={78} y={26} fontFamily="var(--font-mono)" fontSize={6} fill="var(--color-ink-soft)" textAnchor="middle">
        0.5
      </text>
      <text x={78} y={42} fontFamily="var(--font-mono)" fontSize={6} fill="var(--color-ink-soft)" textAnchor="middle">
        0.2
      </text>

      {/* Decision square (root) */}
      <rect
        x={14}
        y={32}
        width={16}
        height={16}
        rx={2}
        ry={2}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />

      {/* Chance circle */}
      <circle
        cx={53}
        cy={28}
        r={7}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />

      {/* Three terminal triangles on the right (pointing right) */}
      <polygon
        points="96,8 104,12 96,16"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <polygon
        points="96,24 104,28 96,32"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <polygon
        points="96,40 104,44 96,48"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Fourth terminal for Don't-launch branch */}
      <polygon
        points="96,58 104,62 96,66"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
    </svg>
  );
}
