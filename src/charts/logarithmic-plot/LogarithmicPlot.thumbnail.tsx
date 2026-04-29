export function LogarithmicPlotThumbnail() {
  // Semi-log-ish scatter: points descending from upper-left to lower-right
  // along a dashed reference line of slope -1, with decade gridlines hinted.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Frame */}
      <rect
        x={14}
        y={10}
        width={96}
        height={58}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
      />

      {/* Decade verticals (x-axis log) */}
      <line x1={46} y1={10} x2={46} y2={68} stroke="var(--color-hairline)" strokeWidth={0.6} />
      <line x1={78} y1={10} x2={78} y2={68} stroke="var(--color-hairline)" strokeWidth={0.6} />

      {/* Decade horizontals (y-axis log) */}
      <line x1={14} y1={28} x2={110} y2={28} stroke="var(--color-hairline)" strokeWidth={0.6} />
      <line x1={14} y1={46} x2={110} y2={46} stroke="var(--color-hairline)" strokeWidth={0.6} />

      {/* Dashed reference line, slope -1 */}
      <line
        x1={18}
        y1={16}
        x2={108}
        y2={64}
        stroke="var(--color-ink)"
        strokeWidth={1}
        strokeDasharray="3 2"
        strokeOpacity={0.7}
      />

      {/* Scatter points sitting near the reference */}
      {[
        [20, 18],
        [26, 22],
        [32, 24],
        [40, 28],
        [50, 32],
        [58, 36],
        [66, 40],
        [74, 44],
        [82, 48],
        [90, 54],
        [100, 60],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={1.7}
          fill="var(--color-page)"
          stroke="var(--color-ink)"
          strokeWidth={0.9}
        />
      ))}
    </svg>
  );
}
