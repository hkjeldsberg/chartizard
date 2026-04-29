export function DalitzPlotThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="14" y1="68" x2="110" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="10" x2="14" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Dalitz boundary — approximately kidney-shaped curved polygon */}
      <path
        d="M 20 66 Q 20 58, 30 48 Q 40 36, 55 28 Q 70 20, 82 22 Q 95 24, 100 34 Q 105 44, 100 56 Q 95 66, 82 66 Z"
        fill="var(--color-ink)"
        fillOpacity="0.05"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />

      {/* K*(892) vertical band */}
      <rect x="43" y="28" width="8" height="38" fill="var(--color-ink)" fillOpacity="0.12" />
      <text x="47" y="74" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5" fill="var(--color-ink-mute)">K*</text>

      {/* ρ(770) horizontal band */}
      <rect x="20" y="44" width="80" height="7" fill="var(--color-ink)" fillOpacity="0.12" />
      <text x="105" y="49" textAnchor="start" fontFamily="var(--font-mono)" fontSize="5" fill="var(--color-ink-mute)">ρ</text>

      {/* Background scatter dots inside the boundary */}
      {[
        [30, 55], [35, 42], [38, 60], [45, 35], [50, 50],
        [55, 40], [58, 62], [62, 45], [65, 38], [68, 55],
        [72, 42], [76, 58], [80, 48], [85, 36], [88, 52],
        [92, 44], [55, 30], [70, 32], [40, 55], [60, 58],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="var(--color-ink)" opacity="0.45" />
      ))}

      {/* Resonance dots — K* band (denser near x=47) */}
      {[
        [44, 36], [45, 48], [46, 58], [47, 40], [48, 52],
        [49, 32], [50, 44],
      ].map(([x, y], i) => (
        <circle key={`k${i}`} cx={x} cy={y} r="1.5" fill="var(--color-ink)" opacity="0.80" />
      ))}

      {/* Resonance dots — ρ band (denser near y=47) */}
      {[
        [33, 46], [52, 47], [63, 45], [74, 46], [84, 48],
        [90, 47],
      ].map(([x, y], i) => (
        <circle key={`r${i}`} cx={x} cy={y} r="1.5" fill="var(--color-ink)" opacity="0.80" />
      ))}
    </svg>
  );
}
