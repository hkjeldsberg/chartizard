export function PipingInstrumentationDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Process lines (thick solid) — tank -> pump -> CV -> HX -> back to tank */}
      {/* tank outlet down */}
      <line x1={20} y1={40} x2={20} y2={62} stroke="var(--color-ink)" strokeWidth={2} />
      {/* across to pump */}
      <line x1={20} y1={62} x2={38} y2={62} stroke="var(--color-ink)" strokeWidth={2} />
      {/* pump -> CV */}
      <line x1={46} y1={62} x2={62} y2={62} stroke="var(--color-ink)" strokeWidth={2} />
      {/* CV -> HX */}
      <line x1={74} y1={62} x2={88} y2={62} stroke="var(--color-ink)" strokeWidth={2} />
      {/* HX up, across top, down to tank top (return) */}
      <line x1={98} y1={62} x2={98} y2={12} stroke="var(--color-ink)" strokeWidth={2} />
      <line x1={98} y1={12} x2={20} y2={12} stroke="var(--color-ink)" strokeWidth={2} />
      <line x1={20} y1={12} x2={20} y2={24} stroke="var(--color-ink)" strokeWidth={2} />

      {/* Tank T-101 */}
      <path
        d="M 10 24 Q 20 20 30 24 L 30 40 L 10 40 Z"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Pump P-101 — circle with triangle */}
      <circle cx={42} cy={62} r={4} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <polygon points="40,60 45,62 40,64" fill="var(--color-ink)" />

      {/* Control valve CV-101 — hourglass (two triangles) */}
      <polygon points="64,58 72,66 72,58 64,66" fill="var(--color-ink)" />
      <line x1={68} y1={62} x2={68} y2={54} stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={65} y={50} width={6} height={4} fill="none" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Heat exchanger HX-101 — circle with zigzags */}
      <circle cx={93} cy={62} r={5} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <path d="M 89 60 L 91 58 L 93 60 L 95 58 L 97 60" fill="none" stroke="var(--color-ink)" strokeWidth={0.9} />
      <path d="M 89 64 L 91 66 L 93 64 L 95 66 L 97 64" fill="none" stroke="var(--color-ink)" strokeWidth={0.9} />

      {/* Instrument bubbles */}
      {/* FT-101 on pump discharge */}
      <circle cx={54} cy={50} r={5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={54} y1={55} x2={54} y2={62} stroke="var(--color-ink)" strokeWidth={0.8} />
      {/* FIC-101 — double concentric */}
      <circle cx={72} cy={30} r={7} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.1} />
      <circle cx={72} cy={30} r={5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Signal lines (dashed) */}
      <line x1={54} y1={45} x2={66} y2={30} stroke="var(--color-ink-mute)" strokeWidth={0.9} strokeDasharray="2 2" />
      <line x1={72} y1={37} x2={68} y2={50} stroke="var(--color-ink-mute)" strokeWidth={0.9} strokeDasharray="2 2" />
    </svg>
  );
}
