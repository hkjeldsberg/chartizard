export function KaryotypeThumbnail() {
  // Miniature karyotype: two rows of chromosome bars with G-banding.
  // Row 1: 6 pairs (representing chrs 1–6, large to medium).
  // Row 2: 6 pairs (representing chrs 17–22 + XY, small).
  // Each pair = two narrow vertical bars with alternating dark/light bands.

  // Row 1 data: [relHeight, nDarkBands, centroFrac]
  const row1: ReadonlyArray<[number, number, number]> = [
    [28, 3, 0.42],
    [26, 3, 0.36],
    [22, 2, 0.44],
    [21, 2, 0.34],
    [20, 2, 0.34],
    [18, 2, 0.36],
  ];

  // Row 2 data (smaller chromosomes).
  const row2: ReadonlyArray<[number, number, number]> = [
    [13, 2, 0.32],
    [12, 2, 0.44],
    [10, 2, 0.44],
    [8, 1, 0.22],
    [18, 2, 0.40], // X
    [10, 1, 0.28], // Y
  ];

  const barW = 5;
  const pairGap = 2;
  const pairSpacing = 15;
  const baselineY1 = 36; // baseline for row 1
  const baselineY2 = 70; // baseline for row 2

  function PairBars(
    pairs: ReadonlyArray<[number, number, number]>,
    startX: number,
    baseY: number,
    sexPairIdx?: number,
  ) {
    return pairs.map(([h, nDark, centroFrac], pi) => {
      const px = startX + pi * pairSpacing;
      const topY = baseY - h;
      const centroY = topY + h * centroFrac;
      const bandH = h / (nDark * 2);
      const isSex = pi === sexPairIdx;

      return (
        <g key={pi}>
          {/* Two copies side by side */}
          {[px, px + barW + pairGap].map((bx, ci) => (
            <g key={ci}>
              {/* Bands */}
              {Array.from({ length: nDark * 2 }).map((_, bi) => {
                const by = topY + bi * bandH;
                const isDark = bi % 2 === 0;
                // Skip centromere zone.
                const cTop = centroY - 1.5;
                const cBot = centroY + 1.5;
                const bBot = by + bandH;
                if (bBot <= cTop || by >= cBot) {
                  return (
                    <rect
                      key={bi}
                      x={bx}
                      y={by}
                      width={barW}
                      height={bandH}
                      fill={
                        isDark
                          ? isSex
                            ? "var(--color-ink)"
                            : "var(--color-ink-soft)"
                          : "var(--color-surface)"
                      }
                    />
                  );
                }
                return null;
              })}
              {/* Outline */}
              <rect
                x={bx}
                y={topY}
                width={barW}
                height={h}
                rx={barW / 2}
                ry={barW / 2}
                fill="none"
                stroke={isSex ? "var(--color-ink)" : "var(--color-ink-mute)"}
                strokeWidth={isSex ? 1.0 : 0.6}
              />
            </g>
          ))}
        </g>
      );
    });
  }

  const row1StartX = 6;
  const row2StartX = 6;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Row 1 */}
      {PairBars(row1, row1StartX, baselineY1)}

      {/* Row 2 — last pair = XY (sex chromosome, index 4–5) */}
      {PairBars(row2, row2StartX, baselineY2, 4)}

      {/* 46,XY label */}
      <text
        x="117"
        y="8"
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fontWeight="500"
        fill="var(--color-ink-soft)"
      >
        46,XY
      </text>
    </svg>
  );
}
