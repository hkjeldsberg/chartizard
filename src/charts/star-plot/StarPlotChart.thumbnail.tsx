export function StarPlotThumbnail() {
  const cx = 60;
  const cy = 40;
  const R = 30;
  const axes = 7;

  // Seven axes, first at 12 o'clock.
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes;
  const point = (i: number, v: number) => {
    const r = (v / 10) * R;
    return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
  };

  const ring = (level: number) =>
    Array.from({ length: axes }, (_, i) => {
      const p = point(i, level);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");

  // The wine profile used in the live chart — evokes the same silhouette.
  const values = [3, 7, 8, 9, 8, 6, 7];
  const profile = values
    .map((v, i) => {
      const p = point(i, v);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Rings */}
      {[2.5, 5, 7.5, 10].map((lvl) => (
        <polygon
          key={lvl}
          points={ring(lvl)}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={lvl === 10 ? 1 : 0.6}
        />
      ))}
      {/* Spokes */}
      {Array.from({ length: axes }, (_, i) => {
        const p = point(i, 10);
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
      {/* Single profile polygon — distinguishes star from radar */}
      <polygon
        points={profile}
        fill="rgba(26,22,20,0.22)"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {/* Vertex dots */}
      {values.map((v, i) => {
        const p = point(i, v);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={1.6}
            fill="var(--color-ink)"
          />
        );
      })}
      {/* Centre origin mark */}
      <circle cx={cx} cy={cy} r={1.2} fill="var(--color-ink-mute)" />
    </svg>
  );
}
