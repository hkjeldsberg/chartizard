export function PughThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* 5 cols × 4 rows grid. Col 1 is the criterion column. */}
      {/* Header strip */}
      <rect x={10} y={10} width={100} height={12} fill="none" stroke="var(--color-hairline)" />

      {/* Row dividers */}
      {[22, 34, 46, 58, 70].map((y) => (
        <line key={y} x1={10} x2={110} y1={y} y2={y} stroke="var(--color-hairline)" />
      ))}

      {/* Vertical dividers: criterion col (wide), then 4 alt cols */}
      {[10, 34, 53, 72, 91, 110].map((x, i) => (
        <line key={i} x1={x} x2={x} y1={10} y2={70} stroke="var(--color-hairline)" />
      ))}

      {/* Tinted cells: plus (green) and minus (warm) */}
      <rect x={53} y={22} width={19} height={12} fill="rgba(74,106,104,0.28)" />
      <rect x={72} y={34} width={19} height={12} fill="rgba(165,90,74,0.25)" />
      <rect x={91} y={22} width={19} height={12} fill="rgba(74,106,104,0.28)" />
      <rect x={72} y={46} width={19} height={12} fill="rgba(165,90,74,0.25)" />
      <rect x={91} y={46} width={19} height={12} fill="rgba(74,106,104,0.28)" />

      {/* Plus / minus / zero glyphs (tiny) */}
      {/* Row 1 (y=22-34) */}
      <text x={43} y={31} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink-soft)">0</text>
      <text x={62} y={31} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">+</text>
      <text x={81} y={31} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">0</text>
      <text x={100} y={31} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">+</text>

      {/* Row 2 (y=34-46) */}
      <text x={43} y={43} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink-soft)">0</text>
      <text x={62} y={43} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">0</text>
      <text x={81} y={43} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">-</text>
      <text x={100} y={43} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">0</text>

      {/* Row 3 (y=46-58) — bottom total row shaded */}
      <text x={43} y={55} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink-soft)">0</text>
      <text x={62} y={55} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">0</text>
      <text x={81} y={55} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">-</text>
      <text x={100} y={55} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">+</text>

      {/* Weighted total row */}
      <rect x={10} y={58} width={100} height={12} fill="none" stroke="var(--color-ink-mute)" strokeWidth="0.8" />
      <text x={22} y={67} fontSize="7" fontFamily="var(--font-mono)" fill="var(--color-ink)">Σ</text>
      <text x={43} y={67} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">0</text>
      <text x={62} y={67} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">+3</text>
      <text x={81} y={67} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">-2</text>
      <text x={100} y={67} fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">+4</text>

      {/* Header glyph placeholders */}
      <text x={22} y={19} fontSize="6" fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">CRIT</text>
      <text x={43} y={19} fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)" fontWeight="600">BL</text>
      <text x={62} y={19} fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">A</text>
      <text x={81} y={19} fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">B</text>
      <text x={100} y={19} fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-ink)">C</text>
    </svg>
  );
}
