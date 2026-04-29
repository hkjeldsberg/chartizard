export function PyramidThumbnail() {
  // Five-tier pyramid silhouette. Apex at top-centre, base at bottom.
  // Widths taper linearly from 0 to 88px across 5 equal-height rows.
  const cx = 60;
  const topY = 10;
  const botY = 70;
  const rows = 5;
  const rowH = (botY - topY) / rows;
  const maxW = 88;

  const tiers = Array.from({ length: rows }, (_, j) => {
    const yTop = topY + j * rowH;
    const yBot = topY + (j + 1) * rowH;
    const wTop = (maxW * j) / rows;
    const wBot = (maxW * (j + 1)) / rows;
    const bottomRank = rows - 1 - j; // 0 = base, 4 = peak
    const opacity = 0.92 - (bottomRank / (rows - 1)) * 0.54;
    return {
      points: `${cx - wTop / 2},${yTop} ${cx + wTop / 2},${yTop} ${cx + wBot / 2},${yBot} ${cx - wBot / 2},${yBot}`,
      opacity,
      key: j,
    };
  });

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Base hairline */}
      <line
        x1={cx - maxW / 2}
        y1={botY}
        x2={cx + maxW / 2}
        y2={botY}
        stroke="var(--color-hairline)"
      />
      {tiers.map((t) => (
        <polygon
          key={t.key}
          points={t.points}
          fill="var(--color-ink)"
          fillOpacity={t.opacity}
          stroke="var(--color-page)"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
}
