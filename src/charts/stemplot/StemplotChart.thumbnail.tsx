export function StemplotThumbnail() {
  // Five rows, stem | leaves. Leaves shown as tiny rects to read as bars at
  // thumbnail scale. The longest row (modal class) sits in the middle.
  const rows = [
    { stem: 5, count: 3 },
    { stem: 6, count: 6 },
    { stem: 7, count: 10 },
    { stem: 8, count: 7 },
    { stem: 9, count: 4 },
  ];
  const rowHeight = 11;
  const top = 12;
  const stemX = 18;
  const dividerX = 28;
  const leafX0 = 34;
  const leafW = 4;
  const leafGap = 1.6;
  const leafH = 4;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Vertical divider */}
      <line
        x1={dividerX}
        y1={top - 2}
        x2={dividerX}
        y2={top + rows.length * rowHeight - 3}
        stroke="var(--color-hairline)"
      />
      {rows.map((r, i) => {
        const y = top + i * rowHeight;
        return (
          <g key={r.stem}>
            {/* Stem digit */}
            <text
              x={stemX}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="8"
              fill="var(--color-ink)"
            >
              {r.stem}
            </text>
            {/* Leaves as mini rects so the thumbnail reads as a horizontal histogram */}
            {Array.from({ length: r.count }, (_, j) => (
              <rect
                key={j}
                x={leafX0 + j * (leafW + leafGap)}
                y={y - leafH / 2}
                width={leafW}
                height={leafH}
                fill="var(--color-ink)"
                opacity={0.88}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
