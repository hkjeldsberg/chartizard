// Mind-map silhouette — a central node with five curved branches fanning out.

export function MindMapThumbnail() {
  const cx = 60;
  const cy = 40;

  // Five main branches at evenly spaced angles, starting at the top.
  const n = 5;
  const r = 24;
  const branches = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a };
  });

  // A couple of sub-branches for visual texture.
  const subs = [
    // Sub off branch 0 (top)
    { from: 0, a: -Math.PI / 2 - 0.4, r: 36 },
    { from: 0, a: -Math.PI / 2 + 0.4, r: 36 },
    // Sub off branch 2 (lower-right)
    { from: 2, a: 0.55, r: 36 },
    // Sub off branch 3 (lower-left)
    { from: 3, a: Math.PI - 0.3, r: 36 },
  ].map((s) => ({
    fromPt: branches[s.from],
    x: cx + Math.cos(s.a) * s.r,
    y: cy + Math.sin(s.a) * s.r,
  }));

  // Quadratic curve with a perpendicular control-point nudge for the
  // hand-drawn look.
  const curve = (x1: number, y1: number, x2: number, y2: number, bend: number) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
    const nx = -dy / len;
    const ny = dx / len;
    return `M${x1} ${y1} Q${mx + nx * bend} ${my + ny * bend} ${x2} ${y2}`;
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Main branches — thick curves */}
      {branches.map((b, i) => (
        <path
          key={`m-${i}`}
          d={curve(cx, cy, b.x, b.y, i % 2 === 0 ? 6 : -6)}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ))}
      {/* Sub-branches — thinner */}
      {subs.map((s, i) => (
        <path
          key={`s-${i}`}
          d={curve(s.fromPt.x, s.fromPt.y, s.x, s.y, i % 2 === 0 ? 3 : -3)}
          fill="none"
          stroke="var(--color-ink-mute)"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      ))}
      {/* Main-branch nodes */}
      {branches.map((b, i) => (
        <circle key={`mn-${i}`} cx={b.x} cy={b.y} r={1.8} fill="var(--color-ink)" />
      ))}
      {/* Sub-branch nodes */}
      {subs.map((s, i) => (
        <circle
          key={`sn-${i}`}
          cx={s.x}
          cy={s.y}
          r={1.2}
          fill="var(--color-surface)"
          stroke="var(--color-ink-mute)"
          strokeWidth={0.8}
        />
      ))}
      {/* Central node */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
    </svg>
  );
}
