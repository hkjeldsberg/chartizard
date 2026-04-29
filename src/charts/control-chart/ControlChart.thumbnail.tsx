export function ControlChartThumbnail() {
  const points: ReadonlyArray<[number, number]> = [
    [10, 44],
    [20, 40],
    [30, 46],
    [40, 42],
    [50, 14], // spike above UCL
    [60, 40],
    [70, 46],
    [80, 66], // dip below LCL
    [90, 42],
    [100, 40],
    [110, 44],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1={12} y1={72} x2={116} y2={72} stroke="var(--color-hairline)" />
      <line x1={12} y1={10} x2={12} y2={72} stroke="var(--color-hairline)" />

      <line
        x1={12}
        y1={22}
        x2={116}
        y2={22}
        stroke="var(--color-ink)"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <line x1={12} y1={42} x2={116} y2={42} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line
        x1={12}
        y1={62}
        x2={116}
        y2={62}
        stroke="var(--color-ink)"
        strokeWidth={1}
        strokeDasharray="3 2"
      />

      <polyline
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />

      {points.map(([x, y], i) => {
        const isOoc = y <= 22 || y >= 62;
        if (isOoc) {
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.6}
              fill="var(--color-page)"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
          );
        }
        return <circle key={i} cx={x} cy={y} r={1.8} fill="var(--color-ink)" />;
      })}
    </svg>
  );
}
