export function UmlActivityDiagramThumbnail() {
  // Silhouette: initial dot → action → fork bar → two parallel actions
  // → join bar → final bullseye. No labels — the shapes carry the family.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Initial filled circle */}
      <circle cx={60} cy={8} r={2.6} fill="var(--color-ink)" />
      <line x1={60} y1={10.6} x2={60} y2={16} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,18 58,15 62,15" fill="var(--color-ink)" />

      {/* Action rounded-rectangle */}
      <rect
        x={44}
        y={18}
        width={32}
        height={10}
        rx={4}
        ry={4}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Edge into fork bar */}
      <line x1={60} y1={28} x2={60} y2={32} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Fork bar — thick black horizontal rectangle */}
      <rect x={26} y={33} width={68} height={3.4} fill="var(--color-ink)" />

      {/* Branches down to two parallel actions */}
      <line x1={40} y1={36.4} x2={40} y2={44} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={80} y1={36.4} x2={80} y2={44} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Left parallel action */}
      <rect
        x={26}
        y={44}
        width={28}
        height={10}
        rx={4}
        ry={4}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Right parallel action */}
      <rect
        x={66}
        y={44}
        width={28}
        height={10}
        rx={4}
        ry={4}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Branches down to join bar */}
      <line x1={40} y1={54} x2={40} y2={60} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={80} y1={54} x2={80} y2={60} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Join bar */}
      <rect x={26} y={60} width={68} height={3.4} fill="var(--color-ink)" />

      {/* Edge down to final */}
      <line x1={60} y1={63.4} x2={60} y2={69} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,71 58,68 62,68" fill="var(--color-ink)" />

      {/* Final — bullseye */}
      <circle cx={60} cy={73.5} r={3.8} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <circle cx={60} cy={73.5} r={2} fill="var(--color-ink)" />
    </svg>
  );
}
