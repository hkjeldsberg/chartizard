export function MosaicThumbnail() {
  // 4 columns whose widths encode region share. Within each column, 4 bands
  // encode product preference. Heights sum to the column height.
  const cols = [
    { share: 28, bands: [40, 25, 20, 15] }, // North
    { share: 22, bands: [25, 35, 30, 10] }, // South
    { share: 30, bands: [30, 30, 25, 15] }, // East
    { share: 20, bands: [50, 20, 20, 10] }, // West
  ];
  const totalShare = cols.reduce((s, c) => s + c.share, 0);
  const xStart = 10;
  const xEnd = 110;
  const availableW = xEnd - xStart - (cols.length - 1) * 1.5; // 1.5 px gaps
  const yTop = 10;
  const yBottom = 70;
  const availableH = yBottom - yTop;
  const opacities = [0.85, 0.6, 0.4, 0.22];

  let cursorX = xStart;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {cols.map((c, i) => {
        const w = (c.share / totalShare) * availableW;
        const colX = cursorX;
        cursorX += w + 1.5;
        let cursorY = yTop;
        return (
          <g key={i}>
            {c.bands.map((b, j) => {
              const h = (b / 100) * availableH - (j < c.bands.length - 1 ? 0.75 : 0);
              const rect = (
                <rect
                  key={j}
                  x={colX}
                  y={cursorY}
                  width={w}
                  height={h}
                  fill="var(--color-ink)"
                  fillOpacity={opacities[j]}
                />
              );
              cursorY += (b / 100) * availableH;
              return rect;
            })}
          </g>
        );
      })}
    </svg>
  );
}
