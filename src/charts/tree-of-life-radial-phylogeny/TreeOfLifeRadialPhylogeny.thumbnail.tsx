// Radial phylogeny silhouette — root at centre, three coloured fans radiating
// outward (Bacteria / Archaea / Eukarya). Each fan shows a handful of arc +
// radial branch strokes and a terminal leaf dot.

export function TreeOfLifeRadialPhylogenyThumbnail() {
  const cx = 60;
  const cy = 40;
  const rInner = 8; // root circle ("LUCA") radius
  const rMid = 22;  // domain split radius
  const rLeaf = 34; // leaves

  // Three domain fans: Bacteria (top), Archaea (lower-left), Eukarya
  // (lower-right). Each fan occupies ~2π/3 of the circle with a small pad.
  const pad = 0.12;
  const domainSpan = (2 * Math.PI - pad * 3) / 3;

  const domains = [
    { centre: -Math.PI / 2, colour: "var(--color-ink)" }, // Bacteria (top)
    { centre: -Math.PI / 2 + 2 * Math.PI / 3, colour: "var(--color-ink)" }, // Archaea
    { centre: -Math.PI / 2 + 4 * Math.PI / 3, colour: "var(--color-ink)" }, // Eukarya
  ];

  function polar(r: number, a: number): [number, number] {
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  }

  // For each domain, draw: radial stroke to the mid point, then 4 radial
  // leaves fanning out from the mid point.
  const leavesPerDomain: number = 4;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root → domain split strokes */}
      {domains.map((d, i) => {
        const [mx, my] = polar(rMid, d.centre);
        return (
          <line
            key={`trunk-${i}`}
            x1={cx}
            y1={cy}
            x2={mx}
            y2={my}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            opacity={0.9}
          />
        );
      })}

      {/* Domain split → leaves */}
      {domains.map((d, i) => {
        const halfSpan = domainSpan / 2;
        const strokes = [];
        const [mx, my] = polar(rMid, d.centre);
        for (let k = 0; k < leavesPerDomain; k++) {
          const t = leavesPerDomain === 1 ? 0.5 : k / (leavesPerDomain - 1);
          const a = d.centre - halfSpan + t * (2 * halfSpan);
          const [lx, ly] = polar(rLeaf, a);
          // Arc stub at rMid radius from domain centre angle to leaf angle.
          const [sx, sy] = polar(rMid, a);
          const sweep = a > d.centre ? 1 : 0;
          strokes.push(
            <path
              key={`dom-${i}-arc-${k}`}
              d={`M ${mx} ${my} A ${rMid} ${rMid} 0 0 ${sweep} ${sx} ${sy} L ${lx} ${ly}`}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
              opacity={0.75}
            />,
          );
          // Leaf dot.
          strokes.push(
            <circle
              key={`dom-${i}-leaf-${k}`}
              cx={lx}
              cy={ly}
              r={1.6}
              fill="var(--color-ink)"
              opacity={0.9}
            />,
          );
        }
        return <g key={`dom-${i}`}>{strokes}</g>;
      })}

      {/* Root node (LUCA) */}
      <circle cx={cx} cy={cy} r={rInner * 0.5} fill="var(--color-ink)" />
    </svg>
  );
}
