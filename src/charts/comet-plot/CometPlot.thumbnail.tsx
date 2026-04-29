export function CometPlotThumbnail() {
  // A tapering comet curve across a 120x80 viewBox. The "tail" is a series of
  // short segments with decreasing stroke-width + opacity; the "head" is a
  // large opaque circle with a ring around it.
  // Path: a gentle S-curve sweeping from lower-left up to an inflection near
  // the middle, then descending to the head at the right.
  const pts: Array<{ x: number; y: number }> = [
    { x: 14, y: 60 },
    { x: 20, y: 56 },
    { x: 26, y: 50 },
    { x: 32, y: 42 },
    { x: 38, y: 32 },
    { x: 46, y: 22 },
    { x: 54, y: 18 },
    { x: 62, y: 22 },
    { x: 70, y: 30 },
    { x: 78, y: 40 },
    { x: 86, y: 48 },
    { x: 94, y: 54 },
    { x: 100, y: 58 },
  ];

  const n = pts.length;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baselines */}
      <line x1="8" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" />
      <line x1="8" y1="8" x2="8" y2="70" stroke="var(--color-hairline)" />

      {/* Tapering tail — older segments thinner + fainter */}
      {pts.slice(0, n - 1).map((p, i) => {
        const next = pts[i + 1];
        const age = n - 2 - i; // 0 = newest (closest to head)
        const t = age / (n - 2);
        const sw = 0.6 + (1 - t) * 2.4;
        const op = 0.12 + (1 - t) * 0.85;
        return (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke="var(--color-ink)"
            strokeWidth={sw}
            strokeOpacity={op}
            strokeLinecap="round"
          />
        );
      })}

      {/* Tail markers (shrinking with age) */}
      {pts.slice(0, n - 1).map((p, i) => {
        const age = n - 1 - i;
        const t = age / (n - 1);
        const r = 0.4 + (1 - t) * 1.2;
        const op = 0.15 + (1 - t) * 0.6;
        return <circle key={`d${i}`} cx={p.x} cy={p.y} r={r} fill="var(--color-ink)" fillOpacity={op} />;
      })}

      {/* Head — opaque dot with ring */}
      <circle cx={pts[n - 1].x} cy={pts[n - 1].y} r="3.4" fill="var(--color-ink)" />
      <circle
        cx={pts[n - 1].x}
        cy={pts[n - 1].y}
        r="5.6"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.8"
      />
    </svg>
  );
}
