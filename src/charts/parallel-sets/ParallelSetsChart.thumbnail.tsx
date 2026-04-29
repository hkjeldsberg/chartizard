// Parallel-sets silhouette: three vertical axis bars connected by two
// sets of ribbons. Hand-drawn; no layout lib in the thumbnail bundle.

interface Segment {
  y0: number;
  y1: number;
}

interface Ribbon {
  x0: number;
  x1: number;
  sy0: number;
  sy1: number;
  ty0: number;
  ty1: number;
  opacity: number;
}

function ribbonPath(r: Ribbon): string {
  const mx = (r.x0 + r.x1) / 2;
  return [
    `M${r.x0},${r.sy0}`,
    `C${mx},${r.sy0} ${mx},${r.ty0} ${r.x1},${r.ty0}`,
    `L${r.x1},${r.ty1}`,
    `C${mx},${r.ty1} ${mx},${r.sy1} ${r.x0},${r.sy1}`,
    "Z",
  ].join(" ");
}

export function ParallelSetsThumbnail() {
  const barX = [12, 58, 104];
  const barW = 4;
  // Left axis — 4 segments (Class).
  const left: Segment[] = [
    { y0: 8, y1: 20 },
    { y0: 22, y1: 32 },
    { y0: 34, y1: 56 },
    { y0: 58, y1: 74 },
  ];
  // Middle axis — 2 segments (Sex: Male big, Female small).
  const middle: Segment[] = [
    { y0: 8, y1: 58 },
    { y0: 60, y1: 74 },
  ];
  // Right axis — 2 segments (Survived: No big, Yes small).
  const right: Segment[] = [
    { y0: 8, y1: 54 },
    { y0: 56, y1: 74 },
  ];

  // Ribbons: left→middle. Each left segment splits into male+female.
  const ribL: Ribbon[] = [
    // 1st class → Male chunk, Female chunk
    { x0: 16, x1: 58, sy0: 8, sy1: 14, ty0: 8, ty1: 12, opacity: 0.28 },
    { x0: 16, x1: 58, sy0: 14, sy1: 20, ty0: 60, ty1: 64, opacity: 0.22 },
    // 2nd class
    { x0: 16, x1: 58, sy0: 22, sy1: 28, ty0: 12, ty1: 17, opacity: 0.28 },
    { x0: 16, x1: 58, sy0: 28, sy1: 32, ty0: 64, ty1: 67, opacity: 0.22 },
    // 3rd class (largest, highlighted darker)
    { x0: 16, x1: 58, sy0: 34, sy1: 50, ty0: 17, ty1: 30, opacity: 0.55 },
    { x0: 16, x1: 58, sy0: 50, sy1: 56, ty0: 67, ty1: 71, opacity: 0.4 },
    // Crew (dominated by male)
    { x0: 16, x1: 58, sy0: 58, sy1: 73, ty0: 30, ty1: 58, opacity: 0.3 },
    { x0: 16, x1: 58, sy0: 73, sy1: 74, ty0: 71, ty1: 74, opacity: 0.22 },
  ];

  // Ribbons: middle→right. Male: mostly died (long ribbon to top) + some
  // survived (short skinny ribbon down-right). Female: mostly survived.
  const ribR: Ribbon[] = [
    // Male → No (dominant)
    { x0: 62, x1: 104, sy0: 8, sy1: 48, ty0: 8, ty1: 42, opacity: 0.38 },
    // Male → Yes (minority, crosses down)
    { x0: 62, x1: 104, sy0: 48, sy1: 58, ty0: 62, ty1: 70, opacity: 0.5 },
    // Female → No (minority, crosses up)
    { x0: 62, x1: 104, sy0: 60, sy1: 64, ty0: 42, ty1: 54, opacity: 0.32 },
    // Female → Yes (most survive)
    { x0: 62, x1: 104, sy0: 64, sy1: 74, ty0: 54, ty1: 62, opacity: 0.55 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Ribbons first so axis bars sit on top */}
      {ribL.map((r, i) => (
        <path
          key={`lr-${i}`}
          d={ribbonPath(r)}
          fill="var(--color-ink)"
          opacity={r.opacity}
        />
      ))}
      {ribR.map((r, i) => (
        <path
          key={`rr-${i}`}
          d={ribbonPath(r)}
          fill="var(--color-ink)"
          opacity={r.opacity}
        />
      ))}

      {/* Axis bars */}
      {left.map((s, i) => (
        <rect
          key={`l-${i}`}
          x={barX[0]}
          y={s.y0}
          width={barW}
          height={s.y1 - s.y0}
          fill="var(--color-ink)"
        />
      ))}
      {middle.map((s, i) => (
        <rect
          key={`m-${i}`}
          x={barX[1]}
          y={s.y0}
          width={barW}
          height={s.y1 - s.y0}
          fill="var(--color-ink)"
        />
      ))}
      {right.map((s, i) => (
        <rect
          key={`r-${i}`}
          x={barX[2]}
          y={s.y0}
          width={barW}
          height={s.y1 - s.y0}
          fill="var(--color-ink)"
        />
      ))}
    </svg>
  );
}
