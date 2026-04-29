// Radial tree silhouette — root dot at centre, spokes radiating outward to
// leaf dots. Hand-drawn at 120×80; no data or layout library.
export function RadialTreeThumbnail() {
  const cx = 60;
  const cy = 40;

  function polar(r: number, a: number): [number, number] {
    // rotate -90° so angle 0 points up
    return [
      cx + Math.cos(a - Math.PI / 2) * r,
      cy + Math.sin(a - Math.PI / 2) * r,
    ];
  }

  // Level-1 branches: 7 spokes spread around the circle.
  const level1Angles = Array.from({ length: 7 }, (_, i) => (i / 7) * 2 * Math.PI);
  const rLevel1 = 16;
  const rLeaf = 32;

  // Each level-1 node fans out into 2–3 leaves.
  const fanCounts = [3, 2, 2, 1, 1, 1, 1];

  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const dots: Array<{ cx: number; cy: number; r: number }> = [];

  level1Angles.forEach((a1, i) => {
    const [l1x, l1y] = polar(rLevel1, a1);
    dots.push({ cx: l1x, cy: l1y, r: 1.8 });
    lines.push({ x1: cx, y1: cy, x2: l1x, y2: l1y });

    const n = fanCounts[i];
    const halfSpan = (n > 1 ? 0.28 : 0) as number;
    for (let k = 0; k < n; k++) {
      const t = n === 1 ? 0 : k / (n - 1);
      const a2 = a1 - halfSpan + t * halfSpan * 2;
      const [lx, ly] = polar(rLeaf, a2);
      lines.push({ x1: l1x, y1: l1y, x2: lx, y2: ly });
      dots.push({ cx: lx, cy: ly, r: 1.3 });
    }
  });

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Edges */}
      {lines.map((l, i) => (
        <line
          key={`l-${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="var(--color-ink)"
          strokeWidth={0.9}
          strokeOpacity={0.5}
        />
      ))}

      {/* Leaf / internal dots */}
      {dots.map((d, i) => (
        <circle
          key={`d-${i}`}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill="var(--color-ink)"
          opacity={0.8}
        />
      ))}

      {/* Root dot */}
      <circle cx={cx} cy={cy} r={3.5} fill="var(--color-ink)" />
    </svg>
  );
}
