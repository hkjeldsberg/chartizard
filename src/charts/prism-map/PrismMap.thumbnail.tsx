export function PrismMapThumbnail() {
  // A silhouette of an axonometric prism map — a flat base quadrilateral
  // with 4 short prisms in back and 3 tall prisms in front to show the
  // height-encodes-value rule. No labels, no axis.

  // Base plane (back rhombus) corners.
  const basePoly = "14,44 72,32 114,50 60,64";

  // A helper to render one prism: base polygon at z=0, top polygon at z=h,
  // two visible side quads (front-right and front-left), plus top face.
  // All coordinates are hand-placed to avoid runtime math.

  type Prism = {
    // base rhombus corners: back-left, back-right, front-right, front-left
    bl: [number, number];
    br: [number, number];
    fr: [number, number];
    fl: [number, number];
    h: number; // height in pixels
    opTop: number;
    opSide: number;
  };

  const prisms: Prism[] = [
    // Back row (short)
    { bl: [18, 20], br: [32, 18], fr: [34, 24], fl: [20, 26], h: 6, opTop: 0.18, opSide: 0.28 },
    { bl: [34, 18], br: [50, 16], fr: [52, 22], fl: [36, 24], h: 4, opTop: 0.16, opSide: 0.26 },
    { bl: [52, 16], br: [68, 14], fr: [70, 20], fl: [54, 22], h: 10, opTop: 0.2, opSide: 0.3 },
    { bl: [78, 16], br: [94, 18], fr: [94, 24], fl: [78, 22], h: 24, opTop: 0.2, opSide: 0.3 },
    // Front row (taller — the prism-map punchline)
    { bl: [20, 30], br: [36, 32], fr: [38, 44], fl: [22, 42], h: 44, opTop: 0.28, opSide: 0.38 },
    { bl: [46, 34], br: [64, 36], fr: [66, 48], fl: [48, 46], h: 34, opTop: 0.24, opSide: 0.34 },
    { bl: [78, 36], br: [94, 38], fr: [94, 48], fl: [78, 46], h: 26, opTop: 0.22, opSide: 0.32 },
  ];

  const pathOfQuad = (a: [number, number], b: [number, number], c: [number, number], d: [number, number]) =>
    `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Base plane */}
      <polygon points={basePoly} fill="var(--color-ink)" fillOpacity={0.06} stroke="var(--color-hairline)" strokeWidth={0.5} />

      {prisms.map((pr, i) => {
        const topBL: [number, number] = [pr.bl[0], pr.bl[1] - pr.h];
        const topBR: [number, number] = [pr.br[0], pr.br[1] - pr.h];
        const topFR: [number, number] = [pr.fr[0], pr.fr[1] - pr.h];
        const topFL: [number, number] = [pr.fl[0], pr.fl[1] - pr.h];
        return (
          <g key={i}>
            {/* Front-right side face (visible) */}
            <path
              d={pathOfQuad(pr.br, pr.fr, topFR, topBR)}
              fill="var(--color-ink)"
              fillOpacity={pr.opSide}
              stroke="var(--color-ink)"
              strokeOpacity={0.4}
              strokeWidth={0.4}
            />
            {/* Front-left side face (visible) */}
            <path
              d={pathOfQuad(pr.fl, pr.fr, topFR, topFL)}
              fill="var(--color-ink)"
              fillOpacity={pr.opSide * 0.85}
              stroke="var(--color-ink)"
              strokeOpacity={0.4}
              strokeWidth={0.4}
            />
            {/* Top face */}
            <path
              d={pathOfQuad(topBL, topBR, topFR, topFL)}
              fill="var(--color-ink)"
              fillOpacity={pr.opTop}
              stroke="var(--color-ink)"
              strokeOpacity={0.6}
              strokeWidth={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}
