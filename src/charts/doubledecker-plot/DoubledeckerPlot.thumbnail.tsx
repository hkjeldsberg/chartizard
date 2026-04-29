export function DoubledeckerThumbnail() {
  // 6 equal-height bars of varying width, each split horizontally by a
  // response line with a shaded lower "deck". Reads as the doubledecker
  // idiom: predictors left-to-right, binary response shading within.
  const yTop = 14;
  const yBottom = 66;
  const H = yBottom - yTop;
  const x0 = 10;
  const x1 = 112;
  const gap = 2;

  // widths ∝ joint counts, rescaled to fill [x0, x1 - (n-1)*gap]
  const raw = [10, 16, 8, 14, 22, 18];
  const sum = raw.reduce((s, v) => s + v, 0);
  const avail = x1 - x0 - (raw.length - 1) * gap;
  const widths = raw.map((v) => (v / sum) * avail);

  // survival fractions (0..1) — roughly match the on-chart story
  const survived = [0.95, 0.35, 0.7, 0.15, 0.5, 0.22];

  let cursor = x0;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* baseline hairline */}
      <line x1={x0} y1={yBottom} x2={x1} y2={yBottom} stroke="var(--color-hairline)" />
      {/* top hairline (class separator) */}
      <line x1={x0} y1={yTop - 4} x2={x1} y2={yTop - 4} stroke="var(--color-hairline)" />
      {widths.map((w, i) => {
        const x = cursor;
        cursor += w + gap;
        const shadedH = survived[i] * H;
        const shadedY = yBottom - shadedH;
        return (
          <g key={i}>
            {/* un-shaded frame */}
            <rect
              x={x}
              y={yTop}
              width={w}
              height={H}
              fill="var(--color-ink)"
              fillOpacity="0.1"
            />
            {/* shaded deck */}
            <rect
              x={x}
              y={shadedY}
              width={w}
              height={shadedH}
              fill="var(--color-ink)"
              fillOpacity="0.8"
            />
            {/* inter-deck separator */}
            <line
              x1={x}
              y1={shadedY}
              x2={x + w}
              y2={shadedY}
              stroke="var(--color-page)"
              strokeWidth="0.7"
            />
          </g>
        );
      })}
    </svg>
  );
}
