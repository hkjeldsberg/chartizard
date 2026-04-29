export function NatalChartThumbnail() {
  // Three concentric rings + radial house cusps + a few planet glyphs +
  // a central aspect triangle — recognisable silhouette of a natal wheel.
  const cx = 60;
  const cy = 40;
  const rOuter = 34;
  const rSignInner = 29;
  const rHouseInner = 22;
  const rInner = 16;

  const cusps = Array.from({ length: 12 }, (_, i) => {
    // 30° per house; start at 180° (9 o'clock = Ascendant).
    const deg = 180 - i * 30;
    const a = (deg * Math.PI) / 180;
    return {
      outer: { x: cx + rSignInner * Math.cos(a), y: cy - rSignInner * Math.sin(a) },
      inner: { x: cx + rHouseInner * Math.cos(a), y: cy - rHouseInner * Math.sin(a) },
      isAC: i === 0,
      isMC: i === 9,
    };
  });

  // A few sign-band dividers.
  const signDividers = Array.from({ length: 12 }, (_, i) => {
    const deg = 180 - i * 30;
    const a = (deg * Math.PI) / 180;
    return {
      outer: { x: cx + rOuter * Math.cos(a), y: cy - rOuter * Math.sin(a) },
      inner: { x: cx + rSignInner * Math.cos(a), y: cy - rSignInner * Math.sin(a) },
    };
  });

  // Three planet glyph positions on the middle disc.
  const planets = [
    { x: 46, y: 20, g: "☉" },
    { x: 84, y: 42, g: "☽" },
    { x: 56, y: 58, g: "♂" },
  ];

  // Two aspect lines from inner-disc edge.
  function onInner(deg: number) {
    const a = (deg * Math.PI) / 180;
    return { x: cx + rInner * Math.cos(a), y: cy - rInner * Math.sin(a) };
  }
  const aspectA = { from: onInner(130), to: onInner(-20) };
  const aspectB = { from: onInner(230), to: onInner(40) };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer sign ring. */}
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="var(--color-ink)" strokeWidth={0.9} />
      <circle
        cx={cx}
        cy={cy}
        r={rSignInner}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.7}
      />
      <circle
        cx={cx}
        cy={cy}
        r={rHouseInner}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.6}
        strokeOpacity={0.7}
      />
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        fill="none"
        stroke="var(--color-hairline)"
        strokeDasharray="1 2"
      />

      {/* Sign-band dividers. */}
      {signDividers.map((d, i) => (
        <line
          key={`sd-${i}`}
          x1={d.outer.x}
          y1={d.outer.y}
          x2={d.inner.x}
          y2={d.inner.y}
          stroke="var(--color-hairline)"
        />
      ))}

      {/* House cusps. */}
      {cusps.map((c, i) => (
        <line
          key={`c-${i}`}
          x1={c.outer.x}
          y1={c.outer.y}
          x2={c.inner.x}
          y2={c.inner.y}
          stroke={c.isAC || c.isMC ? "var(--color-ink)" : "var(--color-hairline)"}
          strokeWidth={c.isAC || c.isMC ? 1 : 0.6}
        />
      ))}

      {/* Aspect lines. */}
      <line
        x1={aspectA.from.x}
        y1={aspectA.from.y}
        x2={aspectA.to.x}
        y2={aspectA.to.y}
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      <line
        x1={aspectB.from.x}
        y1={aspectB.from.y}
        x2={aspectB.to.x}
        y2={aspectB.to.y}
        stroke="var(--color-ink)"
        strokeOpacity={0.4}
        strokeWidth={0.7}
        strokeDasharray="2 2"
      />

      {/* Planet glyphs. */}
      {planets.map((p, i) => (
        <text
          key={`p-${i}`}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={7}
          fill="var(--color-ink)"
        >
          {p.g}
        </text>
      ))}
    </svg>
  );
}
