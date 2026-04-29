export function LineThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      <polyline
        points="12,52 28,44 44,48 60,30 76,36 92,18 108,24"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [12, 52], [28, 44], [44, 48], [60, 30], [76, 36], [92, 18], [108, 24],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
