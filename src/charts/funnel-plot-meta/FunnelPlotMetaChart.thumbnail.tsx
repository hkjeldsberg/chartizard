export function FunnelPlotMetaThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axis frame */}
      <line x1="12" y1="70" x2="112" y2="70" stroke="var(--color-hairline)" />
      <line x1="12" y1="10" x2="12" y2="70" stroke="var(--color-hairline)" />

      {/* Inverted funnel — apex at top (highest precision), opens downward. */}
      <line x1="56" y1="14" x2="22" y2="66" stroke="var(--color-ink-mute)" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="56" y1="14" x2="90" y2="66" stroke="var(--color-ink-mute)" strokeWidth="1" strokeDasharray="3 2" />

      {/* Central pooled-effect reference line */}
      <line x1="56" y1="14" x2="56" y2="66" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeDasharray="1 2" />

      {/* Points inside the funnel — dense at the apex, fanning out, with an
          empty bottom-right (the file-drawer gap). */}
      {[
        [52, 18], [58, 20], [56, 22], [54, 24], [60, 24],
        [48, 30], [54, 32], [60, 32], [64, 34], [50, 36],
        [44, 42], [52, 42], [58, 44], [66, 44],
        [38, 52], [48, 54], [56, 54],
        [32, 62], [42, 62],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="var(--color-ink)" />
      ))}
      {/* Notably no points in the [62..88] x [48..66] bottom-right region. */}
    </svg>
  );
}
