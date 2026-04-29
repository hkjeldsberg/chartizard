export function OhlcThumbnail() {
  // Hand-placed OHLC bars: [x, high, low, open, close]
  // An "up" day (close below open in SVG y-coords means close < open;
  // we want close HIGHER on screen than open → y(close) < y(open)).
  const bars: Array<[number, number, number, number, number]> = [
    [18, 42, 62, 56, 48],   // up
    [30, 36, 56, 50, 40],   // up
    [42, 44, 58, 48, 54],   // down
    [54, 34, 52, 46, 38],   // up
    [66, 40, 58, 50, 52],   // down
    [78, 26, 48, 42, 30],   // up
    [90, 30, 44, 38, 34],   // up
    [102, 22, 42, 38, 26],  // up
  ];

  const tick = 3;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="10" y1="68" x2="114" y2="68" stroke="var(--color-hairline)" />
      <line x1="10" y1="10" x2="10" y2="68" stroke="var(--color-hairline)" />
      {bars.map(([x, hi, lo, op, cl], i) => {
        const up = cl < op; // y smaller = higher on screen
        const stroke = up ? "var(--color-ink)" : "var(--color-ink)";
        const opacity = up ? 1 : 0.45;
        const sw = up ? 1.4 : 1.1;
        return (
          <g key={i} stroke={stroke} strokeWidth={sw} strokeLinecap="round" opacity={opacity}>
            <line x1={x} x2={x} y1={hi} y2={lo} />
            <line x1={x - tick} x2={x} y1={op} y2={op} />
            <line x1={x} x2={x + tick} y1={cl} y2={cl} />
          </g>
        );
      })}
    </svg>
  );
}
