export function RadarThumbnail() {
  const cx = 60;
  const cy = 40;
  const R = 28;

  // Six axes, first at 12 o'clock (offset -90°).
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  const point = (i: number, v: number) => {
    const r = (v / 100) * R;
    return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
  };

  const ring = (level: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const p = point(i, level);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");

  // Thundershock-like (pointy up / right)
  const a = [95, 85, 40, 60, 90, 70].map((v, i) => {
    const p = point(i, v);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");

  // Ironhide-like (bulky bottom/left — defence/HP)
  const b = [30, 70, 95, 95, 40, 25].map((v, i) => {
    const p = point(i, v);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Rings */}
      {[25, 50, 75, 100].map((lvl) => (
        <polygon
          key={lvl}
          points={ring(lvl)}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={lvl === 100 ? 1 : 0.6}
        />
      ))}
      {/* Spokes */}
      {Array.from({ length: 6 }, (_, i) => {
        const p = point(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-hairline)"
            strokeWidth={0.6}
          />
        );
      })}
      {/* Two polygons */}
      <polygon
        points={b}
        fill="rgba(26,22,20,0.14)"
        stroke="var(--color-ink)"
        strokeWidth={1}
        strokeDasharray="2 2"
        strokeLinejoin="round"
      />
      <polygon
        points={a}
        fill="rgba(26,22,20,0.22)"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}
