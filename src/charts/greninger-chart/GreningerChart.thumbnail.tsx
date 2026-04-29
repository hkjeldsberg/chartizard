export function GreningerChartThumbnail() {
  const cx = 60;
  const cy = 38;
  const maxR = 30;

  // Radial rings at 10°, 20°, 30° of 60° max
  const rings = [10, 20, 30].map((deg) => (deg / 60) * maxR);

  // Azimuthal spokes every 45°
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];

  // A few representative spots
  const spots = [
    { r: 0, phi: 0 },      // centre (001)
    { r: (32 / 60) * maxR, phi: 0 },    // 100
    { r: (32 / 60) * maxR, phi: 90 },   // 010
    { r: (43 / 60) * maxR, phi: 45 },   // 110
    { r: (43 / 60) * maxR, phi: 135 },
    { r: (53 / 60) * maxR, phi: 0 },    // 200
    { r: (54 / 60) * maxR, phi: 315 },  // 111
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={maxR} fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Inner radial rings */}
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-hairline)" strokeWidth="0.7" />
      ))}

      {/* Spokes */}
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx} y1={cy}
            x2={cx + maxR * Math.cos(rad)}
            y2={cy - maxR * Math.sin(rad)}
            stroke="var(--color-hairline)"
            strokeWidth="0.7"
          />
        );
      })}

      {/* Diffraction spots */}
      {spots.map((s, i) => {
        const rad = (s.phi * Math.PI) / 180;
        const sx = cx + s.r * Math.cos(rad);
        const sy = cy - s.r * Math.sin(rad);
        return (
          <circle key={i} cx={sx} cy={sy} r={i === 0 ? 2.5 : 1.8} fill="var(--color-ink)" fillOpacity="0.85" />
        );
      })}

      {/* Label */}
      <text x={cx} y={74} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink-mute)">
        Greninger
      </text>
    </svg>
  );
}
