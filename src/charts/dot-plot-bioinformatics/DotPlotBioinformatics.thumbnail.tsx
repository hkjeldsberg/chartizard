export function DotPlotBioinformaticsThumbnail() {
  // 120×80 thumbnail — silhouette of a bioinformatics dot plot.
  // Shows the characteristic main diagonal + an offset segment + a few noise dots.
  const SIZE = 54; // matrix area size (square)
  const OX = 32;  // origin x (left margin for y-axis tick space)
  const OY = 12;  // origin y (top margin)

  // Dot positions along main diagonal (i==j), offset of +3 around halfway
  const mainDots: [number, number][] = [];
  const step = SIZE / 12;
  for (let k = 0; k < 7; k++) {
    mainDots.push([OX + k * step, OY + k * step]);
  }
  // Offset segment: shift j by +3 steps
  for (let k = 7; k < 12; k++) {
    mainDots.push([OX + k * step, OY + (k + 3) * step * 0.75]);
  }

  const noiseDots: [number, number][] = [
    [OX + 8, OY + 42],
    [OX + 30, OY + 10],
    [OX + 48, OY + 20],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Matrix background */}
      <rect x={OX} y={OY} width={SIZE} height={SIZE} fill="var(--color-ink)" fillOpacity="0.05" />

      {/* Light gridlines */}
      {[18, 36].map((d, i) => (
        <g key={i}>
          <line
            x1={OX + d}
            x2={OX + d}
            y1={OY}
            y2={OY + SIZE}
            stroke="var(--color-hairline)"
            strokeWidth="0.5"
          />
          <line
            x1={OX}
            x2={OX + SIZE}
            y1={OY + d}
            y2={OY + d}
            stroke="var(--color-hairline)"
            strokeWidth="0.5"
          />
        </g>
      ))}

      {/* Main diagonal + offset dots */}
      {mainDots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" fill="var(--color-ink)" fillOpacity="0.85" />
      ))}

      {/* Noise dots */}
      {noiseDots.map(([cx, cy], i) => (
        <circle key={`n${i}`} cx={cx} cy={cy} r="1.2" fill="var(--color-ink)" fillOpacity="0.5" />
      ))}

      {/* Axis lines */}
      <line x1={OX} y1={OY} x2={OX} y2={OY + SIZE + 4} stroke="var(--color-ink-mute)" strokeWidth="0.8" />
      <line x1={OX - 4} y1={OY + SIZE} x2={OX + SIZE} y2={OY + SIZE} stroke="var(--color-ink-mute)" strokeWidth="0.8" />

      {/* Axis labels */}
      <text x={OX + SIZE / 2} y="76" textAnchor="middle" fontSize="6" fill="var(--color-ink-soft)" fontFamily="monospace">
        Seq 1
      </text>
      <text
        x="10"
        y={OY + SIZE / 2}
        textAnchor="middle"
        fontSize="6"
        fill="var(--color-ink-soft)"
        fontFamily="monospace"
        transform={`rotate(-90, 10, ${OY + SIZE / 2})`}
      >
        Seq 2
      </text>
    </svg>
  );
}
