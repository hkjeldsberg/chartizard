export function IshikawaThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Central spine */}
      <line x1={8} y1={40} x2={96} y2={40} stroke="var(--color-ink)" strokeWidth="1.6" />
      {/* Arrowhead pointing at problem */}
      <polygon points="96,37 103,40 96,43" fill="var(--color-ink)" />

      {/* Problem box */}
      <rect x={102} y={32} width={14} height={16} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* Tail */}
      <line x1={8} y1={36} x2={8} y2={44} stroke="var(--color-ink)" />

      {/* Top bones (3) — slant up-left from spine */}
      <line x1={24} y1={40} x2={18} y2={18} stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1={48} y1={40} x2={42} y2={18} stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1={72} y1={40} x2={66} y2={18} stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* Bottom bones (3) — slant down-left from spine */}
      <line x1={24} y1={40} x2={18} y2={62} stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1={48} y1={40} x2={42} y2={62} stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1={72} y1={40} x2={66} y2={62} stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* Sub-cause ticks (a couple per bone) */}
      {/* Top-left bone */}
      <line x1={21.5} y1={31} x2={14.5} y2={31} stroke="var(--color-ink-mute)" />
      <line x1={19.5} y1={22} x2={12.5} y2={22} stroke="var(--color-ink-mute)" />
      {/* Top-middle bone */}
      <line x1={45.5} y1={31} x2={38.5} y2={31} stroke="var(--color-ink-mute)" />
      <line x1={43.5} y1={22} x2={36.5} y2={22} stroke="var(--color-ink-mute)" />
      {/* Top-right bone */}
      <line x1={69.5} y1={31} x2={62.5} y2={31} stroke="var(--color-ink-mute)" />
      <line x1={67.5} y1={22} x2={60.5} y2={22} stroke="var(--color-ink-mute)" />
      {/* Bottom-left bone */}
      <line x1={21.5} y1={49} x2={14.5} y2={49} stroke="var(--color-ink-mute)" />
      <line x1={19.5} y1={58} x2={12.5} y2={58} stroke="var(--color-ink-mute)" />
      {/* Bottom-middle bone */}
      <line x1={45.5} y1={49} x2={38.5} y2={49} stroke="var(--color-ink-mute)" />
      <line x1={43.5} y1={58} x2={36.5} y2={58} stroke="var(--color-ink-mute)" />
      {/* Bottom-right bone */}
      <line x1={69.5} y1={49} x2={62.5} y2={49} stroke="var(--color-ink-mute)" />
      <line x1={67.5} y1={58} x2={60.5} y2={58} stroke="var(--color-ink-mute)" />
    </svg>
  );
}
