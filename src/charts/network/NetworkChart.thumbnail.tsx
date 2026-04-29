export function NetworkThumbnail() {
  // Tiny hub-and-spoke sketch: one central node, a ring of smaller nodes,
  // edges of varying thickness. Not an accurate layout of the live chart —
  // just a recognisable silhouette of "network".
  const cx = 60;
  const cy = 40;
  const hubR = 5.5;
  const ring: Array<{ x: number; y: number; r: number }> = [
    { x: 96, y: 40, r: 3 }, // E
    { x: 82, y: 62, r: 2.5 }, // SE
    { x: 60, y: 70, r: 3.5 }, // S
    { x: 36, y: 62, r: 2.5 }, // SW
    { x: 22, y: 40, r: 3 }, // W
    { x: 36, y: 18, r: 2.5 }, // NW
    { x: 60, y: 12, r: 3 }, // N
    { x: 82, y: 18, r: 2.5 }, // NE
  ];
  // A couple of outer-cluster nodes + intra-cluster edges.
  const outer = [
    { x: 104, y: 58, r: 2 }, // near E
    { x: 16, y: 22, r: 2 }, // near NW
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Spokes from hub to each ring node. */}
      {ring.map((n, i) => (
        <line
          key={`spoke-${i}`}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke="var(--color-ink)"
          strokeOpacity={0.35}
          strokeWidth={i % 2 === 0 ? 1.4 : 0.9}
        />
      ))}
      {/* Cluster edges (between ring nodes). */}
      <line
        x1={ring[0].x}
        y1={ring[0].y}
        x2={outer[0].x}
        y2={outer[0].y}
        stroke="var(--color-ink)"
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      <line
        x1={ring[5].x}
        y1={ring[5].y}
        x2={outer[1].x}
        y2={outer[1].y}
        stroke="var(--color-ink)"
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      <line
        x1={ring[1].x}
        y1={ring[1].y}
        x2={ring[2].x}
        y2={ring[2].y}
        stroke="var(--color-ink)"
        strokeOpacity={0.35}
        strokeWidth={0.9}
      />

      {/* Ring + outer nodes. */}
      {[...ring, ...outer].map((n, i) => (
        <circle key={`n-${i}`} cx={n.x} cy={n.y} r={n.r} fill="var(--color-ink)" />
      ))}
      {/* Hub — bigger, stroked to separate from spokes. */}
      <circle
        cx={cx}
        cy={cy}
        r={hubR}
        fill="var(--color-ink)"
        stroke="var(--color-page)"
        strokeWidth={1}
      />
    </svg>
  );
}
