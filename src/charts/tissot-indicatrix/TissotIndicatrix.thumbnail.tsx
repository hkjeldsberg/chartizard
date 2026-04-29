export function TissotIndicatrixThumbnail() {
  // Tiny Mercator silhouette: three rows of circles (equator, mid, high lat)
  // that swell toward the top/bottom, plus a hairline graticule.
  // Columns across, rows stacked — high-lat circles are visibly larger.
  const cols = [18, 42, 66, 90];
  // Rows from top to bottom: high-north (lat 60), mid-north (30), equator,
  // mid-south (-30), high-south (-60). Scale radii by sec(lat).
  const rows: ReadonlyArray<{ y: number; r: number }> = [
    { y: 16, r: 5.2 }, // 60°N  sec=2
    { y: 30, r: 3.8 }, // 30°N  sec≈1.15
    { y: 44, r: 3.0 }, // 0°
    { y: 58, r: 3.8 }, // 30°S
    { y: 70, r: 5.2 }, // 60°S
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Frame */}
      <rect
        x={6}
        y={8}
        width={108}
        height={68}
        fill="none"
        stroke="var(--color-hairline)"
      />
      {/* Meridians */}
      {[30, 54, 78, 102].map((x) => (
        <line
          key={`m-${x}`}
          x1={x}
          x2={x}
          y1={8}
          y2={76}
          stroke="var(--color-hairline)"
        />
      ))}
      {/* Parallels */}
      {rows.map(({ y }) => (
        <line
          key={`p-${y}`}
          x1={6}
          x2={114}
          y1={y}
          y2={y}
          stroke="var(--color-hairline)"
          strokeDasharray={y === 44 ? undefined : "1.5 2"}
        />
      ))}
      {/* Indicatrix circles */}
      {rows.flatMap(({ y, r }, ri) =>
        cols.map((x, ci) => (
          <circle
            key={`c-${ri}-${ci}`}
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
        )),
      )}
    </svg>
  );
}
