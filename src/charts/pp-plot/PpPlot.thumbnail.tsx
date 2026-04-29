export function PpPlotThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="10" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* 45° diagonal */}
      <line
        x1="12"
        y1="68"
        x2="112"
        y2="10"
        stroke="var(--color-ink-mute)"
        strokeDasharray="3 2"
        strokeWidth="1"
      />
      {/* scatter points — heavy-tailed sample bends away from diagonal at extremes */}
      {[
        [16, 66],
        [22, 60],
        [28, 55],
        [35, 50],
        [42, 46],
        [49, 42],
        [56, 38],
        [63, 34],
        [70, 30],
        [77, 26],
        [84, 22],
        [91, 19],
        [98, 14],
        [106, 12],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
