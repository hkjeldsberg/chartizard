export function PictorialPercentageThumbnail() {
  // 10×10 grid of stick-figure women. 13 shaded (bottom two rows — 10 + 3),
  // 87 hairline. The thumbnail mirrors the live chart's bottom-up fill so the
  // shaded cluster forms a compact base.
  const cols = 10;
  const rows = 10;
  const cell = 7;
  const shaded = 13;
  const gridW = cols * cell;
  const gridH = rows * cell;
  const left = (120 - gridW) / 2;
  const top = 10;
  const iconScale = (cell * 0.78) / 20;

  function figure(x: number, y: number, isShaded: boolean, key: string) {
    const stroke = isShaded ? "var(--color-ink)" : "var(--color-hairline)";
    const strokeW = isShaded ? 0.9 : 0.55;
    return (
      <g key={key} transform={`translate(${x},${y}) scale(${iconScale})`}>
        <circle
          cx={10}
          cy={3.5}
          r={2}
          fill={isShaded ? "var(--color-ink)" : "none"}
          stroke={isShaded ? "none" : stroke}
          strokeWidth={isShaded ? 0 : strokeW}
        />
        <line x1={10} y1={5.5} x2={10} y2={12} stroke={stroke} strokeWidth={strokeW} />
        <line x1={10} y1={7.5} x2={5.5} y2={10.5} stroke={stroke} strokeWidth={strokeW} />
        <line x1={10} y1={7.5} x2={14.5} y2={10.5} stroke={stroke} strokeWidth={strokeW} />
        <path
          d="M10 11.5 L6.5 15.5 L13.5 15.5 Z"
          fill={isShaded ? "var(--color-ink)" : "none"}
          stroke={stroke}
          strokeWidth={strokeW}
        />
        <line x1={8} y1={15.5} x2={7} y2={19} stroke={stroke} strokeWidth={strokeW} />
        <line x1={12} y1={15.5} x2={13} y2={19} stroke={stroke} strokeWidth={strokeW} />
      </g>
    );
  }

  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const isShaded = i < shaded;
    const yTopIndex = rows - 1 - row;
    const px = left + col * cell + cell * 0.11;
    const py = top + yTopIndex * cell + cell * 0.11;
    nodes.push(figure(px, py, isShaded, `c-${i}`));
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {nodes}
    </svg>
  );
}
