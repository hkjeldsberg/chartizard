export function PunnettSquareThumbnail() {
  // 2×2 grid silhouette. Three of the four cells are shaded dark (dominant
  // phenotype — AA + two Aa) and one is light (recessive — aa). The 3:1
  // phenotypic ratio reads at a glance.
  const originX = 36;
  const originY = 12;
  const cell = 28;

  const cells: Array<{ r: number; c: number; dominant: boolean; label: string }> = [
    { r: 0, c: 0, dominant: true, label: "AA" },
    { r: 0, c: 1, dominant: true, label: "Aa" },
    { r: 1, c: 0, dominant: true, label: "Aa" },
    { r: 1, c: 1, dominant: false, label: "aa" },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Parent-1 gametes along the top */}
      {["A", "a"].map((g, i) => (
        <text
          key={`col-${i}`}
          x={originX + i * cell + cell / 2}
          y={originY - 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="8"
          fill="var(--color-ink-mute)"
        >
          {g}
        </text>
      ))}
      {/* Parent-2 gametes down the left */}
      {["A", "a"].map((g, i) => (
        <text
          key={`row-${i}`}
          x={originX - 4}
          y={originY + i * cell + cell / 2}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize="8"
          fill="var(--color-ink-mute)"
        >
          {g}
        </text>
      ))}
      {/* Cells */}
      {cells.map((c, i) => {
        const x = originX + c.c * cell;
        const y = originY + c.r * cell;
        const fill = c.dominant ? "rgba(26,22,20,0.62)" : "rgba(26,22,20,0.10)";
        const textFill = c.dominant ? "var(--color-page)" : "var(--color-ink)";
        return (
          <g key={i}>
            <rect
              x={x + 0.5}
              y={y + 0.5}
              width={cell - 1}
              height={cell - 1}
              fill={fill}
              stroke="var(--color-ink)"
              strokeWidth="1"
            />
            <text
              x={x + cell / 2}
              y={y + cell / 2 + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize="8.5"
              fill={textFill}
            >
              {c.label}
            </text>
          </g>
        );
      })}
      {/* Ratio caption */}
      <text
        x={originX + cell}
        y={originY + 2 * cell + 9}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink-mute)"
      >
        3 : 1
      </text>
    </svg>
  );
}
