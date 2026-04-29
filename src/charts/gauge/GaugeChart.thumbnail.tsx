export function GaugeThumbnail() {
  // Semicircle gauge centred horizontally, baseline near the lower third.
  const cx = 60;
  const cy = 54;
  const rOuter = 40;
  const rInner = 26;

  // Arc path from (cx - r, cy) across the top to (cx + r, cy).
  const ring = (rO: number, rI: number, a0: number, a1: number) => {
    const p = (r: number, a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const [x0o, y0o] = p(rO, a0);
    const [x1o, y1o] = p(rO, a1);
    const [x1i, y1i] = p(rI, a1);
    const [x0i, y0i] = p(rI, a0);
    return `M${x0o} ${y0o} A${rO} ${rO} 0 0 1 ${x1o} ${y1o} L${x1i} ${y1i} A${rI} ${rI} 0 0 0 ${x0i} ${y0i} Z`;
  };

  // Needle at ~35% across the arc.
  const needleAngle = -Math.PI + 0.35 * Math.PI;
  const needleLen = rOuter * 0.88;
  const tipX = cx + Math.cos(needleAngle) * needleLen;
  const tipY = cy + Math.sin(needleAngle) * needleLen;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Zones: green / amber / red, same breakpoints as the live chart */}
      <path d={ring(rOuter, rInner, -Math.PI, -Math.PI + 0.4 * Math.PI)} fill="var(--color-ink)" opacity="0.75" />
      <path d={ring(rOuter, rInner, -Math.PI + 0.4 * Math.PI, -Math.PI + 0.8 * Math.PI)} fill="var(--color-ink)" opacity="0.45" />
      <path d={ring(rOuter, rInner, -Math.PI + 0.8 * Math.PI, 0)} fill="var(--color-ink)" opacity="0.22" />

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={tipX}
        y2={tipY}
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="3" fill="var(--color-ink)" />

      {/* Baseline under the gauge */}
      <line x1="16" y1={cy + 1} x2="104" y2={cy + 1} stroke="var(--color-hairline)" />
    </svg>
  );
}
