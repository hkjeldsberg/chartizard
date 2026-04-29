export function StiffThumbnail() {
  // Three Stiff kites side by side in a 120×80 viewBox.
  // Each kite has a central vertical axis with 3 rows (Na+K, Ca, Mg on left;
  // Cl, HCO3, SO4 on right). Kites are narrow→medium→broad left-to-right
  // to convey fresh→brackish mineralisation increase.

  const kiteW = 36;   // each kite's horizontal column width
  const maxHalf = 14; // max half-width at widest point (brackish kite)
  const headerH = 10;
  const rows = [24, 38, 52]; // y positions for Na+K, Ca, Mg rows
  const kiteBottom = 60;

  // Ion half-widths per kite (cation side = anion side for simplicity in thumb)
  // kite 1: karst spring — narrow, Ca dominant
  // kite 2: alluvial well — medium, mixed
  // kite 3: brackish — broad, Na+Cl dominant

  const kites = [
    {
      cx: 18, // centre x of first kite
      cations: [2, 10, 4],  // Na+K, Ca, Mg halves (px)
      anions:  [1, 11, 3],  // Cl, HCO3, SO4 halves
    },
    {
      cx: 60,
      cations: [7, 8, 6],
      anions:  [7, 8, 7],
    },
    {
      cx: 102,
      cations: [maxHalf, 4, 4],
      anions:  [maxHalf - 1, 3, 3],
    },
  ];

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {kites.map((k, ki) => {
        // Polygon: left vertices top-to-bottom, then right vertices bottom-to-top
        const lefts  = rows.map((ry, ri) => ({ x: k.cx - k.cations[ri], y: ry }));
        const rights = rows.map((ry, ri) => ({ x: k.cx + k.anions[ri],  y: ry }));
        const pts = [
          ...lefts,
          ...[...rights].reverse(),
        ].map((p) => `${p.x},${p.y}`).join(" ");

        return (
          <g key={ki}>
            {/* Kite */}
            <polygon
              points={pts}
              fill="var(--color-ink)"
              fillOpacity={0.07}
              stroke="var(--color-ink)"
              strokeWidth={0.9}
              strokeLinejoin="round"
            />
            {/* Central axis */}
            <line
              x1={k.cx} y1={headerH}
              x2={k.cx} y2={kiteBottom}
              stroke="var(--color-ink)"
              strokeOpacity={0.25}
              strokeWidth={0.6}
              strokeDasharray="2 2"
            />
            {/* Row ticks */}
            {rows.map((ry, ri) => (
              <line
                key={ri}
                x1={k.cx - 2} y1={ry}
                x2={k.cx + 2} y2={ry}
                stroke="var(--color-ink)"
                strokeOpacity={0.4}
                strokeWidth={0.6}
              />
            ))}
            {/* Vertex dots */}
            {lefts.map((p, li) => (
              <circle key={`l${li}`} cx={p.x} cy={p.y} r={1.2} fill="var(--color-ink)" />
            ))}
            {rights.map((p, ri) => (
              <circle key={`r${ri}`} cx={p.x} cy={p.y} r={1.2} fill="var(--color-ink)" />
            ))}
          </g>
        );
      })}
      {/* Divider lines between kites */}
      <line x1={36} y1={8} x2={36} y2={70} stroke="var(--color-hairline)" strokeWidth={0.5} strokeDasharray="2 3" />
      <line x1={84} y1={8} x2={84} y2={70} stroke="var(--color-hairline)" strokeWidth={0.5} strokeDasharray="2 3" />
      {/* Scale bar hint */}
      <line x1={8} y1={68} x2={28} y2={68} stroke="var(--color-hairline)" strokeWidth={0.6} />
      <text x={18} y={75} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="var(--color-ink)" opacity={0.5}>
        meq/L
      </text>
    </svg>
  );
}
