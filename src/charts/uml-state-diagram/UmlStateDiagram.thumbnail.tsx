export function UmlStateDiagramThumbnail() {
  // Silhouette: initial dot → rounded-rect state → transition → composite
  // boundary containing two sub-states → final bullseye. The composite is the
  // Harel innovation and must be visible at thumbnail scale.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Initial filled dot + arrow into first state */}
      <circle cx={6} cy={16} r={2.4} fill="var(--color-ink)" />
      <line x1={8.4} y1={16} x2={16} y2={16} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="18,16 15,14 15,18" fill="var(--color-ink)" />

      {/* Simple state (rounded-rect) */}
      <rect
        x={18}
        y={10}
        width={26}
        height={12}
        rx={5}
        ry={5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Self-loop arc on the simple state */}
      <path
        d="M 22 10 Q 31 1 40 10"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <polygon points="40,10 37,8 40,13" fill="var(--color-ink)" />

      {/* Transition right */}
      <line x1={44} y1={16} x2={56} y2={16} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="58,16 55,14 55,18" fill="var(--color-ink)" />

      {/* Another simple state (top-right) */}
      <rect
        x={58}
        y={10}
        width={26}
        height={12}
        rx={5}
        ry={5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Edge down into composite */}
      <line x1={71} y1={22} x2={71} y2={32} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="71,34 69,31 73,31" fill="var(--color-ink)" />

      {/* Composite-state boundary — larger rounded rectangle holding two sub-states */}
      <rect
        x={6}
        y={36}
        width={108}
        height={34}
        rx={9}
        ry={9}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Composite's name tab at top-left of its boundary */}
      <rect
        x={10}
        y={32}
        width={30}
        height={8}
        rx={3}
        ry={3}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={0.9}
      />

      {/* Sub-state 1 inside composite */}
      <rect
        x={14}
        y={48}
        width={28}
        height={14}
        rx={5}
        ry={5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Sub-state 2 inside composite */}
      <rect
        x={52}
        y={48}
        width={28}
        height={14}
        rx={5}
        ry={5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Transition between sub-states */}
      <line x1={42} y1={55} x2={50} y2={55} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="52,55 49,53 49,57" fill="var(--color-ink)" />

      {/* Final bullseye to the right of the composite */}
      <circle cx={100} cy={55} r={4.5} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <circle cx={100} cy={55} r={2.2} fill="var(--color-ink)" />
      {/* Arrow from composite into final */}
      <line x1={80} y1={55} x2={94} y2={55} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="95.5,55 93,53 93,57" fill="var(--color-ink)" />
    </svg>
  );
}
