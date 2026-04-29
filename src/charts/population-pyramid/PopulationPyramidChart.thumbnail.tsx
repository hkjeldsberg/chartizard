export function PopulationPyramidThumbnail() {
  // Japan-shaped silhouette: narrow base (low birth), wide middle (post-war
  // bulge), heavy top (elderly). Two opposing bar stacks mirrored across a
  // centre axis. Ink for male (left), opacity-reduced ink for female (right)
  // to keep the thumbnail palette ink-only.
  const centre = 60;
  const top = 10;
  const barHeight = 4;
  const gap = 1;

  // Widths (male-left, female-right). Rough Japan profile — narrow at
  // bottom (young), wide 4 rows up (50-54 bulge), slightly wider top (85+
  // female longevity pushes the top-right wider than top-left).
  const rows: Array<[number, number]> = [
    [14, 22], //  85+
    [18, 26], //  80-84
    [22, 28], //  75-79
    [28, 32], //  70-74
    [26, 28], //  65-69
    [24, 24], //  60-64
    [28, 28], //  55-59
    [32, 32], //  50-54  ← widest male
    [30, 30], //  45-49
    [26, 26], //  40-44
    [24, 24], //  35-39
    [22, 22], //  30-34
    [20, 20], //  25-29
    [18, 18], //  20-24
    [16, 16], //  15-19
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Centre axis */}
      <line
        x1={centre}
        x2={centre}
        y1={top - 2}
        y2={top + rows.length * (barHeight + gap)}
        stroke="var(--color-ink)"
        strokeWidth={0.8}
      />
      {rows.map(([mw, fw], i) => {
        const y = top + i * (barHeight + gap);
        return (
          <g key={i}>
            <rect
              x={centre - mw}
              y={y}
              width={mw}
              height={barHeight}
              fill="var(--color-ink)"
            />
            <rect
              x={centre}
              y={y}
              width={fw}
              height={barHeight}
              fill="var(--color-ink)"
              opacity={0.55}
            />
          </g>
        );
      })}
    </svg>
  );
}
