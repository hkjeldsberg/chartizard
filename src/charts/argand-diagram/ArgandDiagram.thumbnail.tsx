export function ArgandThumbnail() {
  // Argand diagram thumbnail: complex plane with z = 3+4i vector and z* conjugate
  // viewBox 120x80, origin at approximately (30, 50)
  const ox = 30;
  const oy = 50;
  const scale = 7; // pixels per unit

  // z = 3 + 4i → pixel (ox+21, oy-28)
  const zx = ox + 3 * scale;
  const zy = oy - 4 * scale;

  // z* = 3 - 4i → pixel (ox+21, oy+28)
  const zcx = ox + 3 * scale;
  const zcy = oy + 4 * scale;

  // Arc for argument (radius 14px)
  const arcR = 14;
  const argRad = Math.atan2(4, 3);
  const arcEndX = ox + arcR * Math.cos(argRad);
  const arcEndY = oy - arcR * Math.sin(argRad);

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="10" y1={oy} x2="110" y2={oy} stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1={ox} y1="8" x2={ox} y2="74" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Axis labels */}
      <text x="108" y={oy + 4} fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)" textAnchor="middle">ℜ</text>
      <text x={ox - 3} y="12" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink-mute)" textAnchor="end">ℑ</text>

      {/* Argument arc */}
      <path
        d={`M ${ox + arcR} ${oy} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
        opacity="0.6"
      />

      {/* Dashed perpendiculars for z */}
      <line x1={zx} y1={zy} x2={zx} y2={oy} stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
      <line x1={zx} y1={zy} x2={ox} y2={zy} stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />

      {/* Vector to z* (conjugate, dimmer) */}
      <line x1={ox} y1={oy} x2={zcx} y2={zcy} stroke="var(--color-ink)" strokeWidth="1.4" opacity="0.45" />
      <polygon
        points={`${zcx},${zcy} ${zcx - 4},${zcy - 2} ${zcx - 4},${zcy + 2}`}
        fill="var(--color-ink)"
        opacity="0.45"
      />

      {/* Vector to z (main) */}
      <line x1={ox} y1={oy} x2={zx - 3} y2={zy + 2} stroke="var(--color-ink)" strokeWidth="1.8" />
      <polygon
        points={`${zx},${zy} ${zx - 5},${zy + 2} ${zx - 2},${zy + 5}`}
        fill="var(--color-ink)"
      />

      {/* Point dots */}
      <circle cx={zx} cy={zy} r="2.2" fill="var(--color-ink)" />
      <circle cx={zcx} cy={zcy} r="1.8" fill="var(--color-ink)" opacity="0.55" />

      {/* Labels */}
      <text x={zx + 3} y={zy - 3} fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink)">z</text>
      <text x={zcx + 3} y={zcy + 8} fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-ink)" opacity="0.65">z*</text>
    </svg>
  );
}
