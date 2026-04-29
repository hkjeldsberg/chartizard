export function FlowchartThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Oval (start) */}
      <rect
        x={42}
        y={6}
        width={36}
        height={10}
        rx={5}
        ry={5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Arrow down */}
      <line x1={60} y1={16} x2={60} y2={24} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,26 57,23 63,23" fill="var(--color-ink)" />

      {/* Diamond (decision) */}
      <polygon
        points="60,28 78,40 60,52 42,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* NO branch — left to rectangle */}
      <line x1={42} y1={40} x2={24} y2={40} stroke="var(--color-ink-mute)" strokeWidth={1} />
      <polygon points="22,40 25,38 25,42" fill="var(--color-ink-mute)" />
      <rect
        x={6}
        y={34}
        width={18}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* YES branch down */}
      <line x1={60} y1={52} x2={60} y2={60} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="60,62 57,59 63,59" fill="var(--color-ink)" />

      {/* Rectangle (process) */}
      <rect
        x={42}
        y={62}
        width={36}
        height={10}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Retry loop — dashed edge from left-rect back up to start */}
      <path
        d="M 6 34 L 6 11 L 42 11"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
        strokeDasharray="2 2"
        opacity={0.7}
      />
    </svg>
  );
}
