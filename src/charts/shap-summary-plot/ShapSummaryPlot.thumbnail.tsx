export function ShapSummaryPlotThumbnail() {
  // Thumbnail: horizontal beeswarm rows, top rows wide, bottom rows narrow.
  // Dots coloured blue (left/negative SHAP) to red (right/positive SHAP).
  // A vertical line marks SHAP=0 in the centre.

  // Each row: [label-omitted, y, spread, dots as [x-offset, normFeatureVal]]
  const rows: { y: number; dots: [number, number][] }[] = [
    {
      y: 12,
      dots: [
        [-30, 0.9], [-22, 0.85], [-14, 0.8], [-5, 0.6], [4, 0.55],
        [14, 0.4], [22, 0.2], [30, 0.1], [36, 0.08], [-38, 0.95],
        [8, 0.5], [-10, 0.7], [18, 0.3], [-26, 0.88], [26, 0.15],
      ],
    },
    {
      y: 22,
      dots: [
        [-22, 0.88], [-13, 0.8], [-5, 0.65], [4, 0.55], [12, 0.38],
        [20, 0.2], [27, 0.1], [-28, 0.92], [8, 0.5], [-18, 0.82],
        [16, 0.3], [-8, 0.72],
      ],
    },
    {
      y: 32,
      dots: [
        [-15, 0.82], [-8, 0.7], [-1, 0.55], [6, 0.48], [13, 0.35],
        [20, 0.2], [-20, 0.88], [9, 0.45], [-12, 0.75], [16, 0.28],
      ],
    },
    {
      y: 42,
      dots: [
        [-10, 0.78], [-4, 0.62], [2, 0.5], [8, 0.42], [13, 0.3],
        [-14, 0.82], [5, 0.46], [-7, 0.68], [10, 0.35],
      ],
    },
    {
      y: 52,
      dots: [
        [-6, 0.72], [-2, 0.58], [3, 0.5], [7, 0.43], [-9, 0.76],
        [1, 0.52], [-4, 0.64], [5, 0.45],
      ],
    },
    {
      y: 62,
      dots: [
        [-3, 0.62], [-1, 0.55], [2, 0.5], [4, 0.46], [-4, 0.65],
        [1, 0.52],
      ],
    },
  ];

  // Centre x in the viewBox
  const cx = 72;

  function dotColor(normVal: number): string {
    if (normVal < 0.5) {
      const t = normVal * 2;
      const r = Math.round(74 + t * 86);
      const g = Math.round(144 + t * 16);
      const b = Math.round(217 - t * 57);
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (normVal - 0.5) * 2;
      const r = Math.round(160 + t * 57);
      const g = Math.round(160 - t * 86);
      const b = Math.round(160 - t * 86);
      return `rgb(${r},${g},${b})`;
    }
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="30" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" />
      <line x1="30" y1="6" x2="30" y2="70" stroke="var(--color-hairline)" />

      {/* SHAP=0 centre line */}
      <line x1={cx} y1="6" x2={cx} y2="70" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="0.8" />

      {/* Beeswarm rows */}
      {rows.map((row, ri) =>
        row.dots.map(([xOff, normVal], di) => (
          <circle
            key={`${ri}-${di}`}
            cx={cx + xOff}
            cy={row.y}
            r={1.5}
            fill={dotColor(normVal)}
            fillOpacity="0.88"
          />
        )),
      )}
    </svg>
  );
}
