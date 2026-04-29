export function TaylorDiagramThumbnail() {
  // Quarter-circle with a few stddev arcs, the reference point on the x-axis,
  // and a scatter of model dots.
  const ox = 18;
  const oy = 66;
  const R = 86;

  const arcPath = (r: number) =>
    `M ${ox + r} ${oy} A ${r} ${r} 0 0 0 ${ox} ${oy - r}`;

  const stddevArcs = [30, 58, 86];
  const refX = ox + 58; // ref at stddev=1
  const refY = oy;

  // A handful of model dots, hand-placed.
  const dots = [
    { x: ox + 56, y: oy - 16 }, // best, near ref
    { x: ox + 62, y: oy - 24 },
    { x: ox + 48, y: oy - 32 },
    { x: ox + 40, y: oy - 44 },
    { x: ox + 30, y: oy - 50 }, // outlier
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* stddev quarter-arcs */}
      {stddevArcs.map((r, i) => (
        <path
          key={i}
          d={arcPath(r)}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={0.8}
        />
      ))}
      {/* axes */}
      <line x1={ox} y1={oy} x2={ox + R} y2={oy} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - R} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
      {/* a couple of correlation rays */}
      {[Math.PI / 6, Math.PI / 3].map((a, i) => (
        <line
          key={i}
          x1={ox}
          y1={oy}
          x2={ox + R * Math.cos(a)}
          y2={oy - R * Math.sin(a)}
          stroke="var(--color-hairline)"
          strokeWidth={0.5}
        />
      ))}
      {/* rms arcs around the reference */}
      {[14, 26].map((r, i) => (
        <path
          key={`rms-${i}`}
          d={`M ${refX - r} ${refY} A ${r} ${r} 0 0 0 ${refX + r * Math.cos(Math.PI - 0.1)} ${refY - r * Math.sin(Math.PI - 0.1)}`}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={0.5}
          strokeDasharray="1 2"
        />
      ))}
      {/* reference point */}
      <rect x={refX - 2.5} y={refY - 2.5} width={5} height={5} fill="var(--color-ink)" />
      {/* model dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.8} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
