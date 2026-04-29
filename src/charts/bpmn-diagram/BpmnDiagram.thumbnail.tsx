// BPMN silhouette: pool border, start circle, rounded activity, diamond
// gateway, double intermediate circle, thick end circle, simple flows.

export function BpmnDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Pool border */}
      <rect
        x={4}
        y={12}
        width={112}
        height={56}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Pool header strip */}
      <line
        x1={12}
        y1={12}
        x2={12}
        y2={68}
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Sequence flows */}
      <line x1={22} y1={40} x2={30} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={48} y1={40} x2={56} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      {/* gateway → top branch (activity) */}
      <path d="M 70 40 L 74 40 L 74 26 L 80 26" fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* gateway → bottom branch (intermediate event) */}
      <path d="M 70 40 L 74 40 L 74 54 L 80 54" fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* merge back */}
      <line x1={96} y1={26} x2={102} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={96} y1={54} x2={102} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={102} y1={40} x2={108} y2={40} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Start (thin circle) */}
      <circle cx={18} cy={40} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Activity (rounded rect) */}
      <rect x={30} y={35} width={18} height={10} rx={2.5} ry={2.5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Gateway (diamond with ×) */}
      <polygon points="63,40 70,33 77,40 70,47" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <text x={70} y={43} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--color-ink)">×</text>
      {/* Top branch activity */}
      <rect x={80} y={21} width={16} height={10} rx={2.5} ry={2.5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Bottom branch intermediate event (double circle) */}
      <circle cx={86} cy={54} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <circle cx={86} cy={54} r={2.3} fill="none" stroke="var(--color-ink)" strokeWidth={0.8} />
      {/* End (thick circle) */}
      <circle cx={112} cy={40} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={2} />
    </svg>
  );
}
