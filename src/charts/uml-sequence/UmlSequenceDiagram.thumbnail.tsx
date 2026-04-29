export function UmlSequenceThumbnail() {
  // Three participant boxes across the top, dashed lifelines, two horizontal
  // sync arrows and one dashed return arrow — the recognisable silhouette.
  const lanes = [24, 60, 96];
  const top = 14;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Actor boxes */}
      {lanes.map((x, i) => (
        <rect
          key={`act-${i}`}
          x={x - 10}
          y={4}
          width={20}
          height={12}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.1}
        />
      ))}

      {/* Lifelines */}
      {lanes.map((x, i) => (
        <line
          key={`ll-${i}`}
          x1={x}
          x2={x}
          y1={top + 2}
          y2={74}
          stroke="var(--color-hairline)"
          strokeDasharray="2 3"
        />
      ))}

      {/* Activation bars on middle + right lifelines */}
      <rect x={lanes[1] - 2} y={32} width={4} height={24} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.9} />
      <rect x={lanes[2] - 2} y={44} width={4} height={12} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.9} />

      {/* Sync arrow 1: left → middle */}
      <line x1={lanes[0]} x2={lanes[1] - 4} y1={32} y2={32} stroke="var(--color-ink)" strokeWidth={1.1} />
      <polygon points={`${lanes[1] - 2},32 ${lanes[1] - 6},30 ${lanes[1] - 6},34`} fill="var(--color-ink)" />

      {/* Sync arrow 2: middle → right */}
      <line x1={lanes[1]} x2={lanes[2] - 4} y1={44} y2={44} stroke="var(--color-ink)" strokeWidth={1.1} />
      <polygon points={`${lanes[2] - 2},44 ${lanes[2] - 6},42 ${lanes[2] - 6},46`} fill="var(--color-ink)" />

      {/* Dashed return: right → middle */}
      <line
        x1={lanes[2]}
        x2={lanes[1] + 4}
        y1={56}
        y2={56}
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <polygon points={`${lanes[1] + 2},56 ${lanes[1] + 6},54 ${lanes[1] + 6},58`} fill="var(--color-ink-mute)" />

      {/* Dashed return: middle → left */}
      <line
        x1={lanes[1]}
        x2={lanes[0] + 4}
        y1={68}
        y2={68}
        stroke="var(--color-ink-mute)"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <polygon points={`${lanes[0] + 2},68 ${lanes[0] + 6},66 ${lanes[0] + 6},70`} fill="var(--color-ink-mute)" />
    </svg>
  );
}
