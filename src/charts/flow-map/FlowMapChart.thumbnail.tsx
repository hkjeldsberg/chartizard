// Flow-map silhouette: a single origin hub in the centre with five
// curved Bezier arcs fanning out to destination dots. No cartography —
// just the one-to-many curvature pattern that reads as "flow map" at a
// glance.

export function FlowMapThumbnail() {
  const hub = { x: 56, y: 44 };
  const destinations: ReadonlyArray<{ x: number; y: number; curve: number }> = [
    { x: 12, y: 22, curve: -10 }, // upper-left
    { x: 22, y: 62, curve: 8 }, // lower-left
    { x: 92, y: 18, curve: -8 }, // upper-right
    { x: 108, y: 40, curve: -14 }, // mid-right (long arc)
    { x: 100, y: 64, curve: 10 }, // lower-right
  ];

  // Bezier arc with a perpendicular control-point offset for the bulge.
  function arc(
    sx: number,
    sy: number,
    tx: number,
    ty: number,
    bulge: number,
  ): string {
    const mx = (sx + tx) / 2;
    const my = (sy + ty) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const cx = mx + nx * bulge;
    const cy = my + ny * bulge;
    return `M${sx} ${sy} Q${cx} ${cy} ${tx} ${ty}`;
  }

  // Faint continent-ish blobs behind the arcs.
  const blobs: ReadonlyArray<string> = [
    // left landmass
    "M4 14 L46 14 L44 32 L30 40 L8 38 Z",
    // right landmass
    "M62 10 L118 10 L116 36 L82 38 L64 28 Z",
    // bottom landmass
    "M20 52 L60 50 L96 56 L92 76 L30 74 Z",
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Continent silhouettes — very low contrast */}
      {blobs.map((d, i) => (
        <path
          key={`c-${i}`}
          d={d}
          fill="var(--color-ink)"
          fillOpacity={0.06}
          stroke="var(--color-hairline)"
          strokeWidth={0.5}
        />
      ))}

      {/* Flow arcs */}
      {destinations.map((d, i) => (
        <path
          key={`a-${i}`}
          d={arc(hub.x, hub.y, d.x, d.y, d.curve)}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity={0.6}
          strokeWidth={1 + (i % 3) * 0.5}
          strokeLinecap="round"
        />
      ))}

      {/* Destination markers — hollow */}
      {destinations.map((d, i) => (
        <circle
          key={`d-${i}`}
          cx={d.x}
          cy={d.y}
          r={1.8}
          fill="var(--color-page)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      ))}

      {/* Origin hub — filled, larger */}
      <circle cx={hub.x} cy={hub.y} r={2.8} fill="var(--color-ink)" />
    </svg>
  );
}
