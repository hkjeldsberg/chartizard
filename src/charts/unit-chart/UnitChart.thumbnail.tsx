export function UnitThumbnail() {
  // Four small clusters of person-icon marks — the unit-counting idea at a
  // glance. No axes. Counts are small but the visual bulk ordering matches
  // the live chart (Grand Canyon > Yosemite > Zion > Denali).
  const clusters = [
    { count: 12 }, // stand-in for Grand Canyon
    { count: 8 },  // Yosemite
    { count: 6 },  // Zion
    { count: 4 },  // Denali
  ];
  const iconsPerRow = 3;
  const iconSize = 5;
  const gap = 1.2;
  const colGap = 6;
  const nCols = clusters.length;
  const colW = iconsPerRow * iconSize + (iconsPerRow - 1) * gap;
  const totalW = nCols * colW + (nCols - 1) * colGap;
  const left = (120 - totalW) / 2;
  const bottom = 62;

  function person(x: number, y: number, key: string) {
    return (
      <g key={key} transform={`translate(${x},${y}) scale(${iconSize / 20})`}>
        <circle cx={10} cy={3.5} r={2.3} fill="var(--color-ink)" />
        <path
          d="M10 6 L6 9 L6 14 L8 14 L8 19 L12 19 L12 14 L14 14 L14 9 Z"
          fill="var(--color-ink)"
        />
      </g>
    );
  }

  const nodes: React.ReactNode[] = [];
  clusters.forEach((c, i) => {
    const gx = left + i * (colW + colGap);
    for (let j = 0; j < c.count; j++) {
      const row = Math.floor(j / iconsPerRow);
      const col = j % iconsPerRow;
      const x = gx + col * (iconSize + gap);
      const y = bottom - (row + 1) * (iconSize + gap) + gap;
      nodes.push(person(x, y, `c${i}-${j}`));
    }
  });

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {nodes}
      <line
        x1="10"
        y1="66"
        x2="110"
        y2="66"
        stroke="var(--color-hairline)"
      />
      <text
        x="60"
        y="76"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink-mute)"
      >
        1 = 1
      </text>
    </svg>
  );
}
