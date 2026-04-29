export function ParallelCoordinatesPlotThumbnail() {
  // 6 vertical axes, three tiny line-bundles in ink + two muted inks to
  // suggest 3 clusters crossing the axes.
  const axes = [14, 34, 54, 74, 94, 108];

  const classic = [60, 58, 22, 26, 18, 66];
  const modern = [18, 22, 58, 52, 56, 20];
  const luxury = [40, 28, 36, 14, 36, 30];

  const toPath = (ys: number[]) =>
    ys.map((y, i) => `${i === 0 ? "M" : "L"} ${axes[i]} ${y}`).join(" ");

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {axes.map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1={10}
          y2={70}
          stroke="var(--color-hairline)"
          strokeWidth="0.8"
        />
      ))}
      <path d={toPath(classic)} fill="none" stroke="var(--color-ink)" strokeWidth="1.1" />
      <path
        d={toPath(modern)}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.5"
        strokeWidth="1.1"
      />
      <path
        d={toPath(luxury)}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.75"
        strokeWidth="1.1"
      />
    </svg>
  );
}
