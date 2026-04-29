export function PedigreeThumbnail() {
  // Miniature 2-generation pedigree: carrier × carrier → 4 children.
  // Gen I at y≈24; Gen II at y≈60.
  // Half-filled (carrier) glyphs rendered without clipPaths: right-half rect overlaid.

  // Helper: half-filled square (carrier male).
  function CarrierSquare({ x, y, s }: { x: number; y: number; s: number }) {
    return (
      <>
        <rect x={x} y={y} width={s} height={s} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="1.2" />
        <rect x={x + s / 2} y={y} width={s / 2} height={s} fill="var(--color-ink)" />
        <rect x={x} y={y} width={s} height={s} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      </>
    );
  }

  // Half-filled circle (carrier female) — right half using a path.
  function CarrierCircle({ cx, cy, r }: { cx: number; cy: number; r: number }) {
    // Right half of circle: arc from top to bottom on the right side.
    const d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`;
    return (
      <>
        <circle cx={cx} cy={cy} r={r} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="1.2" />
        <path d={d} fill="var(--color-ink)" stroke="none" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* ── Generation I ── */}

      {/* I-1: carrier male (half-filled square) */}
      <CarrierSquare x={23} y={17} s={14} />

      {/* mate line */}
      <line x1="37" y1="24" x2="69" y2="24" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* I-2: carrier female (half-filled circle) */}
      <CarrierCircle cx={76} cy={24} r={7} />

      {/* drop line from mate-line midpoint */}
      <line x1="53" y1="24" x2="53" y2="44" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* sibship line */}
      <line x1="20" y1="44" x2="95" y2="44" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* vertical drops */}
      <line x1="20" y1="44" x2="20" y2="53" stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1="45" y1="44" x2="45" y2="53" stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1="70" y1="44" x2="70" y2="53" stroke="var(--color-ink)" strokeWidth="1.2" />
      <line x1="95" y1="44" x2="95" y2="53" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* ── Generation II ── */}

      {/* II-1: unaffected male (open square) */}
      <rect x="14" y="53" width="12" height="12" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* II-2: carrier female */}
      <CarrierCircle cx={45} cy={59} r={6} />

      {/* II-3: carrier male */}
      <CarrierSquare x={64} y={53} s={12} />

      {/* II-4: affected female (filled circle) */}
      <circle cx="95" cy="59" r="6" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* Generation labels */}
      <text x="6" y="27" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)" textAnchor="middle">I</text>
      <text x="6" y="62" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)" textAnchor="middle">II</text>
    </svg>
  );
}
