export function GanttThumbnail() {
  // Six rows, staggered bars approximating the critical-path diagonal.
  // [rowY, startX, endX, isCritical]
  const bars: Array<[number, number, number, boolean]> = [
    [14, 10, 28, true],  // Discovery
    [26, 22, 48, true],  // Design
    [38, 34, 70, true],  // API
    [50, 46, 82, false], // Frontend (parallel)
    [62, 64, 94, true],  // QA
  ];
  const milestoneX = 100;
  const milestoneY = 74;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Week gridlines */}
      {[10, 28, 46, 64, 82, 100].map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1={8}
          y2={76}
          stroke="var(--color-hairline)"
        />
      ))}
      {/* Bars */}
      {bars.map(([y, x1, x2, crit], i) => (
        <rect
          key={i}
          x={x1}
          y={y - 3}
          width={x2 - x1}
          height={6}
          fill="var(--color-ink)"
          opacity={crit ? 0.95 : 0.45}
        />
      ))}
      {/* Milestone diamond */}
      <polygon
        points={`${milestoneX},${milestoneY - 4} ${milestoneX + 4},${milestoneY} ${milestoneX},${milestoneY + 4} ${milestoneX - 4},${milestoneY}`}
        fill="var(--color-ink)"
      />
    </svg>
  );
}
