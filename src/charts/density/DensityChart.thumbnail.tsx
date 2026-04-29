export function DensityThumbnail() {
  // Right-skewed density silhouette: rises to a mode left of centre, long tail.
  const baseline = 68;
  const x0 = 12;
  const x1 = 112;

  // Sample a log-normal-ish curve on a dense grid.
  const points: Array<[number, number]> = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + t * (x1 - x0);
    // Peak around t ~ 0.28, long thin tail to the right.
    const mu = 0.28;
    const sigma = 0.14;
    const skew = Math.exp(-Math.pow((t - mu) / sigma, 2));
    const tail = 0.18 * Math.exp(-Math.max(0, (t - 0.35) * 2.4));
    const y = skew + tail * (t > mu ? 1 : 0);
    const h = y * 44;
    points.push([x, baseline - h]);
  }

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");
  const areaPath = `M${x0} ${baseline} ${linePath.slice(1)} L${x1} ${baseline} Z`;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1={x0} y1={baseline} x2={x1} y2={baseline} stroke="var(--color-hairline)" />
      <line x1={x0} y1="14" x2={x0} y2={baseline} stroke="var(--color-hairline)" />
      <path d={areaPath} fill="var(--color-ink)" opacity="0.22" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
