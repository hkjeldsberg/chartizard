export function SpiralPlotThumbnail() {
  // Archimedean spiral wound ~3.5 times around the centre of a 120x80 viewBox.
  // Sample ~140 points and draw as a polyline; stroke opacity steps so a warm
  // "band" is implied across revolutions.
  const cx = 60;
  const cy = 40;
  const rInner = 4;
  const rOuter = 30;
  const turns = 3.5;
  const n = 140;

  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const r = rInner + t * (rOuter - rInner);
    const theta = -Math.PI / 2 + t * turns * 2 * Math.PI;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  // Warm-band dots: one per revolution at the summer angle (90° from start).
  const bandDots: Array<{ x: number; y: number; r: number }> = [];
  for (let rev = 0; rev < turns; rev++) {
    const t = (rev + 0.5) / turns; // mid of each turn
    const r = rInner + t * (rOuter - rInner);
    const theta = -Math.PI / 2 + (rev + 0.5) * 2 * Math.PI;
    bandDots.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
      r: 1.6 + rev * 0.2,
    });
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Backing disc */}
      <circle cx={cx} cy={cy} r={rOuter + 1} fill="none" stroke="var(--color-hairline)" />
      {/* Spiral */}
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.55"
      />
      {/* Warm-band dots (each revolution's summer peak) */}
      {bandDots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--color-ink)" />
      ))}
      {/* Centre hub */}
      <circle cx={cx} cy={cy} r="2" fill="var(--color-ink)" />
    </svg>
  );
}
