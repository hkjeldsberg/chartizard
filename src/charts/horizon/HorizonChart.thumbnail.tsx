export function HorizonThumbnail() {
  // 4 stacked rows, each with a banded silhouette. Uses solid-alpha bands
  // to suggest the 3-band stack without rendering actual data.
  const rows = 4;
  const rowH = 14;
  const rowGap = 2;
  const top = 10;
  const left = 10;
  const w = 100;

  // A tiny hand-drawn silhouette per row — reused with different phases so
  // the rows read as distinct series.
  const silhouettes = [
    // row 0: a positive hump mid
    "M0 14 L0 9 L12 6 L24 10 L36 4 L48 8 L60 5 L72 9 L84 7 L100 10 L100 14 Z",
    // row 1: asymmetric — tall right
    "M0 14 L0 11 L14 12 L28 9 L42 11 L56 7 L70 3 L84 6 L100 9 L100 14 Z",
    // row 2: double hump
    "M0 14 L0 10 L12 4 L24 9 L36 11 L48 5 L60 10 L72 3 L84 7 L100 11 L100 14 Z",
    // row 3: steady low
    "M0 14 L0 12 L18 10 L36 11 L54 9 L72 11 L90 10 L100 12 L100 14 Z",
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {silhouettes.map((d, i) => {
        const y = top + i * (rowH + rowGap);
        return (
          <g key={i} transform={`translate(${left}, ${y})`}>
            {/* Row tray */}
            <rect x={0} y={0} width={w} height={rowH} fill="var(--color-ink)" opacity={0.04} />
            {/* Band 1 (lightest) — shrunk */}
            <path d={d} fill="var(--color-ink)" opacity={0.22} />
            {/* Band 2 (mid) — smaller silhouette */}
            <path
              d={d}
              fill="var(--color-ink)"
              opacity={0.46}
              transform="translate(0 3) scale(1 0.72)"
            />
            {/* Band 3 (darkest) — tightest */}
            <path
              d={d}
              fill="var(--color-ink)"
              opacity={0.82}
              transform="translate(0 6) scale(1 0.45)"
            />
            {/* Baseline */}
            <line x1={0} y1={rowH} x2={w} y2={rowH} stroke="var(--color-hairline)" />
          </g>
        );
      })}
    </svg>
  );
}
