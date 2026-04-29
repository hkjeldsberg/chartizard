export function PotentialEnergyDiagramThumbnail() {
  // 120×80 viewBox. Reaction coordinate on x (0..120), energy on y (0..80 inverted).
  // Reactants at y≈42 (0 kJ), TS peak at y≈10 (100 kJ), products at y≈70 (−80 kJ).
  // x: reactants from 0..22, TS peak at 54, products from 82..120.

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="12" y1="8" x2="12" y2="72" stroke="var(--color-hairline)" />
      <line x1="12" y1="72" x2="112" y2="72" stroke="var(--color-hairline)" />

      {/* Uncatalysed pathway — smooth hill shape */}
      <path
        d="M 12,44 L 24,44 C 34,44 40,12 54,12 C 68,12 74,66 84,66 L 112,66"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Catalysed pathway — lower hill, dashed */}
      <path
        d="M 12,44 L 24,44 C 34,44 40,26 54,26 C 68,26 74,66 84,66 L 112,66"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
        strokeDasharray="4 2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Reactants label area */}
      <line x1="12" y1="44" x2="26" y2="44" stroke="var(--color-ink)" strokeWidth="1" opacity="0.4" />
      {/* Products label area */}
      <line x1="86" y1="66" x2="112" y2="66" stroke="var(--color-ink)" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
