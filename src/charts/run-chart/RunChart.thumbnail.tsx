export function RunChartThumbnail() {
  const points: ReadonlyArray<[number, number]> = [
    [14, 38],
    [22, 32],
    [30, 42],
    [38, 28],
    [46, 36],
    [54, 54], // run below median starts
    [62, 58],
    [70, 56],
    [78, 60],
    [86, 54],
    [94, 48],
    [102, 34],
    [110, 30],
  ];
  const medianY = 44;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1={12} y1={70} x2={116} y2={70} stroke="var(--color-hairline)" />
      <line x1={12} y1={8} x2={12} y2={70} stroke="var(--color-hairline)" />

      {/* Run band behind the below-median streak */}
      <rect
        x={50}
        y={medianY}
        width={42}
        height={70 - medianY}
        fill="var(--color-ink)"
        opacity={0.08}
      />

      {/* Median line */}
      <line
        x1={12}
        y1={medianY}
        x2={116}
        y2={medianY}
        stroke="var(--color-ink)"
        strokeWidth={1.1}
      />

      <polyline
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.8} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
