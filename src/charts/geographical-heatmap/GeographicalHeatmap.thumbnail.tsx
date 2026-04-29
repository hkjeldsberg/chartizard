export function GeographicalHeatmapThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* City grid base */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={`v${i}`}
          x1={10 + i * 17}
          y1={8}
          x2={10 + i * 17}
          y2={72}
          stroke="var(--color-hairline)"
          strokeWidth={0.5}
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`h${i}`}
          x1={10}
          y1={8 + i * 16}
          x2={95}
          y2={8 + i * 16}
          stroke="var(--color-hairline)"
          strokeWidth={0.5}
        />
      ))}
      {/* Outer border */}
      <rect x={10} y={8} width={85} height={64} fill="none" stroke="var(--color-hairline)" strokeWidth={0.8} />
      {/* Diagonal street */}
      <line x1={14} y1={68} x2={91} y2={12} stroke="var(--color-ink)" strokeWidth={0.8} strokeOpacity={0.25} strokeDasharray="3 2" />
      {/* Hotspot A — central (largest) */}
      <ellipse cx={52} cy={42} rx={20} ry={20} fill="url(#th-ra)" />
      {/* Hotspot B — lower left */}
      <ellipse cx={24} cy={58} rx={13} ry={13} fill="url(#th-rb)" />
      {/* Hotspot C — upper right */}
      <ellipse cx={78} cy={22} rx={10} ry={10} fill="url(#th-rc)" />
      {/* Legend strip */}
      <defs>
        <radialGradient id="th-ra" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(220,55,10)" stopOpacity="0.85" />
          <stop offset="50%" stopColor="rgb(245,140,30)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="rgb(255,210,80)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="th-rb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(220,55,10)" stopOpacity="0.78" />
          <stop offset="55%" stopColor="rgb(245,140,30)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="rgb(255,210,80)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="th-rc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(220,55,10)" stopOpacity="0.72" />
          <stop offset="60%" stopColor="rgb(245,140,30)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="rgb(255,210,80)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="th-leg" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgb(255,210,80)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="rgb(210,40,10)" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x={100} y={20} width={8} height={42} fill="url(#th-leg)" />
      <rect x={100} y={20} width={8} height={42} fill="none" stroke="var(--color-hairline)" strokeWidth={0.4} />
    </svg>
  );
}
