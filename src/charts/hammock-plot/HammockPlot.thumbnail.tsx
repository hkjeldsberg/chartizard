// Hammock-plot thumbnail: four axis posts, three sets of narrowing bands
// between them. The waist-narrowing is the identifying silhouette — a
// straight-edged ribbon set would read as parallel-sets.

interface Band {
  x0: number;
  x1: number;
  sy0: number;
  sy1: number;
  ty0: number;
  ty1: number;
  opacity: number;
}

function bandPath(b: Band): string {
  const q1x = b.x0 + (b.x1 - b.x0) * 0.25;
  const q2x = b.x0 + (b.x1 - b.x0) * 0.75;
  const mx = (b.x0 + b.x1) / 2;
  // Narrowed waist at midpoint, pinched to ~40% of the smaller end-width.
  const srcMid = (b.sy0 + b.sy1) / 2;
  const tgtMid = (b.ty0 + b.ty1) / 2;
  const midline = (srcMid + tgtMid) / 2;
  const endW = Math.min(b.sy1 - b.sy0, b.ty1 - b.ty0);
  const half = (endW * 0.4) / 2;
  const my0 = midline - half;
  const my1 = midline + half;
  return [
    `M ${b.x0},${b.sy0}`,
    `C ${q1x},${b.sy0} ${q1x},${my0} ${mx},${my0}`,
    `C ${q2x},${my0} ${q2x},${b.ty0} ${b.x1},${b.ty0}`,
    `L ${b.x1},${b.ty1}`,
    `C ${q2x},${b.ty1} ${q2x},${my1} ${mx},${my1}`,
    `C ${q1x},${my1} ${q1x},${b.sy1} ${b.x0},${b.sy1}`,
    "Z",
  ].join(" ");
}

export function HammockPlotThumbnail() {
  // Four axis posts — Class / Sex / Age / Survived.
  const X = [12, 48, 78, 108];
  const POST_W = 2;

  // Axis segments, stacked. All four axes carry the same population, so
  // their stacked heights are each ~60 (8..68).
  const cls = [
    { y0: 8,  y1: 16 },  // 1st
    { y0: 18, y1: 26 },  // 2nd
    { y0: 28, y1: 48 },  // 3rd
    { y0: 50, y1: 68 },  // Crew
  ];
  const sex = [
    { y0: 8,  y1: 54 },  // Male (dominant)
    { y0: 56, y1: 68 },  // Female
  ];
  const age = [
    { y0: 8,  y1: 62 },  // Adult (dominant)
    { y0: 64, y1: 68 },  // Child
  ];
  const surv = [
    { y0: 8,  y1: 48 },  // No (dominant)
    { y0: 50, y1: 68 },  // Yes
  ];

  // Bands: class → sex. Cursors stack incoming/outgoing shares along
  // each segment. Hand-tuned proportions; these are a silhouette, not
  // the Titanic joint table.
  const classToSex: Band[] = [
    // 1st → Male, 1st → Female
    { x0: 12, x1: 48, sy0: 8,  sy1: 11, ty0: 8,  ty1: 12, opacity: 0.32 },
    { x0: 12, x1: 48, sy0: 11, sy1: 16, ty0: 56, ty1: 60, opacity: 0.28 },
    // 2nd → Male, 2nd → Female
    { x0: 12, x1: 48, sy0: 18, sy1: 22, ty0: 12, ty1: 17, opacity: 0.32 },
    { x0: 12, x1: 48, sy0: 22, sy1: 26, ty0: 60, ty1: 63, opacity: 0.28 },
    // 3rd → Male (large), 3rd → Female
    { x0: 12, x1: 48, sy0: 28, sy1: 42, ty0: 17, ty1: 31, opacity: 0.5 },
    { x0: 12, x1: 48, sy0: 42, sy1: 48, ty0: 63, ty1: 66, opacity: 0.34 },
    // Crew → Male (dominant), Crew → Female (sliver)
    { x0: 12, x1: 48, sy0: 50, sy1: 67, ty0: 31, ty1: 54, opacity: 0.52 },
    { x0: 12, x1: 48, sy0: 67, sy1: 68, ty0: 66, ty1: 68, opacity: 0.28 },
  ];

  // Bands: sex → age. Almost everyone Adult.
  const sexToAge: Band[] = [
    { x0: 48, x1: 78, sy0: 8,  sy1: 52, ty0: 8,  ty1: 52, opacity: 0.35 }, // Male → Adult
    { x0: 48, x1: 78, sy0: 52, sy1: 54, ty0: 62, ty1: 65, opacity: 0.28 }, // Male → Child
    { x0: 48, x1: 78, sy0: 56, sy1: 64, ty0: 52, ty1: 60, opacity: 0.38 }, // Female → Adult
    { x0: 48, x1: 78, sy0: 64, sy1: 68, ty0: 65, ty1: 68, opacity: 0.28 }, // Female → Child
  ];

  // Bands: age → survived. Adult split into No (big) + Yes; Child → Yes mostly.
  const ageToSurv: Band[] = [
    { x0: 78, x1: 108, sy0: 8,  sy1: 48, ty0: 8,  ty1: 40, opacity: 0.4 },  // Adult → No
    { x0: 78, x1: 108, sy0: 48, sy1: 62, ty0: 50, ty1: 62, opacity: 0.5 },  // Adult → Yes
    { x0: 78, x1: 108, sy0: 62, sy1: 64, ty0: 40, ty1: 44, opacity: 0.28 }, // Child → No
    { x0: 78, x1: 108, sy0: 64, sy1: 68, ty0: 62, ty1: 68, opacity: 0.5 },  // Child → Yes
  ];

  const allBands = [...classToSex, ...sexToAge, ...ageToSurv];

  const allSegs = [
    ...cls.map((s) => ({ ...s, x: X[0] })),
    ...sex.map((s) => ({ ...s, x: X[1] })),
    ...age.map((s) => ({ ...s, x: X[2] })),
    ...surv.map((s) => ({ ...s, x: X[3] })),
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Bands first — posts on top */}
      {allBands.map((b, i) => (
        <path
          key={`b-${i}`}
          d={bandPath(b)}
          fill="var(--color-ink)"
          opacity={b.opacity}
        />
      ))}

      {/* Axis posts */}
      {allSegs.map((s, i) => (
        <rect
          key={`p-${i}`}
          x={s.x - POST_W / 2}
          y={s.y0}
          width={POST_W}
          height={s.y1 - s.y0}
          fill="var(--color-ink)"
        />
      ))}
    </svg>
  );
}
