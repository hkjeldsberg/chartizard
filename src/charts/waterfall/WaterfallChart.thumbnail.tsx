export function WaterfallThumbnail() {
  // 7 bars: start, +, -, -, +, -, end (matches the live chart's story).
  // y = top of bar (smaller = taller); baseline at y=68.
  const baseline = 68;
  const barWidth = 12;
  const gap = 3;
  const startX = 10;

  // Compute floating positions: start at height 40 -> running 40 -> +15 -> -6
  // -> -5 -> +4 -> -3 -> end at 45.
  // Expressed as (top, bottom) pairs from the baseline so they float.
  type Step = { top: number; bottom: number; kind: "ink" | "pos" | "neg" };
  const steps: Step[] = [
    { top: baseline - 40, bottom: baseline, kind: "ink" }, // start = 40
    { top: baseline - 55, bottom: baseline - 40, kind: "pos" }, // +15 -> 55
    { top: baseline - 55, bottom: baseline - 49, kind: "neg" }, // -6 -> 49
    { top: baseline - 49, bottom: baseline - 44, kind: "neg" }, // -5 -> 44
    { top: baseline - 48, bottom: baseline - 44, kind: "pos" }, // +4 -> 48
    { top: baseline - 48, bottom: baseline - 45, kind: "neg" }, // -3 -> 45
    { top: baseline - 45, bottom: baseline, kind: "ink" }, // end = 45
  ];

  const fillFor = (k: Step["kind"]) =>
    k === "pos"
      ? "var(--color-ink)"
      : k === "neg"
        ? "var(--color-ink)"
        : "var(--color-ink)";
  const opacityFor = (k: Step["kind"]) =>
    k === "pos" ? 0.72 : k === "neg" ? 0.45 : 0.95;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline */}
      <line
        x1="8"
        y1={baseline}
        x2="112"
        y2={baseline}
        stroke="var(--color-hairline)"
      />
      {/* Left axis */}
      <line x1="8" y1="14" x2="8" y2={baseline} stroke="var(--color-hairline)" />

      {/* Bars */}
      {steps.map((s, i) => {
        const x = startX + i * (barWidth + gap);
        const h = s.bottom - s.top;
        return (
          <rect
            key={i}
            x={x}
            y={s.top}
            width={barWidth}
            height={h}
            fill={fillFor(s.kind)}
            opacity={opacityFor(s.kind)}
          />
        );
      })}

      {/* Connector dashes between adjacent bar tops */}
      {steps.slice(0, -1).map((s, i) => {
        const next = steps[i + 1];
        const x1 = startX + i * (barWidth + gap) + barWidth;
        const x2 = startX + (i + 1) * (barWidth + gap);
        // Connector sits at the top of the current bar.
        const y1 = s.top;
        const y2 = next.kind === "ink" && i === steps.length - 2 ? next.top : next.top;
        return (
          <line
            key={`c-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-ink-mute)"
            strokeWidth="0.8"
            strokeDasharray="1.5 2"
          />
        );
      })}
    </svg>
  );
}
