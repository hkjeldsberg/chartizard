export function GroupedColumnThumbnail() {
  // Four months, three sub-columns per month.
  // Opacities stand in for the three series colours at thumbnail scale.
  const groups = [
    [30, 20, 10], // Jan: core, cloud, services
    [28, 24, 11],
    [26, 28, 12],
    [24, 32, 13],
  ];
  const subW = 6;
  const subGap = 1;
  const groupW = 3 * subW + 2 * subGap;
  const groupGap = 8;
  const baseline = 68;
  const startX = 20;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1={baseline} x2="112" y2={baseline} stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2={baseline} stroke="var(--color-hairline)" />
      {groups.map((bars, gi) => {
        const gx = startX + gi * (groupW + groupGap);
        return (
          <g key={gi}>
            {bars.map((h, bi) => (
              <rect
                key={bi}
                x={gx + bi * (subW + subGap)}
                y={baseline - h}
                width={subW}
                height={h - 0.5}
                fill="var(--color-ink)"
                opacity={0.95 - bi * 0.28}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
