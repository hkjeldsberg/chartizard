export function VolcanoThumbnail() {
  // Dense bulk near the origin, sparse significant points in the upper
  // corners, threshold lines sketched in.
  const bulk: ReadonlyArray<[number, number]> = [
    [56, 58], [60, 56], [54, 54], [62, 60], [58, 52], [64, 58], [52, 58],
    [66, 54], [50, 60], [58, 62], [60, 50], [54, 62], [64, 50], [50, 56],
    [68, 56], [48, 58], [66, 62], [46, 62], [70, 60], [44, 56], [72, 58],
    [42, 60], [58, 48], [62, 48], [56, 46], [52, 48], [66, 46], [48, 48],
    [74, 54], [40, 54],
  ];
  const upCorner: ReadonlyArray<[number, number]> = [
    [86, 32], [92, 28], [96, 24], [90, 36], [100, 20], [88, 40], [94, 38],
  ];
  const downCorner: ReadonlyArray<[number, number]> = [
    [34, 32], [28, 28], [22, 24], [32, 38], [20, 36], [30, 40], [24, 44],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1={12} y1={68} x2={112} y2={68} stroke="var(--color-hairline)" />
      <line x1={12} y1={10} x2={12} y2={68} stroke="var(--color-hairline)" />

      {/* FC thresholds */}
      <line
        x1={46}
        y1={10}
        x2={46}
        y2={68}
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeDasharray="2 2"
      />
      <line
        x1={78}
        y1={10}
        x2={78}
        y2={68}
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeDasharray="2 2"
      />
      {/* Significance threshold */}
      <line
        x1={12}
        y1={44}
        x2={112}
        y2={44}
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeDasharray="2 2"
      />

      {bulk.map(([x, y], i) => (
        <circle key={`b-${i}`} cx={x} cy={y} r={1.2} fill="var(--color-ink-mute)" opacity={0.5} />
      ))}
      {upCorner.map(([x, y], i) => (
        <circle key={`u-${i}`} cx={x} cy={y} r={1.6} fill="var(--color-ink)" />
      ))}
      {downCorner.map(([x, y], i) => (
        <circle key={`d-${i}`} cx={x} cy={y} r={1.6} fill="var(--color-ink)" />
      ))}

      {/* Two headline hits, ringed */}
      <circle cx={96} cy={22} r={2.4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <circle cx={24} cy={22} r={2.4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
    </svg>
  );
}
