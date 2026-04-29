export function HertzsprungRussellThumbnail() {
  // Diagonal main-sequence band (top-left to bottom-right), one labelled-ish
  // star near the top-left (O star), a red-giant cluster upper-right, a
  // white-dwarf cluster bottom-left.
  const mainSeq: ReadonlyArray<[number, number]> = [
    [22, 20],
    [30, 26],
    [36, 30],
    [42, 34],
    [48, 38],
    [54, 42],
    [60, 46],
    [66, 50],
    [72, 54],
    [78, 58],
    [86, 60],
    [94, 62],
    [102, 64],
    // Slight scatter
    [34, 28],
    [46, 36],
    [58, 44],
    [70, 52],
    [82, 58],
    [96, 62],
  ];
  const giants: ReadonlyArray<[number, number]> = [
    [78, 30],
    [84, 28],
    [90, 32],
    [86, 24],
    [94, 28],
    [82, 34],
  ];
  const dwarfs: ReadonlyArray<[number, number]> = [
    [36, 58],
    [30, 60],
    [42, 58],
    [34, 62],
    [40, 54],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1={12} y1={68} x2={112} y2={68} stroke="var(--color-hairline)" />
      <line x1={12} y1={10} x2={12} y2={68} stroke="var(--color-hairline)" />

      {/* Main sequence diagonal */}
      {mainSeq.map(([x, y], i) => (
        <circle
          key={`m-${i}`}
          cx={x}
          cy={y}
          r={1.3}
          fill="var(--color-ink)"
          opacity={0.8}
        />
      ))}

      {/* One headline hot/bright star top-left */}
      <circle
        cx={18}
        cy={16}
        r={2.2}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Red giants upper-right */}
      {giants.map(([x, y], i) => (
        <circle key={`g-${i}`} cx={x} cy={y} r={1.6} fill="var(--color-ink)" />
      ))}

      {/* White dwarfs bottom-left cluster */}
      {dwarfs.map(([x, y], i) => (
        <circle key={`d-${i}`} cx={x} cy={y} r={1.4} fill="var(--color-ink)" />
      ))}

      {/* Tiny arrow to hint at reversed T-axis */}
      <text
        x={16}
        y={76}
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill="var(--color-ink-mute)"
      >
        HOT
      </text>
      <text
        x={96}
        y={76}
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill="var(--color-ink-mute)"
      >
        COOL
      </text>
    </svg>
  );
}
