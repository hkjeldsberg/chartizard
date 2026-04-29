export function ThreeLineBreakThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Y-axis line */}
      <line x1="14" y1="8" x2="14" y2="70" stroke="var(--color-hairline)" strokeWidth="1" />
      {/* X-axis line */}
      <line x1="14" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Up-bars (hollow) — ascending staircase */}
      {[
        [16, 54, 62],
        [24, 46, 54],
        [32, 39, 47],
        [40, 32, 40],
        [48, 25, 33],
        [56, 18, 26],
        [64, 12, 20],
      ].map(([x, top, bot], i) => (
        <rect
          key={`up-${i}`}
          x={x} y={top}
          width={7} height={bot - top}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.2"
        />
      ))}

      {/* Down-bars (filled) — reversal sequence */}
      {[
        [72, 18, 30],
        [80, 28, 40],
        [88, 38, 50],
        [96, 46, 58],
      ].map(([x, top, bot], i) => (
        <rect
          key={`dn-${i}`}
          x={x} y={top}
          width={7} height={bot - top}
          fill="var(--color-ink)"
          stroke="var(--color-ink)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
