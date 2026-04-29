export function VoronoiThumbnail() {
  // Hand-drawn approximation of a small Voronoi tessellation. Eight seeds
  // and a set of polygon cells drawn from their approximate bisectors.
  // Pure silhouette — not computed, just recognisable.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Bounding box. */}
      <rect
        x="6"
        y="6"
        width="108"
        height="68"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      {/* Cell polygons (hand-laid to look like a Voronoi tiling). */}
      <g
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      >
        <polyline points="6,32 34,28 44,6" />
        <polyline points="34,28 52,40 44,74" />
        <polyline points="52,40 78,32 78,6" />
        <polyline points="52,40 66,58 44,74" />
        <polyline points="78,32 96,46 114,40" />
        <polyline points="96,46 90,74" />
        <polyline points="66,58 90,74" />
        <polyline points="6,52 34,28" />
        <polyline points="34,28 52,40" />
      </g>
      {/* Seeds. */}
      {[
        [20, 18],
        [40, 20],
        [64, 20],
        [90, 22],
        [22, 44],
        [42, 50],
        [70, 46],
        [100, 60],
        [56, 66],
        [82, 62],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
