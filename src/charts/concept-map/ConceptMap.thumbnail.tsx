// Concept-map silhouette: hierarchical top-to-bottom with one cross-link.

export function ConceptMapThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <marker
          id="cmap-thumb-arrow"
          markerWidth="4"
          markerHeight="4"
          refX="3.5"
          refY="2"
          orient="auto"
        >
          <polygon points="0,0 4,2 0,4" fill="var(--color-ink-mute)" />
        </marker>
      </defs>

      {/* Edges — drawn before nodes */}
      {/* Root → three children */}
      <g
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.9"
      >
        <path d="M 55,14 Q 30,22 22,30" markerEnd="url(#cmap-thumb-arrow)" />
        <path d="M 60,16 L 60,30" markerEnd="url(#cmap-thumb-arrow)" />
        <path d="M 65,14 Q 90,22 98,30" markerEnd="url(#cmap-thumb-arrow)" />

        {/* Children → grandchildren */}
        <path d="M 22,40 L 14,56" markerEnd="url(#cmap-thumb-arrow)" />
        <path d="M 60,40 L 60,56" markerEnd="url(#cmap-thumb-arrow)" />
        <path d="M 98,40 L 98,56" markerEnd="url(#cmap-thumb-arrow)" />
      </g>

      {/* Cross-link (dashed diagonal), non-hierarchical */}
      <path
        d="M 22,36 Q 60,50 98,36"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
        strokeDasharray="2.5 2.5"
        markerEnd="url(#cmap-thumb-arrow)"
      />

      {/* Root node (ellipse) */}
      <ellipse
        cx="60"
        cy="10"
        rx="14"
        ry="5"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1.1"
      />

      {/* Row-2 nodes (ellipses) */}
      {[
        [22, 34],
        [60, 34],
        [98, 34],
      ].map(([x, y], i) => (
        <ellipse
          key={`r2-${i}`}
          cx={x}
          cy={y}
          rx="10"
          ry="4.5"
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth="1.1"
        />
      ))}

      {/* Row-3 nodes (rounded rectangles) */}
      {[
        [14, 62],
        [60, 62],
        [98, 62],
      ].map(([x, y], i) => (
        <rect
          key={`r3-${i}`}
          x={(x as number) - 9}
          y={(y as number) - 4}
          width={18}
          height={8}
          rx={3}
          ry={3}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth="1"
        />
      ))}

      {/* Edge-label dots — tiny marks on three of the edges to hint at the
          "relationship labels on arrows" convention. */}
      <g fill="var(--color-ink-soft)">
        <rect x="42" y="20" width="10" height="4" rx="1" opacity="0.4" />
        <rect x="57" y="20" width="6" height="4" rx="1" opacity="0.4" />
        <rect x="72" y="20" width="10" height="4" rx="1" opacity="0.4" />
      </g>
    </svg>
  );
}
