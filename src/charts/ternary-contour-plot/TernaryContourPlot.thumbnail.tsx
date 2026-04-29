export function TernaryContourPlotThumbnail() {
  // Equilateral triangle with 3 rough contour arcs inside.
  // viewBox 120×80. Triangle corners: BL=(10,72), BR=(110,72), Top=(60,6).
  const BL = { x: 10, y: 72 };
  const BR = { x: 110, y: 72 };
  const TOP = { x: 60, y: 6 };

  // Three schematic contour curves — hand-placed polylines that arc across
  // the triangle interior, evenly spaced from the Fe-Ni base toward the Cu apex.
  // Each curve goes from the left edge to the right edge of the triangle.
  const contours = [
    // Low T — near the Cu vertex (high Cu fraction)
    "M 28,55 Q 60,46 92,55",
    // Mid T — middle of triangle
    "M 20,64 Q 60,56 100,64",
    // High T — near the base (high Fe or Ni fraction)
    "M 14,70 Q 60,65 106,70",
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Triangle */}
      <polygon
        points={`${BL.x},${BL.y} ${BR.x},${BR.y} ${TOP.x},${TOP.y}`}
        fill="var(--color-ink)"
        fillOpacity={0.03}
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Vertex labels (tiny) */}
      <text x={BL.x - 1} y={BL.y + 8} fontFamily="monospace" fontSize={7} fill="var(--color-ink)" textAnchor="middle">Fe</text>
      <text x={BR.x + 1} y={BR.y + 8} fontFamily="monospace" fontSize={7} fill="var(--color-ink)" textAnchor="middle">Ni</text>
      <text x={TOP.x} y={TOP.y - 3} fontFamily="monospace" fontSize={7} fill="var(--color-ink)" textAnchor="middle">Cu</text>
      {/* Contour curves */}
      {contours.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1}
          strokeOpacity={0.55 + i * 0.12}
          strokeLinecap="round"
        />
      ))}
      {/* Sample point */}
      <circle cx={60} cy={52} r={2} fill="var(--color-ink)" opacity={0.8} />
    </svg>
  );
}
