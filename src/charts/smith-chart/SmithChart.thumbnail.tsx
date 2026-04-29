export function SmithChartThumbnail() {
  // The thumbnail is a silhouette: the unit-circle boundary, a few
  // constant-R circles all tangent to the right edge, and a couple of
  // clipped constant-X arcs emanating from that same point. Centre +
  // example point marked.
  const cx = 60;
  const cy = 40;
  const R = 30;

  // Constant-resistance circle centres: (R/(1+R), 0) · radius pixels
  // scaled by R. Render in the unit-circle frame and transform to px.
  const constR = (RR: number) => {
    const radius = R / (1 + RR);
    const centre = cx + (RR / (1 + RR)) * R;
    return { cx: centre, cy, r: radius };
  };

  // Constant-X arcs — centre (1, 1/X), radius |1/X| in unit space.
  // Clip to unit disc via clipPath.
  const constX = (X: number) => {
    const centreU = 1;
    const centreV = 1 / X;
    const radius = Math.abs(1 / X);
    return {
      cx: cx + centreU * R,
      cy: cy - centreV * R,
      r: radius * R,
    };
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <clipPath id="smith-thumb-clip">
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>

      {/* Disc interior */}
      <circle cx={cx} cy={cy} r={R} fill="var(--color-surface)" />

      <g clipPath="url(#smith-thumb-clip)">
        {/* Constant-R circles */}
        {[0, 0.5, 1, 2].map((RR) => {
          const c = constR(RR);
          return (
            <circle
              key={`r-${RR}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={RR === 1 ? 1 : 0.7}
            />
          );
        })}

        {/* Constant-X arcs */}
        {[0.5, 1, 2, -0.5, -1, -2].map((X) => {
          const c = constX(X);
          return (
            <circle
              key={`x-${X}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={Math.abs(X) === 1 ? 1 : 0.7}
            />
          );
        })}

        {/* Real axis */}
        <line
          x1={cx - R}
          y1={cy}
          x2={cx + R}
          y2={cy}
          stroke="var(--color-hairline)"
          strokeWidth={0.85}
        />
      </g>

      {/* Outer unit-circle boundary */}
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Centre point (matched) */}
      <circle cx={cx} cy={cy} r={1.6} fill="var(--color-ink)" />

      {/* Example impedance at Γ = (−0.2, 0.4) */}
      <circle
        cx={cx + -0.2 * R}
        cy={cy - 0.4 * R}
        r={2.4}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
      />
    </svg>
  );
}
