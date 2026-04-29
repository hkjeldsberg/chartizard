export function QuaternaryPlotThumbnail() {
  // Isometric tetrahedron — hand-drawn SVG
  // Vertices projected to 120×80 viewport
  // A=Fe (left base), B=Cr (right base), C=Ni (back base), D=C_apex (top)
  const A = [28, 62]; // Fe — front-left
  const B = [92, 62]; // Cr — front-right
  const C = [60, 52]; // Ni — back-middle (appears above/behind AB)
  const D = [60, 14]; // C  — apex

  // Solid edges (visible)
  const solid: [number[], number[]][] = [
    [A, B], // front bottom
    [A, D], // left
    [B, D], // right
    [B, C], // right-back
    [D, C], // top-back
  ];

  // Hidden edge (dashed)
  const dashed: [number[], number[]][] = [[A, C]];

  // 316SS composition point (near Fe vertex, slightly inside)
  const pt = [38, 56];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Solid edges */}
      {solid.map(([a, b], i) => (
        <line
          key={`s-${i}`}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}
      {/* Dashed hidden edge */}
      {dashed.map(([a, b], i) => (
        <line
          key={`d-${i}`}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
          strokeDasharray="3 2"
          strokeLinecap="round"
        />
      ))}
      {/* Vertex dots */}
      {[A, B, C, D].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill="var(--color-ink)" />
      ))}
      {/* Vertex labels */}
      <text x={A[0] - 10} y={A[1] + 3} fontSize="7" fontFamily="monospace" fill="var(--color-ink)" textAnchor="middle">Fe</text>
      <text x={B[0] + 10} y={B[1] + 3} fontSize="7" fontFamily="monospace" fill="var(--color-ink)" textAnchor="middle">Cr</text>
      <text x={C[0] + 10} y={C[1]} fontSize="7" fontFamily="monospace" fill="var(--color-ink)" textAnchor="middle">Ni</text>
      <text x={D[0]} y={D[1] - 5} fontSize="7" fontFamily="monospace" fill="var(--color-ink)" textAnchor="middle">C</text>
      {/* 316 SS composition point */}
      <circle cx={pt[0]} cy={pt[1]} r={3.5} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <circle cx={pt[0]} cy={pt[1]} r={1.2} fill="var(--color-ink)" />
    </svg>
  );
}
