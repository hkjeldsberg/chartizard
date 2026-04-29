export function CartogramThumbnail() {
  // Abstract 7×5 grid silhouette where each "state" is a square sized by
  // a hand-picked population proxy. No labels — just the size field.
  const rows: ReadonlyArray<ReadonlyArray<number>> = [
    [0.12, 0.12, 0.06, 0.35, 0.10, 0.22, 0.92],
    [0.62, 0.58, 0.36, 0.60, 0.50, 0.30, 0.30],
    [0.46, 0.10, 0.32, 0.08, 0.44, 0.24, 0.32],
    [0.54, 0.28, 0.56, 0.26, 0.18, 0.24, 0.98],
    [1.00, 0.22, 0.40, 0.18, 0.38, 0.30, 0.78],
  ];

  const x0 = 8;
  const y0 = 6;
  const slotW = 15;
  const slotH = 13.5;
  const maxSide = Math.min(slotW, slotH) - 2;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Faint slot grid */}
      {rows.map((row, r) =>
        row.map((_, c) => (
          <rect
            key={`g-${r}-${c}`}
            x={x0 + c * slotW}
            y={y0 + r * slotH}
            width={slotW - 1}
            height={slotH - 1}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.5}
          />
        )),
      )}
      {/* Size-encoded squares */}
      {rows.map((row, r) =>
        row.map((v, c) => {
          const side = Math.sqrt(v) * maxSide;
          const cx = x0 + c * slotW + slotW / 2;
          const cy = y0 + r * slotH + slotH / 2;
          return (
            <rect
              key={`s-${r}-${c}`}
              x={cx - side / 2}
              y={cy - side / 2}
              width={side}
              height={side}
              fill="rgba(26,22,20,0.82)"
            />
          );
        }),
      )}
    </svg>
  );
}
