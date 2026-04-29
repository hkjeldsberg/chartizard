// Nolan silhouette: a rotated square (diamond) with a horizontal and
// a vertical cross-line through the centre, plus a few plotted dots.
// Meant to read as "2-axis ideology map" at a glance.

export function NolanThumbnail() {
  // Diamond corners.
  const top = { x: 60, y: 10 };
  const right = { x: 104, y: 40 };
  const bottom = { x: 60, y: 70 };
  const left = { x: 16, y: 40 };
  const origin = { x: 60, y: 40 };

  const path = `M${top.x} ${top.y} L${right.x} ${right.y} L${bottom.x} ${bottom.y} L${left.x} ${left.y} Z`;

  // Illustrative points — one per corner plus a centrist dot.
  const dots: { x: number; y: number; r: number }[] = [
    { x: 60, y: 18, r: 1.8 }, // libertarian
    { x: 96, y: 46, r: 1.8 }, // conservative
    { x: 60, y: 62, r: 1.8 }, // statist
    { x: 24, y: 46, r: 1.8 }, // progressive
    { x: 60, y: 40, r: 2.2 }, // centrist
    { x: 44, y: 52, r: 1.6 }, // populist
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Diamond */}
      <path d={path} fill="var(--color-hairline)" opacity={0.5} stroke="var(--color-ink)" strokeWidth={1.2} />
      {/* Cross-axes */}
      <line x1={left.x} y1={origin.y} x2={right.x} y2={origin.y} stroke="var(--color-ink)" strokeOpacity={0.35} strokeDasharray="2 3" strokeWidth={0.8} />
      <line x1={origin.x} y1={top.y} x2={origin.x} y2={bottom.y} stroke="var(--color-ink)" strokeOpacity={0.35} strokeDasharray="2 3" strokeWidth={0.8} />
      {/* Traditional left-right diagonal */}
      <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="var(--color-ink)" strokeOpacity={0.25} strokeDasharray="1 2" strokeWidth={0.8} />
      {/* Dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
