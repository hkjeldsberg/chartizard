const HEX_R = 6;
const HEX_H = HEX_R * Math.sqrt(3);

function hexPath(cx: number, cy: number): string {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    points.push([cx + HEX_R * Math.cos(angle), cy + HEX_R * Math.sin(angle)]);
  }
  return "M" + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";
}

// Density field — fake, but creates a believable hotspot near the centre-right.
function density(col: number, row: number): number {
  const dx = col - 7;
  const dy = row - 3;
  const d = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, 1 - d / 6) + (Math.sin(col + row) + 1) * 0.08;
}

export function HexbinThumbnail() {
  const cols = 11;
  const rows = 6;
  const offsetX = 12;
  const offsetY = 10;

  const hexes: { d: string; o: number; key: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = offsetX + c * HEX_R * 1.5;
      const cy = offsetY + r * HEX_H + (c % 2 === 0 ? 0 : HEX_H / 2);
      if (cx > 114 || cy > 72) continue;
      const d = density(c, r);
      hexes.push({ d: hexPath(cx, cy), o: Math.min(d, 1), key: `${c}-${r}` });
    }
  }

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {hexes.map((h) => (
        <path
          key={h.key}
          d={h.d}
          fill="var(--color-ink)"
          opacity={0.08 + h.o * 0.75}
          stroke="var(--color-page)"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
