export function ScatterThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {[
        [18, 60], [22, 56], [26, 58], [30, 50], [34, 52], [38, 46],
        [42, 44], [46, 40], [50, 42], [54, 36], [58, 38], [62, 32],
        [66, 34], [70, 28], [74, 30], [78, 26], [82, 28], [86, 24],
        [90, 26], [94, 22], [98, 24], [102, 20], [106, 22],
        // scattered mid band
        [30, 42], [44, 54], [56, 48], [72, 40], [88, 32],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" fill="var(--color-ink)" />
      ))}
      {/* outlier */}
      <circle cx="56" cy="58" r="2.2" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="1" />
    </svg>
  );
}
