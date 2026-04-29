// Climate-stripes silhouette: ~15 vertical stripes walking from pale
// blue-grey on the left to deep red on the right. No axes. Reads as
// "warming trajectory" at a glance.

export function ClimateStripesThumbnail() {
  // Hand-tuned anomalies spanning pale cold → deep red hot.
  const anomalies = [
    -0.35, -0.28, -0.18, -0.22, -0.08, -0.05, 0.0, 0.05, 0.12, 0.22, 0.38, 0.55,
    0.72, 0.9, 1.15,
  ];

  const stops: ReadonlyArray<[number, number, number]> = [
    [8, 48, 107],
    [33, 102, 172],
    [67, 147, 195],
    [146, 197, 222],
    [247, 247, 247],
    [253, 219, 199],
    [244, 165, 130],
    [214, 96, 77],
    [103, 0, 13],
  ];
  const cold = -0.5;
  const hot = 1.2;
  const colour = (a: number) => {
    const t = Math.max(0, Math.min(1, (a - cold) / (hot - cold)));
    const scaled = t * (stops.length - 1);
    const i = Math.floor(scaled);
    const frac = scaled - i;
    if (i >= stops.length - 1) {
      const [r, g, b] = stops[stops.length - 1];
      return `rgb(${r}, ${g}, ${b})`;
    }
    const [r0, g0, b0] = stops[i];
    const [r1, g1, b1] = stops[i + 1];
    return `rgb(${Math.round(r0 + (r1 - r0) * frac)}, ${Math.round(
      g0 + (g1 - g0) * frac,
    )}, ${Math.round(b0 + (b1 - b0) * frac)})`;
  };

  const x0 = 6;
  const x1 = 114;
  const y0 = 10;
  const y1 = 62;
  const n = anomalies.length;
  const w = (x1 - x0) / n;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {anomalies.map((a, i) => (
        <rect
          key={i}
          x={x0 + i * w}
          y={y0}
          width={w + 0.5}
          height={y1 - y0}
          fill={colour(a)}
        />
      ))}
      {/* Year-range hairline below */}
      <line
        x1={x0}
        y1={68}
        x2={x1}
        y2={68}
        stroke="var(--color-hairline)"
      />
      <text
        x={x0}
        y={76}
        fontSize={7}
        fontFamily="var(--font-mono)"
        fill="var(--color-ink-mute)"
      >
        1850
      </text>
      <text
        x={x1}
        y={76}
        textAnchor="end"
        fontSize={7}
        fontFamily="var(--font-mono)"
        fill="var(--color-ink-mute)"
      >
        2024
      </text>
    </svg>
  );
}
