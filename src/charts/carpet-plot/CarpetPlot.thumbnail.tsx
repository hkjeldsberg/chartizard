export function CarpetPlotThumbnail() {
  // Two families of intersecting curves forming a "carpet" — the
  // signature silhouette. One family solid, one family dashed.
  const x0 = 14;
  const y0 = 10;
  const w = 96;
  const h = 60;

  // Solid family (iso-weight). Four gently bowed curves across the plane.
  const solidCurves: string[] = [];
  for (let k = 0; k < 4; k++) {
    const pts: string[] = [];
    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      const x = x0 + t * w;
      // Bow pattern: each k'th curve sits at a different baseline and
      // bows slightly upward in the middle.
      const baseY = y0 + h * (0.15 + k * 0.2);
      const bow = Math.sin(t * Math.PI) * 3;
      pts.push(`${x.toFixed(1)},${(baseY - bow).toFixed(1)}`);
    }
    solidCurves.push(pts.join(" "));
  }

  // Dashed family (iso-loading). Four curves crossing the solids diagonally.
  const dashedCurves: string[] = [];
  for (let k = 0; k < 4; k++) {
    const pts: string[] = [];
    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      // Each curve tilts left-to-right + gentle bow.
      const x = x0 + t * w;
      const startY = y0 + h * (0.05 + k * 0.25);
      const endY = y0 + h * (0.3 + k * 0.17);
      const y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 2;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    dashedCurves.push(pts.join(" "));
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Frame */}
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
      />
      {/* Iso-weight (solid) */}
      {solidCurves.map((pts, i) => (
        <polyline
          key={`s-${i}`}
          points={pts}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.1}
          strokeOpacity={0.75}
        />
      ))}
      {/* Iso-loading (dashed) */}
      {dashedCurves.map((pts, i) => (
        <polyline
          key={`d-${i}`}
          points={pts}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.1}
          strokeOpacity={0.55}
          strokeDasharray="3 2"
        />
      ))}
      {/* Design point — where the middle curves intersect. */}
      <circle cx={62} cy={40} r={2.6} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <circle cx={62} cy={40} r={0.9} fill="var(--color-ink)" />
    </svg>
  );
}
