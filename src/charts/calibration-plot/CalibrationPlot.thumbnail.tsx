export function CalibrationPlotThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* axes */}
      <line x1="14" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="14" y1="10" x2="14" y2="68" stroke="var(--color-hairline)" />
      {/* 45° diagonal — perfect calibration */}
      <line
        x1="14"
        y1="68"
        x2="112"
        y2="10"
        stroke="var(--color-ink-mute)"
        strokeDasharray="3 2"
        strokeWidth="1"
      />
      {/* calibration curve — sags below diagonal at high probabilities */}
      <polyline
        points="23,63 33,55 43,48 53,42 63,36 73,33 83,28 93,25 103,20"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* binned dots */}
      {[
        [23, 63], [33, 55], [43, 48], [53, 42], [63, 36],
        [73, 33], [83, 28], [93, 25], [103, 20],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="var(--color-ink)" />
      ))}
      {/* rug histogram hints at the bottom */}
      {[
        [23, 6], [33, 5.5], [43, 5], [53, 4.5], [63, 4],
        [73, 3.5], [83, 3], [93, 2.5], [103, 2],
      ].map(([x, h], i) => (
        <rect
          key={i}
          x={Number(x) - 2}
          y={68 - Number(h)}
          width={4}
          height={Number(h)}
          fill="var(--color-ink)"
          opacity={0.35}
        />
      ))}
    </svg>
  );
}
