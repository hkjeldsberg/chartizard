export function NormalProbabilityThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* axes */}
      <line x1="18" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="18" y1="10" x2="18" y2="68" stroke="var(--color-hairline)" />
      {/* non-linear y-tick hints (unequal spacing — 1%, 25%, 50%, 75%, 99%) */}
      {[14, 28, 39, 50, 64].map((y, i) => (
        <line
          key={i}
          x1={14}
          x2={18}
          y1={y}
          y2={y}
          stroke="var(--color-ink-mute)"
        />
      ))}
      {/* fitted line */}
      <line
        x1="22"
        y1="62"
        x2="108"
        y2="14"
        stroke="var(--color-ink-mute)"
        strokeDasharray="3 2"
      />
      {/* points hugging the line, with upper tail curling up above it */}
      {[
        [24, 60], [30, 56], [36, 52], [42, 48], [48, 44], [54, 40],
        [60, 36], [66, 32], [72, 28], [78, 24], [84, 20],
        // right-tail bow above the line
        [92, 14], [98, 10], [104, 6],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
