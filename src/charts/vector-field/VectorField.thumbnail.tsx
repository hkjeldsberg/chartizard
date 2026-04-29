export function VectorFieldThumbnail() {
  // 5x5 grid of arrows tangent to circles around centre — silhouette of a
  // point-vortex quiver plot.
  const cx = 60;
  const cy = 40;
  const step = 16;
  const arrows: Array<{ x: number; y: number; dx: number; dy: number }> = [];
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (i === 0 && j === 0) continue;
      const x = cx + i * step;
      const y = cy + j * step;
      // Tangent to circle: (-y, x) relative to centre, then normalise
      const rx = i;
      const ry = j;
      const mag = Math.sqrt(rx * rx + ry * ry);
      const dx = -ry / mag;
      const dy = rx / mag;
      arrows.push({ x, y, dx, dy });
    }
  }
  const L = 5;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <rect
        x={2}
        y={2}
        width={116}
        height={76}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth="0.6"
      />
      {arrows.map((a, i) => {
        const ex = a.x + a.dx * L;
        const ey = a.y + a.dy * L;
        const hx1 = ex - 2 * (a.dx * 0.9 - a.dy * 0.45);
        const hy1 = ey - 2 * (a.dy * 0.9 + a.dx * 0.45);
        const hx2 = ex - 2 * (a.dx * 0.9 + a.dy * 0.45);
        const hy2 = ey - 2 * (a.dy * 0.9 - a.dx * 0.45);
        return (
          <g key={i}>
            <line
              x1={a.x - a.dx * L}
              y1={a.y - a.dy * L}
              x2={ex}
              y2={ey}
              stroke="var(--color-ink)"
              strokeWidth="0.9"
              strokeOpacity="0.8"
              strokeLinecap="round"
            />
            <polygon
              points={`${hx1},${hy1} ${ex},${ey} ${hx2},${hy2}`}
              fill="var(--color-ink)"
              fillOpacity="0.8"
            />
          </g>
        );
      })}
      {/* Vortex centre cross */}
      <line
        x1={cx - 3}
        y1={cy}
        x2={cx + 3}
        y2={cy}
        stroke="var(--color-ink)"
        strokeWidth="1.1"
      />
      <line
        x1={cx}
        y1={cy - 3}
        x2={cx}
        y2={cy + 3}
        stroke="var(--color-ink)"
        strokeWidth="1.1"
      />
    </svg>
  );
}
