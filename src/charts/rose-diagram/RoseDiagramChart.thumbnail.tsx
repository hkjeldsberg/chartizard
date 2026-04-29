export function RoseDiagramThumbnail() {
  const cx = 60;
  const cy = 40;
  const R = 30;
  const sectorCount = 16;
  const sectorAngle = (2 * Math.PI) / sectorCount;
  const halfWedge = sectorAngle * 0.44;
  const centreAngle = (i: number) => -Math.PI / 2 + i * sectorAngle;

  // Per-sector totals (mimic Oslo-Gardermoen: prevailing S/SSW, secondary N/NNW).
  const totals = [
    4.4, 3.1, 2.3, 1.9, // N, NNE, NE, ENE
    2.3, 2.5, 3.0, 4.7, // E, ESE, SE, SSE
    7.7, 8.7, 5.8, 3.3, // S, SSW, SW, WSW
    2.4, 2.5, 2.8, 3.6, // W, WNW, NW, NNW
  ];
  // Inner stack boundaries as % of total for each sector — a shared ramp.
  const bandFractions = [0.35, 0.7, 0.9]; // boundaries between 4 bands

  const maxTotal = Math.max(...totals);

  const wedge = (r0: number, r1: number, a0: number, a1: number) => {
    const xo0 = cx + r1 * Math.cos(a0);
    const yo0 = cy + r1 * Math.sin(a0);
    const xo1 = cx + r1 * Math.cos(a1);
    const yo1 = cy + r1 * Math.sin(a1);
    if (r0 <= 0) {
      return `M${cx} ${cy} L${xo0.toFixed(2)} ${yo0.toFixed(2)} A${r1} ${r1} 0 0 1 ${xo1.toFixed(2)} ${yo1.toFixed(2)} Z`;
    }
    const xi0 = cx + r0 * Math.cos(a0);
    const yi0 = cy + r0 * Math.sin(a0);
    const xi1 = cx + r0 * Math.cos(a1);
    const yi1 = cy + r0 * Math.sin(a1);
    return `M${xi0.toFixed(2)} ${yi0.toFixed(2)} L${xo0.toFixed(2)} ${yo0.toFixed(2)} A${r1} ${r1} 0 0 1 ${xo1.toFixed(2)} ${yo1.toFixed(2)} L${xi1.toFixed(2)} ${yi1.toFixed(2)} A${r0} ${r0} 0 0 0 ${xi0.toFixed(2)} ${yi0.toFixed(2)} Z`;
  };

  const opacities = [0.28, 0.5, 0.7, 0.92];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer ring + spokes */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-hairline)" strokeWidth={0.8} />
      {[R * 0.33, R * 0.66].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-hairline)" strokeWidth={0.5} />
      ))}
      {[0, 2, 4, 6, 8, 10, 12, 14].map((i) => {
        const a = centreAngle(i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + R * Math.cos(a)}
            y2={cy + R * Math.sin(a)}
            stroke="var(--color-hairline)"
            strokeWidth={0.4}
          />
        );
      })}

      {/* Stacked petals */}
      {totals.map((t, i) => {
        const ac = centreAngle(i);
        const a0 = ac - halfWedge;
        const a1 = ac + halfWedge;
        const rTip = (t / maxTotal) * (R - 2);
        const rBoundaries = [0, ...bandFractions.map((f) => f * rTip), rTip];
        return (
          <g key={i}>
            {rBoundaries.slice(0, -1).map((r0, bi) => {
              const r1 = rBoundaries[bi + 1];
              return (
                <path
                  key={bi}
                  d={wedge(r0, r1, a0, a1)}
                  fill="var(--color-ink)"
                  fillOpacity={opacities[bi]}
                  stroke="var(--color-page)"
                  strokeWidth={0.3}
                />
              );
            })}
          </g>
        );
      })}

      {/* N label */}
      <text
        x={cx}
        y={cy - R - 3}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={7}
        fontWeight={600}
        fill="var(--color-ink)"
      >
        N
      </text>
    </svg>
  );
}
