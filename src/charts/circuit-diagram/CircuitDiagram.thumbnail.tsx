export function CircuitDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Vcc rail */}
      <line x1={20} y1={10} x2={100} y2={10} stroke="var(--color-ink)" strokeWidth={1.4} />
      {/* GND rail */}
      <line x1={14} y1={72} x2={106} y2={72} stroke="var(--color-ink)" strokeWidth={1.4} />
      {/* GND symbol */}
      <line x1={60} y1={72} x2={60} y2={75} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={55} y1={75} x2={65} y2={75} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={57} y1={77} x2={63} y2={77} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={59} y1={79} x2={61} y2={79} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Left-side resistor (R1, zigzag) from Vcc down to base node */}
      <line x1={36} y1={10} x2={36} y2={20} stroke="var(--color-ink)" strokeWidth={1.1} />
      <path
        d="M 36 20 L 40 23 L 32 26 L 40 29 L 32 32 L 40 35 L 36 38"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        fill="none"
      />
      <line x1={36} y1={38} x2={36} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* R2 (base to GND) */}
      <path
        d="M 36 48 L 40 51 L 32 54 L 40 57 L 32 60 L 40 63 L 36 66"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        fill="none"
      />
      <line x1={36} y1={66} x2={36} y2={72} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Rc (Vcc to collector) */}
      <line x1={70} y1={10} x2={70} y2={20} stroke="var(--color-ink)" strokeWidth={1.1} />
      <path
        d="M 70 20 L 74 22.5 L 66 25 L 74 27.5 L 66 30 L 74 32.5 L 70 35"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        fill="none"
      />
      <line x1={70} y1={35} x2={70} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Base wire from R1/R2 node to transistor */}
      <line x1={36} y1={44} x2={58} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* Junction dot on the base node */}
      <circle cx={36} cy={44} r={1.6} fill="var(--color-ink)" />

      {/* Transistor Q1 (NPN) */}
      <circle cx={66} cy={44} r={8} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      {/* internal base bar */}
      <line x1={62} y1={40} x2={62} y2={48} stroke="var(--color-ink)" strokeWidth={1.5} />
      {/* collector lead inside */}
      <line x1={62} y1={40} x2={70} y2={36} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* emitter lead inside */}
      <line x1={62} y1={48} x2={70} y2={52} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* emitter arrowhead pointing outward (NPN) */}
      <polygon points="70,52 67.5,50 67,53" fill="var(--color-ink)" />

      {/* Collector exit up to Rc bottom */}
      <line x1={70} y1={36} x2={70} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* Emitter exit down to GND */}
      <line x1={70} y1={52} x2={70} y2={72} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Cin — two parallel plates on the input lead */}
      <line x1={14} y1={44} x2={18} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={18} y1={39} x2={18} y2={49} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={21} y1={39} x2={21} y2={49} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={21} y1={44} x2={36} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />
    </svg>
  );
}
