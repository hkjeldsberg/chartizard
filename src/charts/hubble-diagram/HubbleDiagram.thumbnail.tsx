export function HubbleDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="14" y1="66" x2="114" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="10" x2="14" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Axis break divider */}
      <line x1="42" y1="12" x2="42" y2="64" stroke="var(--color-hairline)" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Left panel: Hubble 1929 scatter (steep slope) */}
      {/* Data dots — tightly clustered, 0–2 Mpc range */}
      {[
        [16, 60], [18, 55], [22, 52], [24, 40], [26, 48],
        [28, 38], [30, 34], [32, 30], [36, 26], [38, 22],
        [40, 20], [40, 28],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="var(--color-ink)" opacity="0.75" />
      ))}
      {/* Steep best-fit line (H₀ ≈ 500) */}
      <line x1="14" y1="64" x2="41" y2="14" stroke="var(--color-ink)" strokeWidth="1.2" strokeDasharray="3 2" />

      {/* Right panel: modern scatter (shallow slope) */}
      {[
        [46, 62], [52, 56], [58, 52], [65, 46], [72, 40],
        [78, 36], [84, 30], [90, 25], [96, 20], [102, 16],
        [108, 12],
      ].map(([x, y], i) => (
        <circle key={`r${i}`} cx={x} cy={y} r="1.5" fill="var(--color-ink)" opacity="0.45" />
      ))}
      {/* Shallow best-fit line (H₀ ≈ 70) */}
      <line x1="43" y1="65" x2="114" y2="12" stroke="var(--color-ink)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.55" />

      {/* Small x-axis label */}
      <text x="64" y="76" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink-mute)">
        DISTANCE (Mpc)
      </text>
    </svg>
  );
}
