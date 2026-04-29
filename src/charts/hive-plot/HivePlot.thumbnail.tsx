export function HivePlotThumbnail() {
  // Three radial axes at -90°, 30°, 150°. A handful of nodes along each axis,
  // with a few Bezier curves between them through the centre.
  const cx = 60;
  const cy = 40;
  const innerR = 6;
  const outerR = 28;
  const angles = [-90, 30, 150];

  const toRad = (d: number) => (d * Math.PI) / 180;

  // Nodes per axis, parameterised by r in [0,1] along the axis.
  const nodesByAxis: number[][] = [
    [0.25, 0.55, 0.85], // top
    [0.35, 0.7], // lower-right
    [0.3, 0.6, 0.9], // lower-left
  ];

  // Edges: pairs of (axisIdx, nodeIdx).
  const edges: Array<[[number, number], [number, number]]> = [
    [[0, 2], [1, 0]],
    [[0, 0], [2, 2]],
    [[1, 1], [2, 1]],
    [[0, 1], [2, 0]],
    [[1, 0], [2, 2]],
  ];

  const pos = (axisIdx: number, t: number) => {
    const a = toRad(angles[axisIdx]);
    const r = innerR + t * (outerR - innerR);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  };

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      {angles.map((deg, i) => {
        const a = toRad(deg);
        const x1 = cx + Math.cos(a) * innerR;
        const y1 = cy + Math.sin(a) * innerR;
        const x2 = cx + Math.cos(a) * outerR;
        const y2 = cy + Math.sin(a) * outerR;
        return (
          <line
            key={`ax-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
        );
      })}

      {/* Edges as cubic Beziers through the centre */}
      {edges.map(([from, to], i) => {
        const a = pos(from[0], nodesByAxis[from[0]][from[1]]);
        const b = pos(to[0], nodesByAxis[to[0]][to[1]]);
        const c1x = cx + (a.x - cx) * 0.35;
        const c1y = cy + (a.y - cy) * 0.35;
        const c2x = cx + (b.x - cx) * 0.35;
        const c2y = cy + (b.y - cy) * 0.35;
        return (
          <path
            key={`e-${i}`}
            d={`M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.45}
            strokeWidth={0.9}
          />
        );
      })}

      {/* Nodes */}
      {nodesByAxis.map((ts, axisIdx) =>
        ts.map((t, j) => {
          const p = pos(axisIdx, t);
          return (
            <circle
              key={`n-${axisIdx}-${j}`}
              cx={p.x}
              cy={p.y}
              r={1.4}
              fill="var(--color-ink)"
            />
          );
        }),
      )}
    </svg>
  );
}
