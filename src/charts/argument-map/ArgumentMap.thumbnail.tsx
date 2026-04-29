// Argument-map silhouette: a root claim at the top with supporting (filled)
// and opposing (outlined) reasons beneath, plus one rebuttal under an objection.

export function ArgumentMapThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <marker
          id="argmap-thumb-arrow"
          markerWidth="4"
          markerHeight="4"
          refX="3.5"
          refY="2"
          orient="auto"
        >
          <polygon points="0,0 4,2 0,4" fill="var(--color-ink)" />
        </marker>
      </defs>

      {/* Edges — reasons point UP to the claim they address */}
      <g fill="none" stroke="var(--color-ink)" strokeWidth="0.9">
        {/* Supports */}
        <line x1="22" y1="40" x2="48" y2="20" markerEnd="url(#argmap-thumb-arrow)" />
        <line x1="54" y1="40" x2="58" y2="20" markerEnd="url(#argmap-thumb-arrow)" />
        {/* Objects to (dashed) */}
        <line
          x1="86"
          y1="40"
          x2="68"
          y2="20"
          strokeDasharray="3 2"
          markerEnd="url(#argmap-thumb-arrow)"
        />
        {/* Rebut (dotted, from rebuttal up to objection) */}
        <line
          x1="98"
          y1="66"
          x2="92"
          y2="52"
          stroke="var(--color-ink-mute)"
          strokeDasharray="1.5 2"
          markerEnd="url(#argmap-thumb-arrow)"
        />
      </g>

      {/* Root claim (filled) */}
      <rect
        x="44"
        y="6"
        width="34"
        height="12"
        rx="3"
        fill="var(--color-ink)"
      />

      {/* Supporting reasons (filled, muted) */}
      <rect
        x="10"
        y="40"
        width="26"
        height="12"
        rx="3"
        fill="var(--color-ink-soft)"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
      />
      <rect
        x="44"
        y="40"
        width="22"
        height="12"
        rx="3"
        fill="var(--color-ink-soft)"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
      />

      {/* Opposing reason (outlined, heavier stroke) */}
      <rect
        x="74"
        y="40"
        width="26"
        height="12"
        rx="3"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
      />

      {/* Rebuttal (dashed outline) */}
      <rect
        x="86"
        y="66"
        width="26"
        height="10"
        rx="3"
        fill="var(--color-surface)"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.9"
        strokeDasharray="2.5 2"
      />
    </svg>
  );
}
