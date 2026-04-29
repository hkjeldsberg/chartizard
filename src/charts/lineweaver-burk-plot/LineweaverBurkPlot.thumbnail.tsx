export function LineweaverBurkThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="18" y1="66" x2="112" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="18" y1="10" x2="18" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />
      {/* Fit line — rises steeply from near y-axis, extends into negative x territory */}
      <line x1="8" y1="58" x2="112" y2="16" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Data points — 6 clustered in the positive-x zone, one at high 1/[S] */}
      {[
        [112, 16],
        [98, 20],
        [82, 24],
        [64, 30],
        [48, 38],
        [36, 46],
        [26, 55],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="var(--color-ink)" />
      ))}
      {/* x-intercept marker */}
      <circle cx="8" cy="66" r="2" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      {/* y-intercept marker */}
      <circle cx="18" cy="60" r="2" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
    </svg>
  );
}
