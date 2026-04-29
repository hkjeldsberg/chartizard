export function BubbleThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* small bubbles scattered */}
      {[
        [22, 56, 2],
        [30, 48, 2.5],
        [46, 38, 3],
        [56, 30, 3.5],
        [70, 24, 2.8],
        [92, 20, 2.4],
        [104, 22, 2],
        [38, 52, 2.2],
        [80, 34, 2.6],
      ].map(([x, y, r], i) => (
        <circle
          key={`s-${i}`}
          cx={x}
          cy={y}
          r={r}
          fill="var(--color-ink)"
          fillOpacity="0.22"
          stroke="var(--color-ink)"
          strokeWidth="0.7"
        />
      ))}
      {/* two big bubbles — visual centre of gravity */}
      <circle cx="38" cy="42" r="10" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="1" />
      <circle cx="28" cy="48" r="10" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="1" />
      {/* outlier — no fill */}
      <circle cx="26" cy="60" r="5.5" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
    </svg>
  );
}
