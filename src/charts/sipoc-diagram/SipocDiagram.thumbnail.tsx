export function SipocThumbnail() {
  // Thumbnail: five labelled column blocks, Process column wider with small
  // step boxes and arrows. 120×80 viewBox.

  // Column widths in thumbnail units (total = 108, centred in 120)
  const ox = 6;
  const oy = 8;
  const totalW = 108;
  const totalH = 64;
  const headerH = 12;
  const bodyH = totalH - headerH;

  const colFracs = [0.17, 0.17, 0.32, 0.17, 0.17];
  const colLabels = ["S", "I", "PROCESS", "O", "C"];
  const colFills = [
    "rgba(80,100,140,0.15)",
    "rgba(80,130,120,0.15)",
    "rgba(120,90,50,0.15)",
    "rgba(80,130,120,0.15)",
    "rgba(80,100,140,0.15)",
  ];

  const colWidths = colFracs.map((f) => f * totalW);
  const colXs: number[] = [];
  let cx = ox;
  for (const w of colWidths) {
    colXs.push(cx);
    cx += w;
  }

  // Process column (index 2) step boxes.
  const procX = colXs[2];
  const procW = colWidths[2];
  const nSteps = 4;
  const stepW = (procW - 8) / nSteps - 2;
  const stepH = 10;
  const stepY = oy + headerH + bodyH / 2 - stepH / 2;
  const stepSpacing = (procW - nSteps * stepW) / (nSteps + 1);
  const stepLabels = ["T", "A", "I", "R"];

  // Text entry rows in outer columns (3 rows shown).
  const rowH = bodyH / 4;
  const outerEntries = [
    [0, ["Supplier A", "Supplier B"]],
    [1, ["Input A", "Input B", "Input C"]],
    [3, ["Output A", "Output B"]],
    [4, ["Customer A", "Customer B"]],
  ] as const;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Column headers */}
      {colLabels.map((label, i) => (
        <g key={`hdr-${i}`}>
          <rect
            x={colXs[i]}
            y={oy}
            width={colWidths[i]}
            height={headerH}
            fill={colFills[i]}
            stroke="var(--color-hairline)"
            strokeWidth={0.5}
          />
          <text
            x={colXs[i] + colWidths[i] / 2}
            y={oy + headerH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="monospace"
            fontSize={i === 2 ? 5.5 : 6}
            fontWeight={700}
            fill="var(--color-ink)"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Body background */}
      <rect
        x={ox}
        y={oy + headerH}
        width={totalW}
        height={bodyH}
        fill="var(--color-surface)"
        stroke="var(--color-hairline)"
        strokeWidth={0.5}
      />

      {/* Vertical dividers */}
      {[1, 2, 3, 4].map((i) => (
        <line
          key={`div-${i}`}
          x1={colXs[i]}
          y1={oy}
          x2={colXs[i]}
          y2={oy + totalH}
          stroke="var(--color-hairline)"
          strokeWidth={0.5}
        />
      ))}

      {/* Outer column text entries */}
      {outerEntries.map(([colIdx, entries]) =>
        (entries as readonly string[]).map((entry, ri) => (
          <text
            key={`entry-${colIdx}-${ri}`}
            x={colXs[colIdx] + colWidths[colIdx] / 2}
            y={oy + headerH + ri * rowH + rowH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="monospace"
            fontSize={4.5}
            fill="var(--color-ink-soft)"
          >
            {entry}
          </text>
        )),
      )}

      {/* Process step boxes + arrows */}
      {stepLabels.map((label, i) => {
        const sx = procX + stepSpacing * (i + 1) + stepW * i;
        const sy = stepY;
        const midCY = sy + stepH / 2;
        return (
          <g key={`step-${i}`}>
            {i < stepLabels.length - 1 && (
              <g>
                <line
                  x1={sx + stepW}
                  y1={midCY}
                  x2={procX + stepSpacing * (i + 2) + stepW * (i + 1) - 1}
                  y2={midCY}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.8}
                />
                <polygon
                  points={`${procX + stepSpacing * (i + 2) + stepW * (i + 1) - 1},${midCY} ${procX + stepSpacing * (i + 2) + stepW * (i + 1) - 4},${midCY - 2.5} ${procX + stepSpacing * (i + 2) + stepW * (i + 1) - 4},${midCY + 2.5}`}
                  fill="var(--color-ink-mute)"
                />
              </g>
            )}
            <rect
              x={sx}
              y={sy}
              width={stepW}
              height={stepH}
              rx={2}
              ry={2}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={0.8}
            />
            <text
              x={sx + stepW / 2}
              y={sy + stepH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="monospace"
              fontSize={5}
              fontWeight={600}
              fill="var(--color-ink)"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
