export function DonutThumbnail() {
  // Six slices matching the electricity mix: 36, 22, 15, 14, 10, 3 (percent).
  const cx = 60;
  const cy = 40;
  const rOuter = 28;
  const rInner = 17;
  const slices = [0.36, 0.22, 0.15, 0.14, 0.1, 0.03];
  const opacities = [0.95, 0.72, 0.55, 0.42, 0.3, 0.2];

  let startAngle = -Math.PI / 2; // 12 o'clock
  const paths = slices.map((share, i) => {
    const end = startAngle + share * Math.PI * 2;
    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(end);
    const y2 = cy + rOuter * Math.sin(end);
    const x3 = cx + rInner * Math.cos(end);
    const y3 = cy + rInner * Math.sin(end);
    const x4 = cx + rInner * Math.cos(startAngle);
    const y4 = cy + rInner * Math.sin(startAngle);
    const large = share > 0.5 ? 1 : 0;
    const d =
      `M${x1} ${y1} ` +
      `A${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} ` +
      `L${x3} ${y3} ` +
      `A${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
    startAngle = end;
    return (
      <path
        key={i}
        d={d}
        fill="var(--color-ink)"
        opacity={opacities[i]}
        stroke="var(--color-page)"
        strokeWidth="0.5"
      />
    );
  });

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {paths}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize="8"
        fill="var(--color-ink)"
        fontWeight="500"
      >
        28.4k
      </text>
    </svg>
  );
}
