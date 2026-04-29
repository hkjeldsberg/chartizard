// Org-chart silhouette — vertical, all rectangles, one dashed dotted-line
// edge, no edge labels. Must read as a top-down hierarchy of boxes at a glance
// and look clearly different from the horizontal mixed-shape decision-tree
// thumbnail.

export function OrganizationalThumbnail() {
  // Row y-positions.
  const rowCEO = 12;
  const rowVP = 40;
  const rowDir = 68;

  // VP columns (x centres) — 4 VPs spread across the canvas.
  const vpX = [20, 50, 80, 104];
  // Director columns — 2-3 per VP.
  const dirGroups: Array<Array<number>> = [
    [12, 28],        // Eng VP → 2 dirs
    [44, 56],        // Product VP → 2 dirs
    [72, 88],        // Sales VP → 2 dirs
    [100, 112],      // Finance VP → 2 dirs
  ];

  const boxW = 18;
  const boxH = 10;

  const box = (cx: number, cy: number, strong = false) => (
    <rect
      x={cx - boxW / 2}
      y={cy - boxH / 2}
      width={boxW}
      height={boxH}
      rx={1.5}
      ry={1.5}
      fill="var(--color-surface)"
      stroke="var(--color-ink)"
      strokeWidth={strong ? 1.4 : 1.1}
    />
  );

  const elbow = (sx: number, sy: number, tx: number, ty: number, dashed = false) => {
    const sBottom = sy + boxH / 2;
    const tTop = ty - boxH / 2;
    const midY = (sBottom + tTop) / 2;
    return (
      <path
        d={`M ${sx} ${sBottom} V ${midY} H ${tx} V ${tTop}`}
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
        strokeDasharray={dashed ? "2 2" : undefined}
        opacity={dashed ? 0.7 : 1}
      />
    );
  };

  const ceoCx = 60;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* CEO → VP edges */}
      {vpX.map((x, i) => (
        <g key={`cv-${i}`}>{elbow(ceoCx, rowCEO, x, rowVP)}</g>
      ))}

      {/* VP → Director edges */}
      {vpX.map((x, i) =>
        dirGroups[i].map((dx, j) => <g key={`vd-${i}-${j}`}>{elbow(x, rowVP, dx, rowDir)}</g>),
      )}

      {/* Dotted-line (Sales VP → Finance's leftmost director) */}
      {elbow(80, rowVP, 100, rowDir, true)}

      {/* Director boxes */}
      {vpX.flatMap((x, i) =>
        dirGroups[i].map((dx, j) => <g key={`d-${i}-${j}`}>{box(dx, rowDir)}</g>),
      )}

      {/* VP boxes */}
      {vpX.map((x, i) => (
        <g key={`v-${i}`}>{box(x, rowVP)}</g>
      ))}

      {/* CEO box (strong stroke) */}
      {box(ceoCx, rowCEO, true)}
    </svg>
  );
}
