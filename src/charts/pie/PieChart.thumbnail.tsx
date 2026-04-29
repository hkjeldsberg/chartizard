export function PieThumbnail() {
  // Four slices: 40%, 25%, 20%, 15%
  const cx = 60;
  const cy = 40;
  const r = 26;
  const slices = [0.4, 0.25, 0.2, 0.15];
  const opacities = [0.9, 0.65, 0.4, 0.22];

  let startAngle = -Math.PI / 2; // start at 12 o'clock
  const paths = slices.map((share, i) => {
    const end = startAngle + share * Math.PI * 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = share > 0.5 ? 1 : 0;
    const d = `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    startAngle = end;
    return (
      <path
        key={i}
        d={d}
        fill="var(--color-ink)"
        opacity={opacities[i]}
      />
    );
  });

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {paths}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-page)" strokeWidth="0.75" />
    </svg>
  );
}
