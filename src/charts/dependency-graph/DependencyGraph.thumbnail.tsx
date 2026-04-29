export function DependencyGraphThumbnail() {
  // Simple wheel: 10 nodes on a ring around (60, 40) with radius 26,
  // plus a hub node at 12 o'clock drawn in solid ink. Chords from several
  // ring nodes pass through/near the centre to hint at a dependency graph.
  const cx = 60;
  const cy = 40;
  const r = 26;
  const n = 10;
  const pt = (i: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  };
  const nodes = Array.from({ length: n }, (_, i) => pt(i));

  // Hub is node 0 (top). Chords: many spokes from hub to others,
  // plus a few cross-chords.
  const hub = nodes[0];
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    // Pull controls toward centre.
    const cxs = cx + (a.x - cx) * 0.25;
    const cys = cy + (a.y - cy) * 0.25;
    const cxe = cx + (b.x - cx) * 0.25;
    const cye = cy + (b.y - cy) * 0.25;
    return `M ${a.x} ${a.y} C ${cxs} ${cys}, ${cxe} ${cye}, ${b.x} ${b.y}`;
  };

  const hubEdges = [1, 3, 5, 6, 7, 9].map((i) => curve(hub, nodes[i]));
  const crossEdges = [
    curve(nodes[2], nodes[6]),
    curve(nodes[4], nodes[8]),
    curve(nodes[3], nodes[7]),
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Cross-chords (hairline) */}
      {crossEdges.map((d, i) => (
        <path
          key={`c-${i}`}
          d={d}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="0.7"
        />
      ))}
      {/* Hub chords (ink) */}
      {hubEdges.map((d, i) => (
        <path
          key={`h-${i}`}
          d={d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="0.9"
          opacity="0.7"
        />
      ))}
      {/* Ring nodes */}
      {nodes.map((p, i) => (
        <circle
          key={`n-${i}`}
          cx={p.x}
          cy={p.y}
          r={i === 0 ? 3 : 1.8}
          fill={i === 0 ? "var(--color-ink)" : "var(--color-surface)"}
          stroke="var(--color-ink)"
          strokeWidth={i === 0 ? 0 : 1}
        />
      ))}
    </svg>
  );
}
