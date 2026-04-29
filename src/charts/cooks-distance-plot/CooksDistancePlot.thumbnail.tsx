export function CooksDistanceThumbnail() {
  // Stem-plot silhouette: baseline, ~12 short stems, 2 clearly tall stems
  // representing influential observations above the threshold line.
  const stems = [
    { x: 14, h: 6 },
    { x: 20, h: 4 },
    { x: 26, h: 8 },
    { x: 32, h: 5 },
    { x: 38, h: 7 },
    { x: 44, h: 28 }, // influential obs
    { x: 50, h: 6 },
    { x: 56, h: 4 },
    { x: 62, h: 9 },
    { x: 68, h: 5 },
    { x: 74, h: 22 }, // influential obs
    { x: 80, h: 6 },
    { x: 86, h: 4 },
    { x: 92, h: 7 },
    { x: 98, h: 5 },
    { x: 104, h: 8 },
  ];
  const baseline = 65;
  const thresholdY = baseline - 14; // threshold line

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* y-axis */}
      <line x1="10" y1="10" x2="10" y2={baseline} stroke="var(--color-hairline)" />
      {/* x-axis / baseline */}
      <line x1="10" y1={baseline} x2="112" y2={baseline} stroke="var(--color-hairline)" />

      {/* Threshold line */}
      <line
        x1="10"
        y1={thresholdY}
        x2="112"
        y2={thresholdY}
        stroke="var(--color-ink)"
        strokeOpacity="0.4"
        strokeWidth="0.8"
        strokeDasharray="3 2"
      />

      {/* Stems */}
      {stems.map((s, i) => {
        const isInfluential = s.h > 20;
        return (
          <g key={i}>
            <line
              x1={s.x}
              y1={baseline}
              x2={s.x}
              y2={baseline - s.h}
              stroke="var(--color-ink)"
              strokeWidth={isInfluential ? 1.5 : 0.9}
              strokeOpacity={isInfluential ? 1 : 0.7}
            />
            <circle
              cx={s.x}
              cy={baseline - s.h}
              r={isInfluential ? 2 : 1.2}
              fill="var(--color-ink)"
              fillOpacity={isInfluential ? 1 : 0.7}
            />
          </g>
        );
      })}
    </svg>
  );
}
