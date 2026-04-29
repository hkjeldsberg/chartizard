// Circos silhouette — outer ring of alternating chromosome arcs, a thin inner
// GC-heatmap ring, and two cross-disc ribbons. Hand-drawn SVG, no data.

export function CircosPlotThumbnail() {
  const cx = 60;
  const cy = 40;
  const rOut = 32;
  const rIn = 26;
  const rGcOut = 24;
  const rGcIn = 19;
  const rRib = 17;

  // Twelve arcs (simplified from 22) alternating light/dark.
  const n = 12;
  const padA = 0.04;
  const span = (2 * Math.PI - padA * n) / n;

  function polar(r: number, a: number): [number, number] {
    return [cx + Math.sin(a) * r, cy - Math.cos(a) * r];
  }

  function wedge(rO: number, rI: number, a0: number, a1: number): string {
    const [x0o, y0o] = polar(rO, a0);
    const [x1o, y1o] = polar(rO, a1);
    const [x1i, y1i] = polar(rI, a1);
    const [x0i, y0i] = polar(rI, a0);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return [
      `M ${x0o.toFixed(2)} ${y0o.toFixed(2)}`,
      `A ${rO} ${rO} 0 ${large} 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
      `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
      `A ${rI} ${rI} 0 ${large} 0 ${x0i.toFixed(2)} ${y0i.toFixed(2)}`,
      "Z",
    ].join(" ");
  }

  const arcs: Array<{ d: string; dgc: string; opacity: number }> = [];
  let cursor = 0;
  // GC-ring opacities (arbitrary, to mimic a heatmap row).
  const gcOpacities = [0.18, 0.28, 0.4, 0.52, 0.62, 0.4, 0.3, 0.5, 0.7, 0.58, 0.35, 0.22];
  for (let i = 0; i < n; i++) {
    const a0 = cursor + padA / 2;
    const a1 = cursor + span + padA / 2;
    arcs.push({
      d: wedge(rOut, rIn, a0, a1),
      dgc: wedge(rGcOut, rGcIn, a0, a1),
      opacity: i % 2 === 0 ? 0.78 : 0.38,
    });
    cursor = a1 + padA / 2;
  }

  // Ribbons — two curves through the centre connecting non-adjacent arcs.
  function ribbon(ai: number, bi: number): string {
    const aMid = padA / 2 + (ai + 0.5) * (span + padA);
    const bMid = padA / 2 + (bi + 0.5) * (span + padA);
    const [x1, y1] = polar(rRib, aMid);
    const [x2, y2] = polar(rRib, bMid);
    return `M${x1.toFixed(2)} ${y1.toFixed(2)} Q${cx} ${cy} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Ribbons (behind arcs). */}
      <path
        d={ribbon(1, 7)}
        stroke="var(--color-ink)"
        strokeOpacity={0.35}
        strokeWidth={2.2}
        fill="none"
      />
      <path
        d={ribbon(4, 10)}
        stroke="var(--color-ink)"
        strokeOpacity={0.3}
        strokeWidth={1.8}
        fill="none"
      />
      <path
        d={ribbon(2, 9)}
        stroke="var(--color-ink)"
        strokeOpacity={0.22}
        strokeWidth={1.4}
        fill="none"
      />

      {/* GC-heatmap ring (inner). */}
      {arcs.map((a, i) => (
        <path
          key={`gc-${i}`}
          d={a.dgc}
          fill="var(--color-ink)"
          opacity={gcOpacities[i]}
        />
      ))}

      {/* Chromosome ring (outer, alternating). */}
      {arcs.map((a, i) => (
        <path key={`arc-${i}`} d={a.d} fill="var(--color-ink)" opacity={a.opacity} />
      ))}
    </svg>
  );
}
