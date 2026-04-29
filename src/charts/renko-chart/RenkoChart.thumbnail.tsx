export function RenkoThumbnail() {
  // Stylised Renko chart: hollow rectangles = up-bricks, filled = down-bricks.
  // Each brick is the same fixed height (brick size). Drawn by hand for 120×80.
  // Up-trend of 7 bricks, then reversal of 3 down-bricks.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis lines */}
      <line x1="12" y1="70" x2="112" y2="70" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="12" y1="10" x2="12" y2="70" stroke="var(--color-hairline)" strokeWidth="1" />

      {/*
        Bricks: width = 10px, height = 9px
        Up-bricks (hollow): stair-stepping upward from bottom-left
        Down-bricks (filled): reversing from top-right
        x positions step by 10; y positions step by 9 (up = y decreases)
      */}

      {/* Up-brick 1: x=15, y-bottom=60 */}
      <rect x="15" y="51" width="10" height="9" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Up-brick 2: x=25, y-bottom=51 */}
      <rect x="25" y="42" width="10" height="9" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Up-brick 3: x=35, y-bottom=42 */}
      <rect x="35" y="33" width="10" height="9" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Up-brick 4: x=45, y-bottom=33 */}
      <rect x="45" y="24" width="10" height="9" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Up-brick 5: x=55, y-bottom=24 */}
      <rect x="55" y="15" width="10" height="9" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* Down-brick 1 (filled): reversal starts from x=65, dropping from y=15 */}
      <rect x="65" y="24" width="10" height="9" fill="var(--color-ink)" />
      {/* Down-brick 2 */}
      <rect x="75" y="33" width="10" height="9" fill="var(--color-ink)" />
      {/* Down-brick 3 */}
      <rect x="85" y="42" width="10" height="9" fill="var(--color-ink)" />

      {/* Brick size annotation */}
      <text
        x="60"
        y="67"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="6"
        fill="var(--color-ink-mute)"
        opacity="0.7"
      >
        BRICK = $2
      </text>
    </svg>
  );
}
