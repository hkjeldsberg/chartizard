export function JablonskiThumbnail() {
  // Jabłoński silhouette: three stacked horizontal lines for the electronic
  // singlet states (S0, S1, S2) with a single triplet band (T1) offset to the
  // right. A few vertical arrows hint at the photophysical processes —
  // absorption going up, fluorescence going down.
  const leftX0 = 14;
  const leftX1 = 66;
  const rightX0 = 76;
  const rightX1 = 106;

  const yS0 = 66;
  const yS1 = 42;
  const yS2 = 20;
  const yT1 = 50;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Energy axis */}
      <line x1="6" y1="72" x2="6" y2="12" stroke="var(--color-hairline)" />
      <polygon points="6,10 3.5,16 8.5,16" fill="var(--color-hairline)" />

      {/* Electronic state lines (singlets on left) */}
      <line x1={leftX0} y1={yS0} x2={leftX1} y2={yS0} stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1={leftX0} y1={yS1} x2={leftX1} y2={yS1} stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1={leftX0} y1={yS2} x2={leftX1} y2={yS2} stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Triplet on the right */}
      <line x1={rightX0} y1={yT1} x2={rightX1} y2={yT1} stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Vibrational sub-levels on S1 (two thin lines above) */}
      <line x1={leftX0 + 4} y1={yS1 - 4} x2={leftX1 - 4} y2={yS1 - 4} stroke="var(--color-hairline)" strokeWidth="0.9" />
      <line x1={leftX0 + 4} y1={yS1 - 8} x2={leftX1 - 4} y2={yS1 - 8} stroke="var(--color-hairline)" strokeWidth="0.9" />

      {/* Absorption arrow (upward) — S0 -> S2 */}
      <line x1="26" y1={yS0} x2="26" y2={yS2 + 2} stroke="var(--color-ink)" strokeWidth="1.2" />
      <polygon points="26,18 23,23 29,23" fill="var(--color-ink)" />

      {/* Fluorescence (downward) — S1 -> S0 */}
      <line x1="46" y1={yS1} x2="46" y2={yS0 - 2} stroke="var(--color-ink-mute)" strokeWidth="1.2" />
      <polygon points="46,66 43,61 49,61" fill="var(--color-ink-mute)" />

      {/* Phosphorescence (downward on the right, dashed) — T1 -> S0 */}
      <line x1="90" y1={yT1} x2="90" y2={yS0 - 2} stroke="var(--color-ink-mute)" strokeWidth="1.2" strokeDasharray="3 2" />
      <polygon points="90,66 87,61 93,61" fill="var(--color-ink-mute)" />

      {/* State labels */}
      <text x={leftX0 - 3} y={yS0 + 2} textAnchor="end" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)">S₀</text>
      <text x={leftX0 - 3} y={yS1 + 2} textAnchor="end" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)">S₁</text>
      <text x={leftX0 - 3} y={yS2 + 2} textAnchor="end" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)">S₂</text>
      <text x={rightX1 + 2} y={yT1 + 2} fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)">T₁</text>
    </svg>
  );
}
