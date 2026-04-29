export function DotMatrixThumbnail() {
  // 5 rows (branches), 10 cols, varying fill counts
  const rows = [
    { label: "A", fill: 8 },
    { label: "N", fill: 4 },
    { label: "AF", fill: 4 },
    { label: "M", fill: 4 },
    { label: "CG", fill: 1 },
  ];
  const cols = 10;
  const dotR = 2.8;
  const colSpacing = 8;
  const rowSpacing = 12;
  const offsetX = 22;
  const offsetY = 10;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((row, ri) =>
        Array.from({ length: cols }, (_, ci) => (
          <circle
            key={`${ri}-${ci}`}
            cx={offsetX + ci * colSpacing + dotR}
            cy={offsetY + ri * rowSpacing + dotR}
            r={dotR}
            fill={ci < row.fill ? "var(--color-ink)" : "transparent"}
            stroke="var(--color-ink)"
            strokeWidth={ci < row.fill ? 0 : 0.5}
            opacity={ci < row.fill ? 0.85 : 0.2}
          />
        ))
      )}
      {rows.map((row, ri) => (
        <text
          key={`lbl-${ri}`}
          x={offsetX - 4}
          y={offsetY + ri * rowSpacing + dotR + 1}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={6}
          fontFamily="monospace"
          fill="var(--color-ink)"
          opacity={0.6}
        >
          {row.label}
        </text>
      ))}
    </svg>
  );
}
