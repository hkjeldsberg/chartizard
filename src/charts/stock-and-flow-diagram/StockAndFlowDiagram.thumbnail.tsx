// Stock-and-Flow silhouette: source cloud → valve → stock rectangle → valve → sink cloud,
// with one auxiliary circle connected by a dashed info arrow to a valve.

export function StockAndFlowDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <marker
          id="sfd-thumb-info"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <polygon points="0,0 4,2 0,4" fill="var(--color-ink-mute)" />
        </marker>
      </defs>

      {/* Source cloud (left) — a few overlapping lobes */}
      <g stroke="var(--color-ink)" strokeWidth="0.9" fill="var(--color-surface)">
        <circle cx="8" cy="48" r="3.2" />
        <circle cx="12" cy="44" r="3.2" />
        <circle cx="15" cy="48" r="3.2" />
        <circle cx="11" cy="51" r="3.2" />
      </g>

      {/* Pipes — two parallel lines between the flow elements */}
      <g stroke="var(--color-ink)" strokeWidth="0.9" fill="none">
        {/* source → birth valve */}
        <line x1="18" y1="46" x2="30" y2="46" />
        <line x1="18" y1="50" x2="30" y2="50" />
        {/* birth valve → stock */}
        <line x1="38" y1="46" x2="48" y2="46" />
        <line x1="38" y1="50" x2="48" y2="50" />
        {/* stock → death valve */}
        <line x1="78" y1="46" x2="88" y2="46" />
        <line x1="78" y1="50" x2="88" y2="50" />
        {/* death valve → sink */}
        <line x1="96" y1="46" x2="106" y2="46" />
        <line x1="96" y1="50" x2="106" y2="50" />
      </g>

      {/* Birth-rate valve (butterfly) */}
      <g stroke="var(--color-ink)" strokeWidth="0.9" fill="var(--color-surface)">
        <polygon points="30,42 30,54 34,48" />
        <polygon points="38,42 38,54 34,48" />
        <circle cx="34" cy="48" r="1.6" />
      </g>

      {/* Stock rectangle */}
      <rect
        x="48"
        y="40"
        width="30"
        height="16"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1.1"
      />

      {/* Death-rate valve (butterfly) */}
      <g stroke="var(--color-ink)" strokeWidth="0.9" fill="var(--color-surface)">
        <polygon points="88,42 88,54 92,48" />
        <polygon points="96,42 96,54 92,48" />
        <circle cx="92" cy="48" r="1.6" />
      </g>

      {/* Sink cloud (right) */}
      <g stroke="var(--color-ink)" strokeWidth="0.9" fill="var(--color-surface)">
        <circle cx="106" cy="48" r="3.2" />
        <circle cx="110" cy="44" r="3.2" />
        <circle cx="113" cy="48" r="3.2" />
        <circle cx="109" cy="51" r="3.2" />
      </g>

      {/* Auxiliary (Birth fraction) circle + dashed info arrow to birth valve */}
      <circle
        cx="34"
        cy="20"
        r="5"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
      />
      <path
        d="M 34,25 Q 32,36 34,42"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.7"
        strokeDasharray="1.6 1.6"
        markerEnd="url(#sfd-thumb-info)"
      />

      {/* Auxiliary (Life expectancy) circle + dashed info arrow to death valve */}
      <circle
        cx="92"
        cy="20"
        r="5"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
      />
      <path
        d="M 92,25 Q 94,36 92,42"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.7"
        strokeDasharray="1.6 1.6"
        markerEnd="url(#sfd-thumb-info)"
      />
    </svg>
  );
}
