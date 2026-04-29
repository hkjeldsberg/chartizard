export function BarcodeThumbnail() {
  // A 1D baseline with vertical ticks at irregular positions and three
  // lengths. Includes a visible cluster (a tight run of ticks) and a gap.
  // No data — just the silhouette.
  const x0 = 10;
  const x1 = 112;
  const baseline = 46;

  // Hand-placed ticks: x, magnitudeBucket (0,1,2 → short/med/long)
  const ticks: Array<[number, number]> = [
    [14, 0],
    [21, 1],
    [27, 0],
    [33, 2],
    [41, 0],
    [48, 1],
    // cluster around 56–66
    [55, 0],
    [57, 2],
    [58, 0],
    [60, 1],
    [62, 0],
    [64, 1],
    [66, 0],
    // then a gap (nothing from 68 to 84)
    [86, 0],
    [93, 1],
    [99, 0],
    [105, 2],
    [110, 0],
  ];

  const lens = [8, 12, 18];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* baseline */}
      <line x1={x0} y1={baseline} x2={x1} y2={baseline} stroke="var(--color-hairline)" />
      {ticks.map(([x, bucket], i) => {
        const L = lens[bucket];
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={baseline - L / 2}
            y2={baseline + L / 2}
            stroke="var(--color-ink)"
            strokeOpacity="0.8"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}
