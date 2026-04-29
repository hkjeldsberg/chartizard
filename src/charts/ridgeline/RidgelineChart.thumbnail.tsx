export function RidgelineThumbnail() {
  // 6 stacked density curves, each with a different peak position and width.
  // Shifting peak location right-then-left mimics the seasonal drift.
  const rows = [
    { peakX: 30, width: 22, amp: 14 }, // cold, wide
    { peakX: 40, width: 20, amp: 16 },
    { peakX: 58, width: 14, amp: 20 },
    { peakX: 72, width: 10, amp: 22 }, // warm, tight
    { peakX: 60, width: 14, amp: 18 },
    { peakX: 42, width: 20, amp: 15 },
  ];
  const rowSpacing = 10;
  const baselineStart = 20;

  const makePath = (peakX: number, widthParam: number, amp: number, baseline: number) => {
    // Approximate a bell with a cubic bezier: sample a few points along a
    // gaussian and connect with smooth curves. Tiny viewBox = keep it simple.
    const pts: [number, number][] = [];
    for (let x = 8; x <= 112; x += 4) {
      const u = (x - peakX) / widthParam;
      const y = baseline - amp * Math.exp(-0.5 * u * u);
      pts.push([x, y]);
    }
    let d = `M ${pts[0][0]} ${baseline} L ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i][0]} ${pts[i][1]}`;
    }
    d += ` L ${pts[pts.length - 1][0]} ${baseline} Z`;
    return d;
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((r, i) => {
        const baseline = baselineStart + i * rowSpacing;
        const warmth = 1 - Math.abs(i - 3) / 3;
        const opacity = 0.35 + 0.2 * warmth;
        return (
          <path
            key={i}
            d={makePath(r.peakX, r.width, r.amp, baseline)}
            fill="var(--color-ink)"
            fillOpacity={opacity}
            stroke="var(--color-ink)"
            strokeWidth={0.8}
          />
        );
      })}
    </svg>
  );
}
