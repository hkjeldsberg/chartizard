export function TernaryThumbnail() {
  // Equilateral triangle centred in a 120x80 viewBox, with three internal
  // gridlines (one per family) at 50% and a small cluster of points near
  // the centre.
  const sqrt3Over2 = Math.sqrt(3) / 2;
  // Pick a triangle height that fits: 80 - padding = 60 max height.
  // Triangle height h -> width h / sqrt3Over2. h=60 -> w ~= 69.
  const h = 60;
  const w = h / sqrt3Over2;
  const cx = 60;
  const cy = 44;
  const bottomY = cy + h / 2;
  const topY = cy - h / 2;
  const leftX = cx - w / 2;
  const rightX = cx + w / 2;

  // Barycentric -> thumbnail pixel coords (sand=BL, silt=BR, clay=top).
  const tri = (sand: number, silt: number, clay: number) => {
    const x = silt + clay / 2;
    const y = clay * sqrt3Over2;
    return {
      x: leftX + x * w,
      y: bottomY - y * h,
    };
  };

  // 50% parallels to each edge.
  const aA = tri(0.5, 0, 0.5);
  const aB = tri(0, 0.5, 0.5);
  const bA = tri(0.5, 0.5, 0);
  const bB = tri(0.5, 0, 0.5);
  const cA = tri(0.5, 0.5, 0);
  const cB = tri(0, 0.5, 0.5);

  const points = [
    tri(0.40, 0.40, 0.20),
    tri(0.38, 0.42, 0.20),
    tri(0.42, 0.38, 0.20),
    tri(0.35, 0.40, 0.25),
    tri(0.45, 0.40, 0.15),
    tri(0.72, 0.18, 0.10), // sand outlier
    tri(0.22, 0.26, 0.52), // clay outlier
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <polygon
        points={`${leftX},${bottomY} ${rightX},${bottomY} ${cx},${topY}`}
        fill="var(--color-ink)"
        fillOpacity={0.03}
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* 50% gridlines (3 families) */}
      <line x1={aA.x} y1={aA.y} x2={aB.x} y2={aB.y} stroke="var(--color-hairline)" />
      <line x1={bA.x} y1={bA.y} x2={bB.x} y2={bB.y} stroke="var(--color-hairline)" />
      <line x1={cA.x} y1={cA.y} x2={cB.x} y2={cB.y} stroke="var(--color-hairline)" />
      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.6} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
