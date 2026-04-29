export function SwotAnalysisThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer border */}
      <rect
        x={10}
        y={8}
        width={100}
        height={64}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Cell tints — positive cells (TL, BL) warm, negative (TR, BR) warm */}
      <rect x={10} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.06} />
      <rect x={60} y={8} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.12} />
      <rect x={10} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.06} />
      <rect x={60} y={40} width={50} height={32} fill="var(--color-ink)" fillOpacity={0.12} />

      {/* Vertical + horizontal dividers */}
      <line x1={60} y1={8} x2={60} y2={72} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={10} y1={40} x2={110} y2={40} stroke="var(--color-ink)" strokeWidth={1.2} />

      {/* Cell labels (S / W / O / T) */}
      <text
        x={35}
        y={26}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fontWeight={600}
        fill="var(--color-ink)"
      >
        S
      </text>
      <text
        x={85}
        y={26}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fontWeight={600}
        fill="var(--color-ink)"
      >
        W
      </text>
      <text
        x={35}
        y={58}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fontWeight={600}
        fill="var(--color-ink)"
      >
        O
      </text>
      <text
        x={85}
        y={58}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fontWeight={600}
        fill="var(--color-ink)"
      >
        T
      </text>

      {/* Faint item dots to suggest bullet content */}
      {[
        [18, 32], [24, 32], [30, 32],
        [68, 32], [74, 32], [80, 32],
        [18, 64], [24, 64], [30, 64],
        [68, 64], [74, 64], [80, 64],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill="var(--color-ink-mute)" />
      ))}
    </svg>
  );
}
