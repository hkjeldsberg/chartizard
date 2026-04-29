export function ChernoffFacesThumbnail() {
  // Six tiny faces in a 3×2 lattice, each with different features.
  // Face params: [rx, ry, eyeR, eyeSep, noseLen, mouthCurve, mouthW]
  //   mouthCurve: negative = frown, positive = smile
  const faces: {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    eyeR: number;
    eyeSep: number;
    noseLen: number;
    mouthCurve: number;
    mouthW: number;
  }[] = [
    { cx: 22, cy: 22, rx: 13, ry: 15, eyeR: 1.4, eyeSep: 4, noseLen: 3, mouthCurve: 2, mouthW: 5 },
    { cx: 60, cy: 22, rx: 15, ry: 15, eyeR: 2.2, eyeSep: 5, noseLen: 5, mouthCurve: -2.5, mouthW: 4 },
    { cx: 98, cy: 22, rx: 12, ry: 15, eyeR: 1.6, eyeSep: 3.5, noseLen: 4, mouthCurve: 1.2, mouthW: 6 },
    { cx: 22, cy: 56, rx: 14, ry: 15, eyeR: 2.6, eyeSep: 4.5, noseLen: 6, mouthCurve: -3, mouthW: 5 },
    { cx: 60, cy: 56, rx: 13, ry: 15, eyeR: 1.8, eyeSep: 4, noseLen: 4, mouthCurve: 2.8, mouthW: 6 },
    { cx: 98, cy: 56, rx: 15, ry: 15, eyeR: 2.0, eyeSep: 5.5, noseLen: 3, mouthCurve: -1, mouthW: 4 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {faces.map((f, i) => {
        const eyeY = f.cy - 3;
        const noseY1 = f.cy - 0.5;
        const noseY2 = noseY1 + f.noseLen;
        const mouthY = f.cy + 6;
        const mouthPath = `M ${f.cx - f.mouthW} ${mouthY} Q ${f.cx} ${
          mouthY + f.mouthCurve
        }, ${f.cx + f.mouthW} ${mouthY}`;
        return (
          <g key={i}>
            <ellipse
              cx={f.cx}
              cy={f.cy}
              rx={f.rx}
              ry={f.ry}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="0.9"
            />
            <circle
              cx={f.cx - f.eyeSep}
              cy={eyeY}
              r={f.eyeR}
              fill="var(--color-ink)"
            />
            <circle
              cx={f.cx + f.eyeSep}
              cy={eyeY}
              r={f.eyeR}
              fill="var(--color-ink)"
            />
            <line
              x1={f.cx}
              x2={f.cx}
              y1={noseY1}
              y2={noseY2}
              stroke="var(--color-ink)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d={mouthPath}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
