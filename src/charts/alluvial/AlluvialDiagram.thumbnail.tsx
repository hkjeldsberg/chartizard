// Alluvial silhouette: three columns of stacked rectangles connected
// by curved ribbons. A sibling of the Sankey thumbnail, but with a
// middle column to signal categorical stages rather than source→sink.

function ribbon(
  x0: number,
  x1: number,
  y0Top: number,
  y0Bot: number,
  y1Top: number,
  y1Bot: number,
): string {
  const mx = (x0 + x1) / 2;
  return [
    `M${x0} ${y0Top}`,
    `C${mx} ${y0Top}, ${mx} ${y1Top}, ${x1} ${y1Top}`,
    `L${x1} ${y1Bot}`,
    `C${mx} ${y1Bot}, ${mx} ${y0Bot}, ${x0} ${y0Bot}`,
    "Z",
  ].join(" ");
}

export function AlluvialThumbnail() {
  // Column geometry.
  const colX = [12, 58, 104];
  const nw = 4;

  // Stage 0 — 3 nodes.
  const s0 = [
    { y0: 8, y1: 34 }, // Academic (tall)
    { y0: 38, y1: 56 }, // Vocational
    { y0: 60, y1: 72 }, // Arts
  ];
  // Stage 1 — 4 nodes.
  const s1 = [
    { y0: 6, y1: 32 }, // University
    { y0: 36, y1: 48 }, // Trade
    { y0: 52, y1: 62 }, // None
    { y0: 66, y1: 74 }, // Gap
  ];
  // Stage 2 — 5 nodes (omit "Other" for thumbnail clarity).
  const s2 = [
    { y0: 4, y1: 20 }, // Tech
    { y0: 24, y1: 38 }, // Health
    { y0: 42, y1: 54 }, // Trades
    { y0: 58, y1: 66 }, // Creative
    { y0: 70, y1: 76 }, // Business
  ];

  // Ribbons stage 0 → stage 1. Each ribbon is [sourceTop, sourceBot, targetTop, targetBot, opacity].
  const r01: [number, number, number, number, number][] = [
    // Academic → University (dominant)
    [8, 30, 6, 28, 0.55],
    // Academic → Trade (thin)
    [30, 32, 36, 38, 0.25],
    // Academic → None (thin)
    [32, 34, 52, 54, 0.2],
    // Vocational → University
    [38, 42, 28, 32, 0.4],
    // Vocational → Trade
    [42, 52, 38, 48, 0.35],
    // Vocational → None
    [52, 56, 54, 58, 0.25],
    // Arts → University
    [60, 66, 22, 28, 0.3],
    // Arts → None
    [66, 70, 58, 62, 0.25],
    // Arts → Gap
    [70, 72, 66, 74, 0.25],
  ];

  // Ribbons stage 1 → stage 2.
  const r12: [number, number, number, number, number][] = [
    // University → Tech
    [6, 14, 4, 12, 0.45],
    // University → Health
    [14, 22, 24, 34, 0.4],
    // University → Business
    [22, 30, 70, 76, 0.3],
    // University → Creative
    [30, 32, 58, 62, 0.25],
    // Trade → Trades
    [38, 48, 48, 54, 0.4],
    // None → Health
    [52, 54, 34, 36, 0.2],
    // None → Business
    [54, 58, 72, 76, 0.25],
    // Gap → Creative
    [66, 74, 62, 66, 0.25],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Ribbons behind nodes. Stage 0→1. */}
      {r01.map(([y0t, y0b, y1t, y1b, o], i) => (
        <path
          key={`r01-${i}`}
          d={ribbon(colX[0] + nw, colX[1], y0t, y0b, y1t, y1b)}
          fill="var(--color-ink)"
          opacity={o}
        />
      ))}
      {/* Stage 1→2. */}
      {r12.map(([y0t, y0b, y1t, y1b, o], i) => (
        <path
          key={`r12-${i}`}
          d={ribbon(colX[1] + nw, colX[2], y0t, y0b, y1t, y1b)}
          fill="var(--color-ink)"
          opacity={o}
        />
      ))}

      {/* Nodes. */}
      {s0.map((n, i) => (
        <rect key={`s0-${i}`} x={colX[0]} y={n.y0} width={nw} height={n.y1 - n.y0} fill="var(--color-ink)" />
      ))}
      {s1.map((n, i) => (
        <rect key={`s1-${i}`} x={colX[1]} y={n.y0} width={nw} height={n.y1 - n.y0} fill="var(--color-ink)" />
      ))}
      {s2.map((n, i) => (
        <rect key={`s2-${i}`} x={colX[2]} y={n.y0} width={nw} height={n.y1 - n.y0} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
