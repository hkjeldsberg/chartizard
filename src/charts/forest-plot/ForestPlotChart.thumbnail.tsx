export function ForestPlotThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Null reference line at HR=1 */}
      <line x1="72" y1="10" x2="72" y2="66" stroke="var(--color-hairline)" strokeDasharray="2 2" />

      {/* Five study rows — CI line + centred square. */}
      {[
        { y: 16, lo: 48, hi: 78, cx: 62, s: 4 },
        { y: 26, lo: 40, hi: 68, cx: 54, s: 5 },
        { y: 36, lo: 54, hi: 84, cx: 68, s: 3 },
        { y: 46, lo: 46, hi: 70, cx: 58, s: 3.5 },
        { y: 56, lo: 60, hi: 92, cx: 78, s: 3 },
      ].map((r, i) => (
        <g key={i}>
          <line x1={r.lo} y1={r.y} x2={r.hi} y2={r.y} stroke="var(--color-ink)" strokeWidth="1" />
          <line x1={r.lo} y1={r.y - 2} x2={r.lo} y2={r.y + 2} stroke="var(--color-ink)" strokeWidth="1" />
          <line x1={r.hi} y1={r.y - 2} x2={r.hi} y2={r.y + 2} stroke="var(--color-ink)" strokeWidth="1" />
          <rect x={r.cx - r.s} y={r.y - r.s} width={r.s * 2} height={r.s * 2} fill="var(--color-ink)" />
        </g>
      ))}

      {/* Pooled diamond at bottom */}
      <polygon
        points="52,66 62,62 72,66 62,70"
        fill="var(--color-ink)"
      />

      {/* Baseline x-axis */}
      <line x1="8" y1="74" x2="112" y2="74" stroke="var(--color-hairline)" />
    </svg>
  );
}
