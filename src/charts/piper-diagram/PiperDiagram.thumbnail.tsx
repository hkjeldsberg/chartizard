export function PiperThumbnail() {
  // Miniature Piper diagram: two small equilateral triangles at the bottom,
  // a diamond (rhombus) centred above them, and a handful of dots in each panel.
  // viewBox 120×80.

  const sqrt3Over2 = Math.sqrt(3) / 2;
  const triW = 36;
  const triH = triW * sqrt3Over2;

  // Left triangle (cations): bottom-left at (8, 74), bottom-right at (44, 74), apex at (26, 43)
  const lBLx = 8;  const lBLy = 74;
  const lBRx = 44; const lBRy = 74;
  const lTx  = 26; const lTy  = lBLy - triH;

  // Right triangle (anions): bottom-left at (76, 74), bottom-right at (112, 74)
  const rBLx = 76;  const rBLy = 74;
  const rBRx = 112; const rBRy = 74;
  const rTx  = 94;  const rTy  = rBLy - triH;

  // Diamond: centred at (60, ~18), half-diagonal = triW/2 = 18
  const dCx = 60;
  const halfD = 18;
  const dTop    = { x: dCx,         y: 8 };
  const dRight  = { x: dCx + halfD, y: 8 + halfD };
  const dBottom = { x: dCx,         y: 8 + halfD * 2 };
  const dLeft   = { x: dCx - halfD, y: 8 + halfD };

  // Sample points — 5 representative dots in each panel (hand-placed)
  // Carbonate samples: near Ca²⁺ (BL) / HCO₃⁻ (BL) corners
  // Saline samples: near Na⁺+K⁺ (BR) / Cl⁻ (BR) corners
  // Mixed: middle

  // Left triangle barycentric helper
  const lt = (ca: number, nak: number, mg: number) => {
    const x = nak + mg / 2;
    const y = mg * sqrt3Over2;
    return { x: lBLx + x * triW, y: lBLy - y * triW };
  };
  // Right triangle
  const rt = (hco3: number, cl: number, so4: number) => {
    const x = cl + so4 / 2;
    const y = so4 * sqrt3Over2;
    return { x: rBLx + x * triW, y: rBLy - y * triW };
  };
  // Diamond
  const dm = (xf: number, yf: number) => ({
    x: dCx + (xf - yf) * halfD,
    y: (dTop.y + halfD) - (xf + yf - 1) * halfD,
  });

  const catPts = [
    lt(0.72, 0.10, 0.18),
    lt(0.65, 0.13, 0.22),
    lt(0.10, 0.75, 0.15),
    lt(0.45, 0.25, 0.30),
    lt(0.25, 0.55, 0.20),
  ];
  const anPts = [
    rt(0.78, 0.08, 0.14),
    rt(0.70, 0.12, 0.18),
    rt(0.05, 0.85, 0.10),
    rt(0.48, 0.24, 0.28),
    rt(0.20, 0.62, 0.18),
  ];
  const diamPts = [
    dm(0.08, 0.10),
    dm(0.12, 0.13),
    dm(0.85, 0.75),
    dm(0.24, 0.25),
    dm(0.62, 0.55),
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Left (cation) triangle */}
      <polygon
        points={`${lBLx},${lBLy} ${lBRx},${lBRy} ${lTx},${lTy}`}
        fill="var(--color-ink)"
        fillOpacity={0.03}
        stroke="var(--color-ink)"
        strokeWidth={0.9}
      />
      {/* Right (anion) triangle */}
      <polygon
        points={`${rBLx},${rBLy} ${rBRx},${rBRy} ${rTx},${rTy}`}
        fill="var(--color-ink)"
        fillOpacity={0.03}
        stroke="var(--color-ink)"
        strokeWidth={0.9}
      />
      {/* Diamond */}
      <polygon
        points={`${dTop.x},${dTop.y} ${dRight.x},${dRight.y} ${dBottom.x},${dBottom.y} ${dLeft.x},${dLeft.y}`}
        fill="var(--color-ink)"
        fillOpacity={0.03}
        stroke="var(--color-ink)"
        strokeWidth={0.9}
      />
      {/* 50% gridlines in each panel */}
      {/* Cation 50% parallels */}
      <line x1={lt(0.5, 0.5, 0).x} y1={lt(0.5, 0.5, 0).y}
            x2={lt(0.5, 0, 0.5).x} y2={lt(0.5, 0, 0.5).y}
            stroke="var(--color-hairline)" />
      <line x1={lt(0, 0.5, 0.5).x} y1={lt(0, 0.5, 0.5).y}
            x2={lt(0.5, 0.5, 0).x} y2={lt(0.5, 0.5, 0).y}
            stroke="var(--color-hairline)" />
      {/* Anion 50% parallels */}
      <line x1={rt(0.5, 0.5, 0).x} y1={rt(0.5, 0.5, 0).y}
            x2={rt(0.5, 0, 0.5).x} y2={rt(0.5, 0, 0.5).y}
            stroke="var(--color-hairline)" />
      <line x1={rt(0, 0.5, 0.5).x} y1={rt(0, 0.5, 0.5).y}
            x2={rt(0.5, 0.5, 0).x} y2={rt(0.5, 0.5, 0).y}
            stroke="var(--color-hairline)" />
      {/* Sample dots */}
      {catPts.map((p, i) => (
        <circle key={`c${i}`} cx={p.x} cy={p.y} r={1.5} fill="var(--color-ink)" />
      ))}
      {anPts.map((p, i) => (
        <circle key={`a${i}`} cx={p.x} cy={p.y} r={1.5} fill="var(--color-ink)" />
      ))}
      {diamPts.map((p, i) => (
        <circle key={`d${i}`} cx={p.x} cy={p.y} r={1.5} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
