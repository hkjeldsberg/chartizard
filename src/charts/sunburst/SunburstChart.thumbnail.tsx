// Two concentric rings: inner = 5 regions, outer = country slices.
// Silhouette only — no data library, just hand-computed arc paths.

interface Slice {
  start: number; // fraction of 2π (0..1)
  end: number;
  opacity: number;
}

function arcPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
): string {
  const s0 = a0 * Math.PI * 2 - Math.PI / 2;
  const s1 = a1 * Math.PI * 2 - Math.PI / 2;
  const x0o = cx + r1 * Math.cos(s0);
  const y0o = cy + r1 * Math.sin(s0);
  const x1o = cx + r1 * Math.cos(s1);
  const y1o = cy + r1 * Math.sin(s1);
  const x0i = cx + r0 * Math.cos(s1);
  const y0i = cy + r0 * Math.sin(s1);
  const x1i = cx + r0 * Math.cos(s0);
  const y1i = cy + r0 * Math.sin(s0);
  const large = a1 - a0 > 0.5 ? 1 : 0;
  return [
    `M${x0o.toFixed(2)} ${y0o.toFixed(2)}`,
    `A${r1} ${r1} 0 ${large} 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
    `L${x0i.toFixed(2)} ${y0i.toFixed(2)}`,
    `A${r0} ${r0} 0 ${large} 0 ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    "Z",
  ].join(" ");
}

// Inner ring: 5 regions summing to 1.
const REGIONS: Slice[] = [
  { start: 0.0, end: 0.58, opacity: 0.92 }, // Asia-Pacific (biggest)
  { start: 0.58, end: 0.75, opacity: 0.68 }, // North America
  { start: 0.75, end: 0.85, opacity: 0.5 }, // Europe
  { start: 0.85, end: 0.93, opacity: 0.36 }, // Middle East
  { start: 0.93, end: 1.0, opacity: 0.24 }, // Rest of World
];

// Outer ring: country slices inheriting the parent region's opacity * 0.55.
function makeCountries(regions: Slice[]): Slice[] {
  const out: Slice[] = [];
  const splits = [
    [0.55, 0.14, 0.05, 0.03, 0.03, 0.2], // Asia-Pacific: China dominant
    [0.82, 0.1, 0.08], // North America: USA dominant
    [0.185, 0.095, 0.085, 0.085, 0.085, 0.465],
    [0.215, 0.26, 0.085, 0.44],
    [0.39, 0.31, 0.3],
  ];
  regions.forEach((r, i) => {
    const sub = splits[i];
    if (!sub) return;
    const span = r.end - r.start;
    let acc = r.start;
    sub.forEach((s) => {
      const seg = { start: acc, end: acc + s * span, opacity: r.opacity * 0.55 };
      out.push(seg);
      acc = seg.end;
    });
  });
  return out;
}

export function SunburstThumbnail() {
  const cx = 60;
  const cy = 40;
  const innerR = 10;
  const midR = 22;
  const outerR = 34;

  const countries = makeCountries(REGIONS);

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* outer ring — countries */}
      {countries.map((s, i) => (
        <path
          key={`c-${i}`}
          d={arcPath(cx, cy, midR + 0.8, outerR, s.start, s.end)}
          fill="var(--color-ink)"
          opacity={s.opacity}
          stroke="var(--color-page)"
          strokeWidth={0.5}
        />
      ))}
      {/* inner ring — regions */}
      {REGIONS.map((s, i) => (
        <path
          key={`r-${i}`}
          d={arcPath(cx, cy, innerR, midR, s.start, s.end)}
          fill="var(--color-ink)"
          opacity={s.opacity}
          stroke="var(--color-page)"
          strokeWidth={0.6}
        />
      ))}
      {/* centre hole */}
      <circle cx={cx} cy={cy} r={innerR} fill="var(--color-surface)" />
    </svg>
  );
}
