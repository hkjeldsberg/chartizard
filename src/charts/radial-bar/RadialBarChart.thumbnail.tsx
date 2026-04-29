export function RadialBarThumbnail() {
  const cx = 60;
  const cy = 40;
  const rMax = 34;
  const rInner = 10;
  const bandCount = 6;
  const gap = 1.5;
  const usable = rMax - rInner;
  const thickness = (usable - gap * (bandCount - 1)) / bandCount;

  // 270° sweep starting at 12 o'clock, clockwise.
  const startAngle = -Math.PI / 2;
  const sweep = (3 * Math.PI) / 2;

  // Hand-picked percentages so outer arcs are longer than inner arcs —
  // evokes the "long arc on top, short arc at centre" ranking silhouette.
  const values = [90, 76, 62, 52, 40, 30];

  const polar = (r: number, a: number): [number, number] => [
    cx + Math.cos(a) * r,
    cy + Math.sin(a) * r,
  ];

  const arcPath = (rO: number, rI: number, a0: number, a1: number) => {
    const [x0o, y0o] = polar(rO, a0);
    const [x1o, y1o] = polar(rO, a1);
    const [x1i, y1i] = polar(rI, a1);
    const [x0i, y0i] = polar(rI, a0);
    const sw = a1 - a0;
    const large = Math.abs(sw) > Math.PI ? 1 : 0;
    const cw = sw > 0 ? 1 : 0;
    return `M${x0o} ${y0o} A${rO} ${rO} 0 ${large} ${cw} ${x1o} ${y1o} L${x1i} ${y1i} A${rI} ${rI} 0 ${large} ${1 - cw} ${x0i} ${y0i} Z`;
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {values.map((v, i) => {
        // Outermost ring holds the longest arc (i=0 → outermost).
        const rO = rMax - i * (thickness + gap);
        const rI = rO - thickness;
        const a1 = startAngle + (v / 100) * sweep;
        return (
          <g key={i}>
            {/* Faint track */}
            <path
              d={arcPath(rO, rI, startAngle, startAngle + sweep)}
              fill="var(--color-hairline)"
              opacity={0.4}
            />
            {/* Value arc */}
            <path
              d={arcPath(rO, rI, startAngle, a1)}
              fill="var(--color-ink)"
              opacity={1 - i * 0.08}
            />
          </g>
        );
      })}
      {/* Central hole stroke — keeps the eye at the origin */}
      <circle cx={cx} cy={cy} r={rInner - 1} fill="none" stroke="var(--color-hairline)" strokeWidth={0.6} />
    </svg>
  );
}
