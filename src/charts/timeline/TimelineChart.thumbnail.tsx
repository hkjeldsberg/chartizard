export function TimelineThumbnail() {
  // Horizontal spine with 7 markers, staggered labels above/below implied
  // as short stubs. Era band as a soft tint behind the middle.
  const spineY = 40;
  const markers = [14, 28, 40, 56, 72, 88, 104];
  const stubs: Array<[number, number]> = [
    [14, spineY - 10],
    [28, spineY + 10],
    [40, spineY - 16],
    [56, spineY + 16],
    [72, spineY - 10],
    [88, spineY + 10],
    [104, spineY - 16],
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Era band tint */}
      <rect x={38} y={10} width={52} height={60} fill="var(--color-ink)" opacity={0.05} />
      {/* Spine */}
      <line
        x1={8}
        x2={112}
        y1={spineY}
        y2={spineY}
        stroke="var(--color-ink)"
        strokeWidth={1.25}
      />
      {/* Stub connectors (dashed) */}
      {stubs.map(([x, y], i) => (
        <line
          key={`stub-${i}`}
          x1={x}
          x2={x}
          y1={spineY}
          y2={y}
          stroke="var(--color-hairline)"
          strokeWidth={0.75}
        />
      ))}
      {/* Stub label marks — tiny rects representing labels */}
      {stubs.map(([x, y], i) => (
        <rect
          key={`lab-${i}`}
          x={x - 6}
          y={y < spineY ? y - 2 : y - 0}
          width={12}
          height={2}
          fill="var(--color-ink)"
          opacity={0.75}
        />
      ))}
      {/* Markers */}
      {markers.map((x) => (
        <circle key={x} cx={x} cy={spineY} r={2} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
