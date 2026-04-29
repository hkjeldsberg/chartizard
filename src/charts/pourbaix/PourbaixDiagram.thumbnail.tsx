export function PourbaixDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Plot border */}
      <rect
        x={12}
        y={8}
        width={96}
        height={60}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Fe region (bottom band — low potential, any pH) */}
      <polygon
        points="12,56 72,56 72,68 12,68"
        fill="var(--color-ink)"
        fillOpacity={0.2}
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      {/* Fe²⁺ region (left-middle) */}
      <polygon
        points="12,36 56,36 56,56 12,56"
        fill="var(--color-ink)"
        fillOpacity={0.08}
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      {/* Fe³⁺ region (top-left small) */}
      <polygon
        points="12,8 28,8 28,22 12,22"
        fill="var(--color-ink)"
        fillOpacity={0.16}
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      {/* Fe(OH)₂ region (bottom-right) */}
      <polygon
        points="72,44 108,44 108,68 72,68 72,56"
        fill="var(--color-ink)"
        fillOpacity={0.12}
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      {/* Fe₂O₃/Fe(OH)₃ region (top-right) */}
      <polygon
        points="28,22 56,36 108,44 108,8 28,8"
        fill="var(--color-ink)"
        fillOpacity={0.14}
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />

      {/* Water stability reference lines (dashed) */}
      <line
        x1={12}
        y1={18}
        x2={108}
        y2={30}
        stroke="var(--color-ink)"
        strokeWidth={0.9}
        strokeDasharray="3 2"
        opacity={0.75}
      />
      <line
        x1={12}
        y1={44}
        x2={108}
        y2={56}
        stroke="var(--color-ink)"
        strokeWidth={0.9}
        strokeDasharray="3 2"
        opacity={0.75}
      />
    </svg>
  );
}
