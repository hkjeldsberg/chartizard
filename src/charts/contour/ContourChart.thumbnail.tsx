export function ContourThumbnail() {
  // Two concentric nested ellipses per peak, off-centre to the left and right,
  // with the larger peak on the left. A bounding frame and axis ticks hint at
  // the plot baseplane — no actual data.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Frame */}
      <rect
        x={10}
        y={10}
        width={100}
        height={60}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
      />
      {/* Left peak — three nested ellipses, heavier stroke on the inner ring */}
      <ellipse
        cx={44}
        cy={34}
        rx={26}
        ry={20}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.9}
        strokeOpacity={0.45}
      />
      <ellipse
        cx={44}
        cy={34}
        rx={16}
        ry={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
        strokeOpacity={0.7}
      />
      <ellipse
        cx={44}
        cy={34}
        rx={7}
        ry={5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.5}
        strokeOpacity={0.95}
      />
      {/* Right peak — smaller, tighter */}
      <ellipse
        cx={82}
        cy={52}
        rx={18}
        ry={14}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.9}
        strokeOpacity={0.45}
      />
      <ellipse
        cx={82}
        cy={52}
        rx={11}
        ry={8}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
        strokeOpacity={0.7}
      />
      <ellipse
        cx={82}
        cy={52}
        rx={5}
        ry={3.5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.5}
        strokeOpacity={0.95}
      />
      {/* Peak markers */}
      {[
        [44, 34],
        [82, 52],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={x - 2.5} x2={x + 2.5} y1={y} y2={y} stroke="var(--color-ink)" strokeWidth={1} />
          <line x1={x} x2={x} y1={y - 2.5} y2={y + 2.5} stroke="var(--color-ink)" strokeWidth={1} />
        </g>
      ))}
    </svg>
  );
}
