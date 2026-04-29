export function RaciThumbnail() {
  // Miniature RACI grid: 4 task rows × 4 role columns, symbolic glyphs.
  // Column headers shaded; A cells dark-filled; R cells circle; C diamond;
  // I dot; empty blank.
  const headerH = 12;
  const rowH = 13;
  const labelW = 28;
  const colW = 22;
  const nCols = 4;
  const nRows = 4;
  const startX = labelW;
  const totalW = labelW + nCols * colW; // 116 — fits in 120
  const totalH = headerH + nRows * rowH; // 64 — fits in 80

  // Offset to centre in 120×80 viewBox
  const ox = (120 - totalW) / 2;
  const oy = (80 - totalH) / 2;

  // Symbolic pattern — one A per row.
  // [A, R, C, I, -] for each row × col
  const grid: Array<Array<"A" | "R" | "C" | "I" | "-">> = [
    ["R", "A", "C", "I"],
    ["A", "C", "C", "-"],
    ["I", "A", "-", "C"],
    ["C", "R", "A", "-"],
  ];

  const headers = ["PM", "Eng", "Des", "QA"];
  const tasks = ["Task 1", "Task 2", "Task 3", "Task 4"];

  function GlyphThumb({
    code,
    cx,
    cy,
  }: {
    code: "A" | "R" | "C" | "I" | "-";
    cx: number;
    cy: number;
  }) {
    if (code === "A") {
      return (
        <rect
          x={cx - 4}
          y={cy - 4}
          width={8}
          height={8}
          fill="rgba(60,100,90,0.75)"
        />
      );
    }
    if (code === "R") {
      return <circle cx={cx} cy={cy} r={4} fill="rgba(60,80,130,0.65)" />;
    }
    if (code === "C") {
      const d = 4.5;
      return (
        <polygon
          points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={0.9}
        />
      );
    }
    if (code === "I") {
      return <circle cx={cx} cy={cy} r={1.5} fill="var(--color-ink-mute)" />;
    }
    return null;
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Column header row */}
      <rect
        x={ox + labelW}
        y={oy}
        width={nCols * colW}
        height={headerH}
        fill="var(--color-ink)"
        opacity={0.1}
        stroke="var(--color-hairline)"
        strokeWidth={0.5}
      />
      {headers.map((h, ci) => (
        <text
          key={ci}
          x={ox + labelW + ci * colW + colW / 2}
          y={oy + headerH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="monospace"
          fontSize={6}
          fontWeight={600}
          fill="var(--color-ink)"
        >
          {h}
        </text>
      ))}

      {/* Task label column */}
      {tasks.map((t, ri) => (
        <text
          key={ri}
          x={ox + labelW - 2}
          y={oy + headerH + ri * rowH + rowH / 2}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="monospace"
          fontSize={5.5}
          fill="var(--color-ink-soft)"
        >
          {t}
        </text>
      ))}

      {/* Grid cells */}
      {grid.map((row, ri) =>
        row.map((code, ci) => {
          const x = ox + labelW + ci * colW;
          const y = oy + headerH + ri * rowH;
          const cx = x + colW / 2;
          const cy = y + rowH / 2;
          return (
            <g key={`${ri}-${ci}`}>
              <rect
                x={x}
                y={y}
                width={colW}
                height={rowH}
                fill={
                  code === "A"
                    ? "rgba(60,100,90,0.12)"
                    : code === "R"
                      ? "rgba(60,80,130,0.08)"
                      : "var(--color-surface)"
                }
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
              />
              <GlyphThumb code={code} cx={cx} cy={cy} />
            </g>
          );
        }),
      )}
    </svg>
  );
}
