export function WaterfallPlotSignalThumbnail() {
  // 10 stacked amplitude-vs-frequency traces with a migrating peak + a small
  // burst in the middle traces. Hidden-surface removal: each trace has a
  // page-coloured fill that occludes earlier traces behind it.
  const nTraces = 10;
  const nPts = 40;
  const x0 = 10;
  const x1 = 110;
  const y0 = 14;
  const ySpan = 54;
  const rowSpacing = ySpan / (nTraces - 1 + 1.4); // amp headroom ~1.4 rows
  const ampHeight = rowSpacing * 1.4;

  const baselineFor = (k: number) => y0 + ampHeight + k * rowSpacing;

  const paths: string[] = [];
  for (let k = 0; k < nTraces; k++) {
    // Chirp peak migrates from low freq (early) to high freq (late).
    const t = k / (nTraces - 1);
    const chirpCenter = 0.1 + 0.8 * t;
    // Burst near middle traces (k = 4, 5).
    const burstOn = Math.abs(k - 4.5) < 1.5 ? 1 : 0;

    const base = baselineFor(k);
    let d = `M ${x0} ${base}`;
    for (let i = 0; i < nPts; i++) {
      const f = i / (nPts - 1);
      const chirp = Math.exp(-Math.pow((f - chirpCenter) / 0.08, 2) * 0.5);
      const burst =
        burstOn *
        0.8 *
        Math.exp(-Math.pow((f - 0.62) / 0.05, 2) * 0.5) *
        Math.exp(-Math.pow((k - 4.5) / 0.9, 2) * 0.5);
      const amp = Math.min(1, 0.06 + chirp + burst);
      const x = x0 + (x1 - x0) * f;
      const y = base - amp * ampHeight;
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    d += ` L ${x1} ${base} Z`;
    paths.push(d);
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {paths.map((d, k) => (
        <path
          key={k}
          d={d}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={0.9}
        />
      ))}
    </svg>
  );
}
