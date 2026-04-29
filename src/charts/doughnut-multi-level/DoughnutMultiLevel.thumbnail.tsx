export function DoughnutMultiLevelThumbnail() {
  // Two concentric rings with a hole in the middle. Inner ring: 4 top-level
  // categories. Outer ring: each inner wedge subdivided into sub-categories.
  const cx = 60;
  const cy = 40;
  const rOuter = 30;
  const rMid = 21;
  const rInner = 12;

  const inner = [
    { share: 0.6, opacity: 0.95 },
    { share: 0.18, opacity: 0.7 },
    { share: 0.14, opacity: 0.5 },
    { share: 0.08, opacity: 0.32 },
  ];

  // Outer: sub-shares (as fraction of parent) for each inner category.
  const outer: Array<Array<number>> = [
    [0.75, 0.17, 0.08], // Personnel
    [0.67, 0.22, 0.11], // Facilities
    [0.5, 0.29, 0.21], // Operations
    [0.62, 0.38], // R&D
  ];

  function ringPath(
    innerR: number,
    outerR: number,
    startA: number,
    endA: number,
  ): string {
    const x1o = cx + outerR * Math.cos(startA);
    const y1o = cy + outerR * Math.sin(startA);
    const x2o = cx + outerR * Math.cos(endA);
    const y2o = cy + outerR * Math.sin(endA);
    const x1i = cx + innerR * Math.cos(endA);
    const y1i = cy + innerR * Math.sin(endA);
    const x2i = cx + innerR * Math.cos(startA);
    const y2i = cy + innerR * Math.sin(startA);
    const large = endA - startA > Math.PI ? 1 : 0;
    return (
      `M${x1o} ${y1o} ` +
      `A${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o} ` +
      `L${x1i} ${y1i} ` +
      `A${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i} Z`
    );
  }

  let startA = -Math.PI / 2;
  const innerPaths = inner.map((seg, i) => {
    const end = startA + seg.share * Math.PI * 2;
    const d = ringPath(rInner, rMid, startA, end);
    const outerChildren: Array<{ d: string; opacity: number }> = [];
    const childList = outer[i];
    let cumChild = 0;
    for (const childShare of childList) {
      const childStart = startA + cumChild * seg.share * Math.PI * 2;
      const childEnd = startA + (cumChild + childShare) * seg.share * Math.PI * 2;
      cumChild += childShare;
      outerChildren.push({
        d: ringPath(rMid + 0.5, rOuter, childStart, childEnd),
        opacity: seg.opacity * 0.55,
      });
    }
    startA = end;
    return { innerD: d, opacity: seg.opacity, outerChildren };
  });

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {innerPaths.flatMap((p, i) => [
        <path
          key={`in-${i}`}
          d={p.innerD}
          fill="var(--color-ink)"
          opacity={p.opacity}
          stroke="var(--color-page)"
          strokeWidth="0.5"
        />,
        ...p.outerChildren.map((c, j) => (
          <path
            key={`out-${i}-${j}`}
            d={c.d}
            fill="var(--color-ink)"
            opacity={c.opacity}
            stroke="var(--color-page)"
            strokeWidth="0.4"
          />
        )),
      ])}
      {/* Centre KPI */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink)"
        fontWeight="500"
      >
        $24M
      </text>
    </svg>
  );
}
