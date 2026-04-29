export function PhaseSpacePlotThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="10" y1="72" x2="114" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="10" y1="6" x2="10" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />
      {/* Zero line (horizontal) */}
      <line x1="10" y1="40" x2="114" y2="40" stroke="var(--color-hairline)" strokeWidth="0.6" />

      {/* Libration orbits — nested ellipses centred at (62, 40) */}
      <ellipse cx="62" cy="40" rx="8" ry="6" fill="none" stroke="var(--color-ink)" strokeWidth="0.9" strokeOpacity="0.5" />
      <ellipse cx="62" cy="40" rx="16" ry="11" fill="none" stroke="var(--color-ink)" strokeWidth="0.9" strokeOpacity="0.6" />
      <ellipse cx="62" cy="40" rx="25" ry="16" fill="none" stroke="var(--color-ink)" strokeWidth="1" strokeOpacity="0.7" />
      <ellipse cx="62" cy="40" rx="35" ry="20" fill="none" stroke="var(--color-ink)" strokeWidth="1" strokeOpacity="0.75" />

      {/* Separatrix (figure-8 / homoclinic orbit) — approximated as two arcs */}
      {/* Upper separatrix */}
      <path
        d="M10,40 Q20,62 62,26 Q104,62 114,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.3"
        strokeDasharray="4 2.5"
      />
      {/* Lower separatrix */}
      <path
        d="M10,40 Q20,18 62,54 Q104,18 114,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.3"
        strokeDasharray="4 2.5"
      />

      {/* Rotational orbits (above and below separatrix) */}
      <path
        d="M10,18 Q62,8 114,18"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />
      <path
        d="M10,62 Q62,72 114,62"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />

      {/* Stable fixed point (centre) */}
      <circle cx="62" cy="40" r="2.5" fill="var(--color-ink)" />

      {/* Saddle points at ±π (left and right edges) */}
      <circle cx="10" cy="40" r="2" fill="none" stroke="var(--color-ink)" strokeWidth="0.9" />
      <circle cx="114" cy="40" r="2" fill="none" stroke="var(--color-ink)" strokeWidth="0.9" />

      {/* Axis labels */}
      <text x="112" y="78" fontFamily="monospace" fontSize="6" fill="var(--color-ink-mute)" textAnchor="end">θ</text>
      <text x="6" y="9" fontFamily="monospace" fontSize="6" fill="var(--color-ink-mute)" textAnchor="middle">θ̇</text>
    </svg>
  );
}
