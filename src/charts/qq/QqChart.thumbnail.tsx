export function QqThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* axes */}
      <line x1="14" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="14" y1="12" x2="14" y2="68" stroke="var(--color-hairline)" />
      {/* diagonal reference */}
      <line
        x1="14"
        y1="68"
        x2="112"
        y2="12"
        stroke="var(--color-ink-mute)"
        strokeDasharray="3 2"
      />
      {/* points hugging the line, bowing up past the diagonal on the right */}
      {[
        [22, 64], [28, 60], [34, 56], [40, 52], [46, 48], [52, 44],
        [58, 40], [64, 36], [70, 32], [76, 28], [82, 24],
        // right-tail bow above the diagonal
        [90, 18], [96, 14], [102, 10], [108, 6],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
