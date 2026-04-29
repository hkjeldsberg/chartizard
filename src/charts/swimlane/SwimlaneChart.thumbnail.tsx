// Swimlane silhouette: three horizontal lanes (alternating tint),
// small boxes positioned in lanes, and a couple of elbow-shaped
// cross-lane handoff arrows. Hand-drawn; no layout lib.

export function SwimlaneThumbnail() {
  const lanes = [
    { y: 8, h: 18, tint: true },
    { y: 28, h: 18, tint: false },
    { y: 48, h: 18, tint: true },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Lane backgrounds */}
      {lanes.map((lane, i) => (
        <rect
          key={`bg-${i}`}
          x={2}
          y={lane.y}
          width={116}
          height={lane.h}
          fill="var(--color-hairline)"
          opacity={lane.tint ? 0.35 : 0}
        />
      ))}

      {/* Lane dividers */}
      <line
        x1={2}
        y1={8}
        x2={118}
        y2={8}
        stroke="var(--color-hairline)"
        strokeWidth={1}
      />
      <line
        x1={2}
        y1={26}
        x2={118}
        y2={26}
        stroke="var(--color-hairline)"
        strokeWidth={1}
      />
      <line
        x1={2}
        y1={46}
        x2={118}
        y2={46}
        stroke="var(--color-hairline)"
        strokeWidth={1}
      />
      <line
        x1={2}
        y1={66}
        x2={118}
        y2={66}
        stroke="var(--color-hairline)"
        strokeWidth={1}
      />

      {/* Lane-label stubs (just tiny tick marks to suggest roles) */}
      <line x1={2} y1={17} x2={8} y2={17} stroke="var(--color-ink-mute)" strokeWidth={1.2} />
      <line x1={2} y1={37} x2={8} y2={37} stroke="var(--color-ink-mute)" strokeWidth={1.2} />
      <line x1={2} y1={57} x2={8} y2={57} stroke="var(--color-ink-mute)" strokeWidth={1.2} />

      {/* Arrows (behind boxes) */}
      {/* Same-lane horizontal arrow in lane 0 */}
      <line x1={30} y1={17} x2={42} y2={17} stroke="var(--color-ink-mute)" strokeWidth={1} />
      <polygon points="44,17 41,15 41,19" fill="var(--color-ink-mute)" />
      {/* Cross-lane: box at lane 0 col 2 down to lane 1 col 3 */}
      <path
        d="M 62 17 L 70 17 L 70 37 L 78 37"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />
      <polygon points="80,37 77,35 77,39" fill="var(--color-ink-mute)" />
      {/* Cross-lane: lane 1 → lane 2 (another handoff) */}
      <path
        d="M 98 37 L 106 37 L 106 57 L 98 57"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
      />
      <polygon points="96,57 99,55 99,59" fill="var(--color-ink-mute)" />

      {/* Boxes */}
      <rect x={12} y={12} width={18} height={10} rx={2} ry={2} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={44} y={12} width={18} height={10} rx={2} ry={2} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={80} y={32} width={18} height={10} rx={2} ry={2} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={78} y={52} width={18} height={10} rx={2} ry={2} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
    </svg>
  );
}
