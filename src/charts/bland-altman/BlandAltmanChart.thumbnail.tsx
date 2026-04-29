export function BlandAltmanThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axis frame */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="12" x2="12" y2="68" stroke="var(--color-hairline)" />

      {/* Upper limit of agreement */}
      <line x1="12" y1="20" x2="112" y2="20" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="3 3" />
      {/* Bias line (slightly above midline — positive bias) */}
      <line x1="12" y1="36" x2="112" y2="36" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Zero reference */}
      <line x1="12" y1="44" x2="112" y2="44" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeDasharray="1 3" />
      {/* Lower limit of agreement */}
      <line x1="12" y1="58" x2="112" y2="58" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Point cloud clustered near the bias line, fanning out a bit */}
      {[
        [22, 34], [28, 38], [34, 32], [40, 40], [46, 34], [50, 30],
        [56, 42], [62, 36], [66, 28], [72, 38], [78, 32], [84, 40],
        [90, 30], [96, 36], [102, 34], [108, 38],
        [30, 46], [42, 28], [58, 48], [70, 44], [86, 46], [100, 26],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
