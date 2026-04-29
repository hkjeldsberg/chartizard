export function FiniteStateMachineThumbnail() {
  // Three rounded-rect states with directed edges and one self-loop — the
  // recognisable silhouette of an FSM.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Initial-state dot + arrow into left state */}
      <circle cx={10} cy={40} r={2.4} fill="var(--color-ink)" />
      <line x1={12.4} y1={40} x2={22} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="24,40 20,38 20,42" fill="var(--color-ink)" />

      {/* Left state */}
      <rect x={24} y={30} width={28} height={20} rx={7} ry={7} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />

      {/* Right state (accepting — double border) */}
      <rect x={82} y={30} width={28} height={20} rx={7} ry={7} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <rect x={85} y={33} width={22} height={14} rx={5} ry={5} fill="none" stroke="var(--color-ink)" strokeWidth={0.8} />

      {/* Edge left → right */}
      <line x1={52} y1={40} x2={78} y2={40} stroke="var(--color-ink)" strokeWidth={1.1} />
      <polygon points="80,40 76,38 76,42" fill="var(--color-ink)" />

      {/* Self-loop on left state */}
      <path d="M 30 30 Q 38 14 46 30" fill="none" stroke="var(--color-ink)" strokeWidth={1.1} />
      <polygon points="46,30 43,27 48,27" fill="var(--color-ink)" />

      {/* Curved return edge: right → left (below) */}
      <path
        d="M 82 46 Q 68 66 52 46"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />
      <polygon points="52,46 56,44 55,48" fill="var(--color-ink-mute)" />
    </svg>
  );
}
