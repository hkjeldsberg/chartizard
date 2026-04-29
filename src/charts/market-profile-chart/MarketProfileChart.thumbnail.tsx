export function MarketProfileThumbnail() {
  // Market Profile silhouette: horizontal letter bars of varying widths
  // forming a bell shape, with a POC line and Value Area bracket on the right.
  // Rendered as stacked horizontal rectangles of varying widths.
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* y-axis */}
      <line x1="14" y1="4" x2="14" y2="72" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Price row bars (bell shape) — each row is a thin rect proportional to letters */}
      {/* Row widths simulate letter counts: narrow at extremes, wide in middle */}
      {[
        { y: 6,  w: 6 },
        { y: 9,  w: 10 },
        { y: 12, w: 16 },
        { y: 15, w: 22 },
        { y: 18, w: 28 },
        { y: 21, w: 36 },
        { y: 24, w: 46 },
        { y: 27, w: 54 }, // POC
        { y: 30, w: 46 },
        { y: 33, w: 36 },
        { y: 36, w: 28 },
        { y: 39, w: 22 },
        { y: 42, w: 16 },
        { y: 45, w: 10 },
        { y: 48, w: 6 },
        { y: 51, w: 6 },
        { y: 54, w: 6 },
      ].map(({ y, w }, i) => (
        <rect
          key={i}
          x={16}
          y={y}
          width={w}
          height={2}
          fill="var(--color-ink)"
          opacity={i === 7 ? 1 : 0.65}
        />
      ))}

      {/* POC dashed line */}
      <line x1="14" x2="90" y1="28" y2="28" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Value Area bracket (right side) */}
      <line x1="76" x2="80" y1="18" y2="18" stroke="var(--color-ink)" strokeWidth="0.8" />
      <line x1="76" x2="76" y1="18" y2="42" stroke="var(--color-ink)" strokeWidth="0.8" />
      <line x1="76" x2="80" y1="42" y2="42" stroke="var(--color-ink)" strokeWidth="0.8" />
    </svg>
  );
}
