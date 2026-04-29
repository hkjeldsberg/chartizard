export function ConfusionMatrixThumbnail() {
  // 3×3 confusion-matrix silhouette: dark diagonal, one darker off-diagonal
  // cell (dog→cat, bottom-left region) to hint at the asymmetric-error story.
  // Opacity matches the live chart's encoding: count / 100.
  const matrix = [
    [0.82, 0.14, 0.04], // True Cat
    [0.22, 0.74, 0.04], // True Dog
    [0.03, 0.06, 0.91], // True Bird
  ];

  const originX = 30;
  const originY = 14;
  const cellW = 24;
  const cellH = 18;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Cells */}
      {matrix.map((row, r) =>
        row.map((v, c) => {
          const opacity = 0.08 + v * 0.82;
          return (
            <rect
              key={`${r}-${c}`}
              x={originX + c * cellW + 0.5}
              y={originY + r * cellH + 0.5}
              width={cellW - 1}
              height={cellH - 1}
              fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
            />
          );
        }),
      )}
      {/* Row labels in the gutter */}
      {["C", "D", "B"].map((lab, i) => (
        <text
          key={`r-${i}`}
          x={originX - 4}
          y={originY + i * cellH + cellH / 2}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize="7"
          fill="var(--color-ink-mute)"
        >
          {lab}
        </text>
      ))}
      {/* Column labels across the top */}
      {["C", "D", "B"].map((lab, i) => (
        <text
          key={`c-${i}`}
          x={originX + i * cellW + cellW / 2}
          y={originY - 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="7"
          fill="var(--color-ink-mute)"
        >
          {lab}
        </text>
      ))}
    </svg>
  );
}
