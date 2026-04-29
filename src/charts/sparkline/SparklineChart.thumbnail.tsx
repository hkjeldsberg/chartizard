export function SparklineThumbnail() {
  // Axis-less, label-less trend glyph. The whole point of a sparkline is to
  // work at this scale — so the thumbnail is almost the chart itself.
  // Muted baseline at the starting value; small dots at start + end.
  const pts: ReadonlyArray<[number, number]> = [
    [18, 50],
    [28, 48],
    [38, 46],
    [48, 50],
    [58, 56],
    [68, 46],
    [78, 38],
    [88, 34],
    [98, 28],
    [106, 32],
  ];
  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const start = pts[0];
  const end = pts[pts.length - 1];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* muted baseline at starting value */}
      <line
        x1="12"
        y1={start[1]}
        x2="112"
        y2={start[1]}
        stroke="var(--color-ink-mute)"
        strokeWidth="0.8"
        strokeDasharray="1 2"
      />
      <path
        d={path}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={start[0]} cy={start[1]} r="1.4" fill="var(--color-ink)" />
      <circle cx={end[0]} cy={end[1]} r="1.6" fill="var(--color-ink)" />
      {/* tiny inline end-value label, mono feel */}
      <text
        x="110"
        y={end[1] - 6}
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink-soft)"
      >
        195
      </text>
      <text
        x="14"
        y={start[1] + 10}
        textAnchor="start"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink-soft)"
      >
        170
      </text>
    </svg>
  );
}
