// Tiny silhouette of a polar-area diagram: 8 equal-angle wedges of varying
// radius, all starting at the hub (no stacks).
const CX = 60;
const CY = 40;
const N = 8;
const RADII = [30, 26, 16, 12, 11, 9, 8, 14];

function wedge(r: number, a0: number, a1: number): string {
  const x0 = CX + r * Math.cos(a0);
  const y0 = CY + r * Math.sin(a0);
  const x1 = CX + r * Math.cos(a1);
  const y1 = CY + r * Math.sin(a1);
  return `M${CX} ${CY} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

export function PolarAreaThumbnail() {
  const step = (2 * Math.PI) / N;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <circle cx={CX} cy={CY} r={30} fill="none" stroke="var(--color-hairline)" strokeWidth="0.5" />
      <circle cx={CX} cy={CY} r={18} fill="none" stroke="var(--color-hairline)" strokeWidth="0.5" />
      {RADII.map((r, i) => {
        const ac = -Math.PI / 2 + i * step;
        const a0 = ac - step / 2;
        const a1 = ac + step / 2;
        const opacity = 0.35 + (r / 30) * 0.5;
        return (
          <path
            key={i}
            d={wedge(r, a0, a1)}
            fill="var(--color-ink)"
            fillOpacity={opacity.toFixed(3)}
          />
        );
      })}
    </svg>
  );
}
