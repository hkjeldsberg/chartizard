export function IconArrayThumbnail() {
  // Tiny 10×10 grid of stick figures; top-left 30 are dark, rest are light
  const COLS = 10;
  const ROWS = 10;
  const EVENT_COUNT = 30;
  const PAD = 6;
  const cellW = (120 - PAD * 2) / COLS;
  const cellH = (80 - PAD * 2) / ROWS;
  const r = Math.min(cellW, cellH) * 0.18;

  const figures: { cx: number; cy: number; highlighted: boolean }[] = [];
  let n = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      figures.push({
        cx: PAD + col * cellW + cellW / 2,
        cy: PAD + row * cellH + cellH / 2,
        highlighted: n < EVENT_COUNT,
      });
      n++;
    }
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {figures.map(({ cx, cy, highlighted }, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={highlighted ? "var(--color-ink)" : "var(--color-hairline)"}
        />
      ))}
    </svg>
  );
}
