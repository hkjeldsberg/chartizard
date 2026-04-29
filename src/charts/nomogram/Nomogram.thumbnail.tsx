export function NomogramThumbnail() {
  // Four vertical scales with a diagonal isopleth line threading through them
  const scaleXs = [18, 44, 70, 102];
  const scaleTop = 12;
  const scaleBot = 68;
  // Isopleth intersection y positions (evenly spaced pattern for visual clarity)
  const isoY = [30, 38, 26, 48];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Vertical scale lines */}
      {scaleXs.map((x) => (
        <line
          key={x}
          x1={x}
          y1={scaleTop}
          x2={x}
          y2={scaleBot}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
      ))}
      {/* Tick marks on each scale */}
      {scaleXs.map((x, si) =>
        Array.from({ length: 5 }, (_, i) => {
          const y = scaleTop + (i / 4) * (scaleBot - scaleTop);
          const side = si % 2 === 0 ? -4 : 4;
          return (
            <line
              key={`${x}-${i}`}
              x1={x}
              y1={y}
              x2={x + side}
              y2={y}
              stroke="var(--color-ink)"
              strokeWidth={0.8}
            />
          );
        }),
      )}
      {/* Isopleth dashed line */}
      <polyline
        points={scaleXs.map((x, i) => `${x},${isoY[i]}`).join(" ")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeDasharray="3 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Intersection dots */}
      {scaleXs.map((x, i) => (
        <circle key={x} cx={x} cy={isoY[i]} r={2} fill="var(--color-ink)" />
      ))}
      {/* Scale cap lines */}
      {scaleXs.map((x) => (
        <g key={`cap-${x}`}>
          <line x1={x - 3} y1={scaleTop} x2={x + 3} y2={scaleTop} stroke="var(--color-ink)" strokeWidth={1} />
          <line x1={x - 3} y1={scaleBot} x2={x + 3} y2={scaleBot} stroke="var(--color-ink)" strokeWidth={1} />
        </g>
      ))}
    </svg>
  );
}
