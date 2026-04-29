export function PieOfPieThumbnail() {
  // Primary pie on the left; smaller "break-out" pie on the right with two
  // dashed connector lines. Slices: 48/18/12/8/14 primary, subdivisions on the
  // secondary.
  const pCx = 36;
  const pCy = 40;
  const pR = 22;
  const sCx = 92;
  const sCy = 40;
  const sR = 14;

  const primary = [0.48, 0.18, 0.12, 0.08, 0.14];
  const primaryOpacities = [0.95, 0.7, 0.5, 0.35, 0.18];

  let startP = -Math.PI / 2;
  const pPaths = primary.map((share, i) => {
    const end = startP + share * Math.PI * 2;
    const x1 = pCx + pR * Math.cos(startP);
    const y1 = pCy + pR * Math.sin(startP);
    const x2 = pCx + pR * Math.cos(end);
    const y2 = pCy + pR * Math.sin(end);
    const large = share > 0.5 ? 1 : 0;
    const d = `M${pCx} ${pCy} L${x1} ${y1} A${pR} ${pR} 0 ${large} 1 ${x2} ${y2} Z`;
    const angleBefore = startP;
    startP = end;
    return { d, i, angleBefore, angleAfter: end };
  });

  // The "Other" slice is the last one; grab its angles for connectors.
  const other = pPaths[pPaths.length - 1];

  const secondary = [0.29, 0.21, 0.14, 0.14, 0.07, 0.07, 0.08];
  const secondaryOpacities = [0.8, 0.6, 0.45, 0.32, 0.22, 0.16, 0.12];

  let startS = -Math.PI / 2;
  const sPaths = secondary.map((share) => {
    const end = startS + share * Math.PI * 2;
    const x1 = sCx + sR * Math.cos(startS);
    const y1 = sCy + sR * Math.sin(startS);
    const x2 = sCx + sR * Math.cos(end);
    const y2 = sCy + sR * Math.sin(end);
    const large = share > 0.5 ? 1 : 0;
    const d = `M${sCx} ${sCy} L${x1} ${y1} A${sR} ${sR} 0 ${large} 1 ${x2} ${y2} Z`;
    startS = end;
    return d;
  });

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Connector lines from "Other" slice edges to the secondary pie */}
      <line
        x1={pCx + pR * Math.cos(other.angleBefore)}
        y1={pCy + pR * Math.sin(other.angleBefore)}
        x2={sCx}
        y2={sCy - sR}
        stroke="var(--color-ink-mute)"
        strokeWidth="0.6"
        strokeDasharray="1.5 2"
      />
      <line
        x1={pCx + pR * Math.cos(other.angleAfter)}
        y1={pCy + pR * Math.sin(other.angleAfter)}
        x2={sCx}
        y2={sCy + sR}
        stroke="var(--color-ink-mute)"
        strokeWidth="0.6"
        strokeDasharray="1.5 2"
      />

      {pPaths.map((p, i) => (
        <path key={`p${i}`} d={p.d} fill="var(--color-ink)" opacity={primaryOpacities[i]} />
      ))}
      {sPaths.map((d, i) => (
        <path key={`s${i}`} d={d} fill="var(--color-ink)" opacity={secondaryOpacities[i]} />
      ))}
      <circle cx={pCx} cy={pCy} r={pR} fill="none" stroke="var(--color-page)" strokeWidth="0.5" />
      <circle cx={sCx} cy={sCy} r={sR} fill="none" stroke="var(--color-page)" strokeWidth="0.5" />
    </svg>
  );
}
