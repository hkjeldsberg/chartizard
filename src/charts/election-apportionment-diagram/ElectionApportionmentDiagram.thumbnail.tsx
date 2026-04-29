export function ElectionApportionmentDiagramThumbnail() {
  // Small hemicycle: 4 concentric rows of dots from left to right.
  const cx = 60;
  const baseY = 58;
  const innerR = 14;
  const outerR = 30;
  const counts = [8, 11, 14, 17]; // 50 dots across 4 rows
  const rows = counts.length;

  // Seat counts per row roughly proportional to radius.
  const radii = counts.map((_, r) => {
    const t = r / (rows - 1);
    return innerR + t * (outerR - innerR);
  });

  // Party split: first 30 (left, ink), middle 6 (grey), right 14 (hairline fill).
  // Colours are constrained to ink-palette per thumbnail convention.

  // Build flat list of (x, y, rank) where rank is strict left→right ordering.
  type Dot = { x: number; y: number; angle: number; row: number };
  const dotsByRow: Dot[][] = radii.map((rad, r) => {
    const nr = counts[r];
    return Array.from({ length: nr }, (_, c) => {
      const angle = Math.PI - (c / (nr - 1)) * Math.PI;
      return {
        x: cx + Math.cos(angle) * rad,
        y: baseY - Math.sin(angle) * rad,
        angle,
        row: r,
      };
    });
  });
  const flat = dotsByRow.flat();
  flat.sort((a, b) => (b.angle !== a.angle ? b.angle - a.angle : b.row - a.row));

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline */}
      <line
        x1={cx - outerR}
        y1={baseY}
        x2={cx + outerR}
        y2={baseY}
        stroke="var(--color-hairline)"
      />
      {flat.map((d, i) => {
        // First 30 left-most dots filled ink (majority), middle 6 hairline
        // fill with ink stroke (minor party), remaining right dots filled
        // with a mid-opacity ink.
        const r = 1.6;
        let fill = "var(--color-ink)";
        let opacity = 1;
        if (i >= 30 && i < 36) {
          fill = "var(--color-surface)";
        } else if (i >= 36) {
          fill = "var(--color-ink)";
          opacity = 0.55;
        }
        return (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={r}
            fill={fill}
            stroke="var(--color-ink)"
            strokeWidth={i >= 30 && i < 36 ? 0.6 : 0}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
