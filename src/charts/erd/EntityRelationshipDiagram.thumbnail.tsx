export function EntityRelationshipThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Left entity */}
      <rect
        x={8}
        y={18}
        width={34}
        height={44}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Header fill */}
      <rect x={8} y={18} width={34} height={9} fill="var(--color-ink)" />
      {/* Attribute rows */}
      <line x1={12} y1={34} x2={38} y2={34} stroke="var(--color-hairline)" />
      <line x1={12} y1={42} x2={36} y2={42} stroke="var(--color-hairline)" />
      <line x1={12} y1={50} x2={38} y2={50} stroke="var(--color-hairline)" />
      <line x1={12} y1={58} x2={34} y2={58} stroke="var(--color-hairline)" />

      {/* Right entity */}
      <rect
        x={78}
        y={18}
        width={34}
        height={44}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <rect x={78} y={18} width={34} height={9} fill="var(--color-ink)" />
      <line x1={82} y1={34} x2={108} y2={34} stroke="var(--color-hairline)" />
      <line x1={82} y1={42} x2={106} y2={42} stroke="var(--color-hairline)" />
      <line x1={82} y1={50} x2={108} y2={50} stroke="var(--color-hairline)" />
      <line x1={82} y1={58} x2={104} y2={58} stroke="var(--color-hairline)" />

      {/* Connector line */}
      <line x1={42} y1={40} x2={78} y2={40} stroke="var(--color-ink)" strokeWidth={1.2} />

      {/* Left "one" bar */}
      <line x1={48} y1={36} x2={48} y2={44} stroke="var(--color-ink)" strokeWidth={1.4} />

      {/* Right crow's-foot (zero-or-many: circle + fan) */}
      <circle cx={68} cy={40} r={2.4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={72} y1={40} x2={78} y2={40} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={72} y1={40} x2={78} y2={34} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={72} y1={40} x2={78} y2={46} stroke="var(--color-ink)" strokeWidth={1.2} />
    </svg>
  );
}
