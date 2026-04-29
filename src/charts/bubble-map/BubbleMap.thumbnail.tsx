// Bubble map silhouette — one big central disc with seven smaller discs on a
// surrounding ring, connected by straight lines. No labels, no data.

export function BubbleMapThumbnail() {
  const cx = 60;
  const cy = 40;
  const rCentral = 11;
  const rSat = 5.5;
  const ring = 26;
  const n = 7;

  const sats = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + Math.cos(a) * ring, y: cy + Math.sin(a) * ring };
  });

  // Trim line endpoints to the circle edges.
  const trim = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: x1 + ux * r1,
      y1: y1 + uy * r1,
      x2: x2 - ux * r2,
      y2: y2 - uy * r2,
    };
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Connecting lines — straight, one per satellite */}
      {sats.map((s, i) => {
        const seg = trim(cx, cy, rCentral, s.x, s.y, rSat);
        return (
          <line
            key={`l-${i}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.9}
            strokeLinecap="round"
          />
        );
      })}
      {/* Satellite bubbles */}
      {sats.map((s, i) => (
        <circle
          key={`s-${i}`}
          cx={s.x}
          cy={s.y}
          r={rSat}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      ))}
      {/* Central bubble — drawn last */}
      <circle
        cx={cx}
        cy={cy}
        r={rCentral}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
      />
    </svg>
  );
}
