export function ResidualThumbnail() {
  // A flat cloud of dots straddling a dashed horizontal zero line —
  // the silhouette of a well-behaved residual plot.
  const points: Array<[number, number]> = [
    [20, 34], [26, 42], [30, 38], [34, 44], [38, 36], [42, 46],
    [46, 40], [50, 34], [54, 44], [58, 38], [62, 42], [66, 36],
    [70, 46], [74, 40], [78, 34], [82, 42], [86, 36], [90, 44],
    [94, 38], [98, 42], [102, 36], [106, 44],
    // A couple near the tails
    [32, 28], [78, 52], [48, 50], [90, 28],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis rails */}
      <line x1="12" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" />
      <line x1="12" y1="10" x2="12" y2="70" stroke="var(--color-hairline)" />
      {/* Zero reference line */}
      <line
        x1="12"
        x2="114"
        y1="40"
        y2="40"
        stroke="var(--color-ink)"
        strokeDasharray="3 3"
        strokeWidth="1"
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
