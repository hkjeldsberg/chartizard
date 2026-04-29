export function StreamlineThumbnail() {
  // Concentric rings around a central + — the silhouette of a point-vortex
  // streamline plot.
  const cx = 60;
  const cy = 40;
  const radii = [6, 12, 20, 28, 34];
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
      {radii.map((r, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={r}
          ry={r * 0.85}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1"
          strokeOpacity={0.5 + (i / radii.length) * 0.4}
        />
      ))}
      {/* Vortex centre */}
      <line
        x1={cx - 3}
        y1={cy}
        x2={cx + 3}
        y2={cy}
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
      <line
        x1={cx}
        y1={cy - 3}
        x2={cx}
        y2={cy + 3}
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
    </svg>
  );
}
