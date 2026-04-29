export function RadialHistogramThumbnail() {
  const cx = 60;
  const cy = 40;
  const outerR = 30;
  const innerR = 7;

  // 24 wedges. Bikeshare-shaped: overnight low, two commuter peaks at ~8 and
  // ~17, a midday shoulder in between.
  const hourly = [9, 5, 3, 2, 3, 8, 22, 48, 72, 46, 32, 38, 44, 42, 40, 48, 62, 84, 70, 48, 34, 24, 18, 12];
  const maxV = 84;

  const N = 24;
  const wedgeAngle = (2 * Math.PI) / N;
  const gap = wedgeAngle * 0.08;
  const clockToScreen = (c: number) => c - Math.PI / 2;

  const rFor = (v: number) => innerR + ((v / maxV) * (outerR - innerR));

  const pathFor = (hour: number, v: number) => {
    const a0 = clockToScreen(hour * wedgeAngle + gap / 2);
    const a1 = clockToScreen((hour + 1) * wedgeAngle - gap / 2);
    const rO = rFor(v);
    const rI = innerR;
    const x0 = cx + rI * Math.cos(a0);
    const y0 = cy + rI * Math.sin(a0);
    const x1 = cx + rO * Math.cos(a0);
    const y1 = cy + rO * Math.sin(a0);
    const x2 = cx + rO * Math.cos(a1);
    const y2 = cy + rO * Math.sin(a1);
    const x3 = cx + rI * Math.cos(a1);
    const y3 = cy + rI * Math.sin(a1);
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rO.toFixed(1)} ${rO.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${rI.toFixed(1)} ${rI.toFixed(1)} 0 0 0 ${x0.toFixed(1)} ${y0.toFixed(1)} Z`;
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer reference ring */}
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--color-hairline)" strokeWidth={0.8} />
      {/* Mid-level dashed ring */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR + (outerR - innerR) * 0.5}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.5}
        strokeDasharray="2 2"
      />
      {/* Wedges */}
      {hourly.map((v, i) => (
        <path key={i} d={pathFor(i, v)} fill="var(--color-ink)" opacity={0.86} />
      ))}
      {/* Inner hole outline */}
      <circle cx={cx} cy={cy} r={innerR} fill="var(--color-page)" stroke="var(--color-hairline)" strokeWidth={0.5} />
    </svg>
  );
}
