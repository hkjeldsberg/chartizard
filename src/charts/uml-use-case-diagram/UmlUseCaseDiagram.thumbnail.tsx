export function UmlUseCaseDiagramThumbnail() {
  // Silhouette: one stick-figure actor outside a system-boundary rectangle
  // that contains three use-case ovals, with association lines from the
  // actor to each oval. No labels — the shape vocabulary carries the family.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* System-boundary rectangle */}
      <rect
        x={34}
        y={10}
        width={78}
        height={60}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Actor stick-figure outside the boundary, on the left */}
      {/* Head */}
      <circle cx={14} cy={26} r={3.4} fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      {/* Torso */}
      <line x1={14} y1={29.4} x2={14} y2={42} stroke="var(--color-ink)" strokeWidth={1.3} />
      {/* Arms */}
      <line x1={8} y1={34} x2={20} y2={34} stroke="var(--color-ink)" strokeWidth={1.3} />
      {/* Legs */}
      <line x1={14} y1={42} x2={9} y2={50} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={14} y1={42} x2={19} y2={50} stroke="var(--color-ink)" strokeWidth={1.3} />

      {/* Three use-case ovals inside the boundary */}
      <ellipse cx={68} cy={24} rx={18} ry={7} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <ellipse cx={86} cy={40} rx={18} ry={7} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <ellipse cx={68} cy={56} rx={18} ry={7} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />

      {/* Association lines from actor to each oval */}
      <line x1={20} y1={34} x2={51} y2={26} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={20} y1={34} x2={69} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={20} y1={34} x2={51} y2={55} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Dashed «include» arrow between the two left-aligned ovals */}
      <line
        x1={68}
        y1={31}
        x2={68}
        y2={49}
        stroke="var(--color-ink)"
        strokeWidth={1}
        strokeDasharray="3 2.5"
      />
      <polyline
        points="65,47 68,50 71,47"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
    </svg>
  );
}
