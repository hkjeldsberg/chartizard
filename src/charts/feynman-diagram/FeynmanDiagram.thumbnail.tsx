export function FeynmanThumbnail() {
  // Feynman diagram thumbnail: Bhabha scattering e⁻e⁺ → γ* → e⁻e⁺
  // viewBox 120x80
  // Two vertices at x=45 and x=75, vertically centred at y=40
  const v1x = 45;
  const v2x = 75;
  const vy = 40;
  const spacing = 16;

  // Wavy photon path (horizontal, hand-drawn approximation)
  const photonD = [
    `M ${v1x} ${vy}`,
    `Q ${v1x + 5} ${vy - 6} ${v1x + 10} ${vy}`,
    `Q ${v1x + 15} ${vy + 6} ${v1x + 20} ${vy}`,
    `Q ${v1x + 25} ${vy - 6} ${v2x} ${vy}`,
  ].join(" ");

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Incoming electron (top-left to v1) */}
      <line x1="8" y1={vy - spacing} x2={v1x} y2={vy - spacing} stroke="var(--color-ink)" strokeWidth="1.6" />
      {/* Electron arrow (rightward) */}
      <polygon
        points={`${26},${vy - spacing} ${20},${vy - spacing - 2.5} ${20},${vy - spacing + 2.5}`}
        fill="var(--color-ink)"
      />

      {/* Incoming positron (v1 bottom to left) — arrow leftward */}
      <line x1="8" y1={vy + spacing} x2={v1x} y2={vy + spacing} stroke="var(--color-ink)" strokeWidth="1.6" />
      {/* Positron arrow (leftward) */}
      <polygon
        points={`${14},${vy + spacing} ${20},${vy + spacing - 2.5} ${20},${vy + spacing + 2.5}`}
        fill="var(--color-ink)"
      />

      {/* Outgoing electron (v2 to top-right) */}
      <line x1={v2x} y1={vy - spacing} x2="112" y2={vy - spacing} stroke="var(--color-ink)" strokeWidth="1.6" />
      <polygon
        points={`${96},${vy - spacing} ${90},${vy - spacing - 2.5} ${90},${vy - spacing + 2.5}`}
        fill="var(--color-ink)"
      />

      {/* Outgoing positron (v2 to bottom-right) — arrow leftward */}
      <line x1={v2x} y1={vy + spacing} x2="112" y2={vy + spacing} stroke="var(--color-ink)" strokeWidth="1.6" />
      <polygon
        points={`${106},${vy + spacing} ${100},${vy + spacing - 2.5} ${100},${vy + spacing + 2.5}`}
        fill="var(--color-ink)"
        opacity="0.5"
      />

      {/* Photon wavy propagator */}
      <path d={photonD} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />

      {/* Vertex dots */}
      <circle cx={v1x} cy={vy} r="2.5" fill="var(--color-ink)" />
      <circle cx={v2x} cy={vy} r="2.5" fill="var(--color-ink)" />

      {/* γ label */}
      <text x={(v1x + v2x) / 2} y={vy - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)">γ*</text>

      {/* Particle labels */}
      <text x="6" y={vy - spacing - 5} fontFamily="var(--font-mono)" fontSize="6.5" fill="var(--color-ink-mute)">e⁻</text>
      <text x="6" y={vy + spacing + 10} fontFamily="var(--font-mono)" fontSize="6.5" fill="var(--color-ink-mute)">e⁺</text>
    </svg>
  );
}
