// Sankey silhouette: two columns of stacked nodes connected by curved
// ribbons whose width encodes flow. Hand-drawn; no layout lib in the
// thumbnail bundle.

interface Node {
  y0: number;
  y1: number;
  x: number;
  opacity: number;
}

interface Flow {
  src: number; // source node index
  dst: number; // target node index (into targets)
  width: number;
}

function ribbon(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  w: number,
): string {
  // Horizontal bezier ribbon: draw top curve then bottom curve back.
  const mx = (x0 + x1) / 2;
  const halfTop = w / 2;
  return [
    `M${x0} ${y0 - halfTop}`,
    `C${mx} ${y0 - halfTop}, ${mx} ${y1 - halfTop}, ${x1} ${y1 - halfTop}`,
    `L${x1} ${y1 + halfTop}`,
    `C${mx} ${y1 + halfTop}, ${mx} ${y0 + halfTop}, ${x0} ${y0 + halfTop}`,
    "Z",
  ].join(" ");
}

export function SankeyThumbnail() {
  // Sources (left column) — 4 stacked.
  const sources: Node[] = [
    { y0: 10, y1: 28, x: 16, opacity: 0.92 },
    { y0: 32, y1: 46, x: 16, opacity: 0.7 },
    { y0: 50, y1: 60, x: 16, opacity: 0.5 },
    { y0: 64, y1: 72, x: 16, opacity: 0.35 },
  ];
  // Sinks (right column) — 3 stacked.
  const sinks: Node[] = [
    { y0: 8, y1: 22, x: 100, opacity: 0.9 },
    { y0: 28, y1: 52, x: 100, opacity: 0.65 },
    { y0: 58, y1: 72, x: 100, opacity: 0.45 },
  ];

  // Flows. y is the vertical centre at each end.
  const flows: { x0: number; x1: number; y0: number; y1: number; w: number; o: number }[] = [
    // Source 0 → sinks 0 and 1 (dominant flow)
    { x0: 20, x1: 100, y0: 15, y1: 13, w: 8, o: 0.45 },
    { x0: 20, x1: 100, y0: 23, y1: 34, w: 8, o: 0.35 },
    // Source 1 → sinks 0, 1
    { x0: 20, x1: 100, y0: 35, y1: 18, w: 5, o: 0.3 },
    { x0: 20, x1: 100, y0: 42, y1: 42, w: 7, o: 0.3 },
    // Source 2 → sinks 1, 2
    { x0: 20, x1: 100, y0: 53, y1: 48, w: 4, o: 0.25 },
    { x0: 20, x1: 100, y0: 58, y1: 62, w: 3, o: 0.25 },
    // Source 3 → sink 2
    { x0: 20, x1: 100, y0: 68, y1: 68, w: 4, o: 0.22 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Ribbons first so nodes sit on top */}
      {flows.map((f, i) => (
        <path
          key={`f-${i}`}
          d={ribbon(f.x0, f.y0, f.x1, f.y1, f.w)}
          fill="var(--color-ink)"
          opacity={f.o}
        />
      ))}

      {/* Source nodes */}
      {sources.map((n, i) => (
        <rect
          key={`s-${i}`}
          x={n.x}
          y={n.y0}
          width={4}
          height={n.y1 - n.y0}
          fill="var(--color-ink)"
          opacity={n.opacity}
        />
      ))}

      {/* Sink nodes */}
      {sinks.map((n, i) => (
        <rect
          key={`t-${i}`}
          x={n.x - 4}
          y={n.y0}
          width={4}
          height={n.y1 - n.y0}
          fill="var(--color-ink)"
          opacity={n.opacity}
        />
      ))}
    </svg>
  );
}
