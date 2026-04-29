// Thumbnail: single chromosome ideogram silhouette — vertical bar with
// alternating G-bands, centromere waist, telomere caps, and gene annotation ticks.
export function IdeogramThumbnail() {
  const barX = 44;
  const barW = 14;
  const barH = 68;
  const topY = 6;
  const capR = barW / 2;

  // Approximate band positions scaled to 68px bar height (chr17 = 83 Mb)
  // centromere at ~24/83 = 0.29 → 20px from top
  const scale = (mb: number) => topY + (mb / 83) * barH;

  const bands = [
    { y0: scale(0),    y1: scale(3.5),  dark: true  },
    { y0: scale(3.5),  y1: scale(6),    dark: false },
    { y0: scale(6),    y1: scale(8.5),  dark: true  },
    { y0: scale(8.5),  y1: scale(14),   dark: false },
    { y0: scale(14),   y1: scale(20),   dark: true  },
    { y0: scale(20),   y1: scale(24),   dark: false },
    // centromere
    { y0: scale(26),   y1: scale(29),   dark: false },
    { y0: scale(29),   y1: scale(32),   dark: true  },
    { y0: scale(32),   y1: scale(35),   dark: false },
    { y0: scale(35),   y1: scale(37.5), dark: true  },
    { y0: scale(37.5), y1: scale(39.5), dark: false },
    { y0: scale(39.5), y1: scale(42),   dark: true  },  // q21.31 (BRCA1)
    { y0: scale(42),   y1: scale(45),   dark: false },
    { y0: scale(45),   y1: scale(48),   dark: false },
    { y0: scale(48),   y1: scale(53),   dark: true  },
    { y0: scale(53),   y1: scale(56),   dark: false },
    { y0: scale(56),   y1: scale(60),   dark: false },
    { y0: scale(60),   y1: scale(74),   dark: true  },
  ];

  const cenY0 = scale(24);
  const cenY1 = scale(26);
  const waistW = barW * 0.6;
  const waistX = barX + (barW - waistW) / 2;

  // Gene annotation positions
  const tp53Y = scale(7.65);
  const brca1Y = scale(41.2);

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Band fills */}
      {bands.map((b, i) => (
        <rect
          key={i}
          x={barX}
          y={b.y0}
          width={barW}
          height={Math.max(0, b.y1 - b.y0)}
          fill="var(--color-ink)"
          fillOpacity={b.dark ? 0.65 : 0.07}
        />
      ))}

      {/* Centromere waist fill */}
      <rect
        x={waistX}
        y={cenY0}
        width={waistW}
        height={cenY1 - cenY0}
        fill="var(--color-ink)"
        fillOpacity={0.85}
      />

      {/* p-arm outline (top) */}
      <path
        d={`M ${barX} ${topY} A ${capR} ${capR} 0 0 1 ${barX + barW} ${topY} L ${barX + barW} ${cenY0} Q ${barX + barW} ${cenY0 + 1} ${waistX + waistW} ${cenY0 + 1} L ${waistX} ${cenY0 + 1} Q ${barX} ${cenY0 + 1} ${barX} ${cenY0} Z`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeOpacity={0.7}
      />

      {/* q-arm outline (bottom) */}
      <path
        d={`M ${waistX} ${cenY1 - 1} L ${waistX + waistW} ${cenY1 - 1} Q ${barX + barW} ${cenY1 - 1} ${barX + barW} ${cenY1} L ${barX + barW} ${topY + barH} A ${capR} ${capR} 0 0 1 ${barX} ${topY + barH} L ${barX} ${cenY1} Q ${barX} ${cenY1 - 1} ${waistX} ${cenY1 - 1} Z`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeOpacity={0.7}
      />

      {/* Top telomere cap fill */}
      <path
        d={`M ${barX} ${topY} A ${capR} ${capR} 0 0 1 ${barX + barW} ${topY}`}
        fill="var(--color-ink)"
        fillOpacity={0.7}
      />

      {/* Bottom telomere cap fill */}
      <path
        d={`M ${barX} ${topY + barH} A ${capR} ${capR} 0 0 0 ${barX + barW} ${topY + barH}`}
        fill="var(--color-ink)"
        fillOpacity={0.7}
      />

      {/* Gene ticks — TP53 and BRCA1 */}
      <line x1={barX + barW} y1={tp53Y}  x2={barX + barW + 8} y2={tp53Y}  stroke="var(--color-ink)" strokeWidth={0.9} strokeOpacity={0.8} />
      <text x={barX + barW + 10} y={tp53Y} dominantBaseline="middle" fontSize="5" fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">TP53</text>

      <line x1={barX + barW} y1={brca1Y} x2={barX + barW + 8} y2={brca1Y} stroke="var(--color-ink)" strokeWidth={0.9} strokeOpacity={0.8} />
      <text x={barX + barW + 10} y={brca1Y} dominantBaseline="middle" fontSize="5" fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">BRCA1</text>

      {/* Chromosome label */}
      <text x={barX + barW / 2} y="3" textAnchor="middle" fontSize="5" fontFamily="var(--font-mono)" fill="var(--color-ink-mute)">17</text>
    </svg>
  );
}
