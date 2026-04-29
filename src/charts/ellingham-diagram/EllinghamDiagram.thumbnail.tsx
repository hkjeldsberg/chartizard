export function EllinghamDiagramThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="14" y1="8" x2="14" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="68" x2="108" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Five rising metal-oxide lines (upward slopes = ΔG° less negative at high T) */}
      {/* Ca — lowest (most stable oxide) */}
      <line x1="14" y1="16" x2="108" y2="42" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.9" />
      {/* Mg */}
      <line x1="14" y1="22" x2="108" y2="48" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.75" />
      {/* Al */}
      <line x1="14" y1="28" x2="108" y2="53" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.62" />
      {/* Fe */}
      <line x1="14" y1="42" x2="108" y2="60" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.5" />
      {/* Cu — highest (least stable) */}
      <line x1="14" y1="52" x2="108" y2="65" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.38" />

      {/* Carbon 2C+O₂→2CO — dashed, NEGATIVE slope (crosses Fe line ~center) */}
      <line x1="14" y1="62" x2="108" y2="30"
        stroke="var(--color-ink)" strokeWidth="1.6"
        strokeDasharray="4 2" strokeOpacity="0.9" />

      {/* Crossing point circle */}
      <circle cx="57" cy="52" r="3" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" strokeOpacity="0.85" />

      {/* Labels */}
      <text x="110" y="43" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink-soft)">Ca</text>
      <text x="110" y="31" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink-soft)">C</text>
    </svg>
  );
}
