// Tiny silhouette of a Nightingale / rose chart: 12 equal-angle wedges with
// uneven radii and concentric bands. Centred at (60, 38).
const CX = 60;
const CY = 38;
const N = 12;
// Total radius per wedge (arbitrary, shaped so December-January looks like the peak).
const TOTALS = [
  14, 10, 9, 12, 13, 11, 15, 22, 26, 30, 24, 16,
];
// Disease (inner) fraction of total — dominant in every wedge.
const DISEASE = TOTALS.map((t) => t * 0.72);
// Wounds (middle) fraction — small and flat.
const WOUNDS = TOTALS.map((t) => t * 0.14);

function wedge(r0: number, r1: number, a0: number, a1: number): string {
  const x0o = CX + r1 * Math.cos(a0);
  const y0o = CY + r1 * Math.sin(a0);
  const x1o = CX + r1 * Math.cos(a1);
  const y1o = CY + r1 * Math.sin(a1);
  if (r0 <= 0) {
    return `M${CX} ${CY} L${x0o.toFixed(2)} ${y0o.toFixed(2)} A${r1} ${r1} 0 0 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)} Z`;
  }
  const x0i = CX + r0 * Math.cos(a0);
  const y0i = CY + r0 * Math.sin(a0);
  const x1i = CX + r0 * Math.cos(a1);
  const y1i = CY + r0 * Math.sin(a1);
  return `M${x0i.toFixed(2)} ${y0i.toFixed(2)} L${x0o.toFixed(2)} ${y0o.toFixed(2)} A${r1} ${r1} 0 0 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)} L${x1i.toFixed(2)} ${y1i.toFixed(2)} A${r0} ${r0} 0 0 0 ${x0i.toFixed(2)} ${y0i.toFixed(2)} Z`;
}

export function NightingaleThumbnail() {
  const step = (2 * Math.PI) / N;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* outer hairline ring */}
      <circle cx={CX} cy={CY} r={30} fill="none" stroke="var(--color-hairline)" strokeWidth="0.5" />
      <circle cx={CX} cy={CY} r={18} fill="none" stroke="var(--color-hairline)" strokeWidth="0.5" />
      {TOTALS.map((t, i) => {
        const ac = -Math.PI / 2 + i * step;
        const a0 = ac - step / 2;
        const a1 = ac + step / 2;
        const rDisease = DISEASE[i];
        const rWounds = rDisease + WOUNDS[i];
        const rTotal = t;
        return (
          <g key={i}>
            {/* other (outermost) */}
            <path d={wedge(rWounds, rTotal, a0, a1)} fill="var(--color-ink)" fillOpacity="0.2" />
            {/* wounds (middle) */}
            <path d={wedge(rDisease, rWounds, a0, a1)} fill="var(--color-ink)" fillOpacity="0.45" />
            {/* disease (inner) */}
            <path d={wedge(0, rDisease, a0, a1)} fill="var(--color-ink)" fillOpacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}
