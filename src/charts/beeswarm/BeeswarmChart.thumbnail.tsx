export function BeeswarmThumbnail() {
  // Four swarms, each a small cluster of dots packed around a faint centre
  // line. Vertical position is each point's value; horizontal offset exists
  // only because the packer had to move the dot out of the way. Middle
  // swarms are tighter (tall + narrow); outer swarms are more dispersed.
  const r = 1.6;
  const swarms: { cx: number; points: [number, number][] }[] = [
    {
      cx: 24,
      points: [
        [0, 22], [0, 62],
        [-3, 28], [3, 30], [-4, 35], [4, 37], [-2, 42], [2, 43],
        [-3, 48], [3, 49], [-1, 54], [1, 55], [-2, 58],
      ],
    },
    {
      cx: 52,
      points: [
        [0, 20], [0, 64],
        [-2, 26], [2, 28], [-3, 32], [3, 33], [-2, 38], [2, 39],
        [0, 43], [-3, 46], [3, 47], [-2, 52], [2, 53], [0, 58],
      ],
    },
    {
      cx: 80,
      points: [
        [0, 24], [0, 60],
        [-2, 30], [2, 31], [0, 35], [-3, 39], [3, 40], [-2, 44],
        [2, 45], [0, 49], [-2, 53], [2, 54], [0, 58],
      ],
    },
    {
      cx: 104,
      points: [
        [0, 28], [0, 56],
        [-2, 32], [2, 33], [0, 37], [-3, 41], [3, 42], [-2, 46],
        [2, 47], [0, 50], [-2, 53],
      ],
    },
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {swarms.map((s, si) => (
        <g key={si}>
          <line
            x1={s.cx}
            y1={18}
            x2={s.cx}
            y2={66}
            stroke="var(--color-hairline)"
            strokeDasharray="1 3"
          />
          {s.points.map(([dx, y], i) => (
            <circle
              key={i}
              cx={s.cx + dx}
              cy={y}
              r={r}
              fill="var(--color-ink)"
              fillOpacity="0.85"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
