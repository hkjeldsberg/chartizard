export function SinaThumbnail() {
  // Three sina clouds: narrow (tight, unimodal), middle (moderate spread),
  // wide (dispersed, wider at the mode). Jitter width = local density, so
  // clouds bulge at the middle and pinch at the tails — the hallmark of
  // "a violin made of dots".
  const clouds: { cx: number; points: [number, number][] }[] = [
    {
      cx: 28,
      points: [
        [0, 22], [-1, 28], [1, 30], [-2, 36], [2, 37], [-1, 42], [1, 43],
        [-2, 46], [2, 47], [-1, 52], [0, 56], [0, 60],
      ],
    },
    {
      cx: 62,
      points: [
        [0, 20], [-2, 26], [2, 27], [-3, 32], [3, 33], [-4, 38], [4, 39],
        [-3, 44], [3, 45], [-2, 50], [2, 51], [-1, 56], [0, 60],
      ],
    },
    {
      cx: 96,
      points: [
        [0, 22], [-3, 28], [3, 29], [-5, 34], [5, 35], [-6, 40], [6, 41],
        [-5, 46], [5, 47], [-3, 52], [3, 53], [-1, 58],
      ],
    },
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {clouds.map((c, ci) => (
        <g key={ci}>
          <line
            x1={c.cx}
            y1={18}
            x2={c.cx}
            y2={66}
            stroke="var(--color-hairline)"
            strokeDasharray="1 3"
          />
          {c.points.map(([dx, y], i) => (
            <circle
              key={i}
              cx={c.cx + dx}
              cy={y}
              r="1.5"
              fill="var(--color-ink)"
              fillOpacity="0.8"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
