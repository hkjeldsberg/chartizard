export function KagiThumbnail() {
  // Stylised Kagi chart: alternating thick (yang) and thin (yin) vertical
  // segments connected by short horizontal right-angle turns. Drawn by hand
  // to capture the visual silhouette at 120×80.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis lines */}
      <line x1="12" y1="70" x2="112" y2="70" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="12" y1="10" x2="12" y2="70" stroke="var(--color-hairline)" strokeWidth="1" />

      {/*
        Kagi path: thick segments = yang, thin segments = yin
        Segments go: yin up → connector → yang up → connector → yin down → connector → yang up
        x positions: 25, 45, 65, 85, 105
      */}

      {/* Segment 1 (yin, thin): x=25, price 55 → 35 (up) */}
      <line x1="25" y1="55" x2="25" y2="30" stroke="var(--color-ink)" strokeWidth="1.1" />

      {/* Connector 1→2: horizontal at y=30 from x=25 to x=45 */}
      <line x1="25" y1="30" x2="45" y2="30" stroke="var(--color-ink)" strokeWidth="1.1" />

      {/* Segment 2 (yang, thick): x=45, price at 30 → 18 (up, broke peak) */}
      <line x1="45" y1="30" x2="45" y2="18" stroke="var(--color-ink)" strokeWidth="2.8" />

      {/* Connector 2→3: horizontal at y=18 from x=45 to x=65 */}
      <line x1="45" y1="18" x2="65" y2="18" stroke="var(--color-ink)" strokeWidth="2.8" />

      {/* Segment 3 (yin, thin): x=65, price 18 → 42 (down reversal, fell below trough) */}
      <line x1="65" y1="18" x2="65" y2="50" stroke="var(--color-ink)" strokeWidth="1.1" />

      {/* Connector 3→4: horizontal at y=50 from x=65 to x=85 */}
      <line x1="65" y1="50" x2="85" y2="50" stroke="var(--color-ink)" strokeWidth="1.1" />

      {/* Segment 4 (yang, thick): x=85, price 50 → 22 (up, new peak) */}
      <line x1="85" y1="50" x2="85" y2="22" stroke="var(--color-ink)" strokeWidth="2.8" />

      {/* Connector 4→5: horizontal at y=22 from x=85 to x=105 */}
      <line x1="85" y1="22" x2="105" y2="22" stroke="var(--color-ink)" strokeWidth="2.8" />

      {/* Segment 5 (yin, thin): x=105, price 22 → 38 (down) */}
      <line x1="105" y1="22" x2="105" y2="42" stroke="var(--color-ink)" strokeWidth="1.1" />

      {/* Subtle "3% reversal" text annotation */}
      <text
        x="60"
        y="67"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="6"
        fill="var(--color-ink-mute)"
        opacity="0.7"
      >
        3% REVERSAL
      </text>
    </svg>
  );
}
