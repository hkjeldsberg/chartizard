export function IsosurfacePlotThumbnail() {
  // Tiny isometric silhouette of the 2p_z orbital dumbbell. Two lobes along
  // the z-axis + faint axis tripod. Not data — just the shape's signature.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axis tripod */}
      <line
        x1={60}
        y1={40}
        x2={92}
        y2={50}
        stroke="var(--color-hairline)"
        strokeWidth={0.7}
        strokeDasharray="2 2"
      />
      <line
        x1={60}
        y1={40}
        x2={28}
        y2={50}
        stroke="var(--color-hairline)"
        strokeWidth={0.7}
        strokeDasharray="2 2"
      />
      <line
        x1={60}
        y1={10}
        x2={60}
        y2={72}
        stroke="var(--color-hairline)"
        strokeWidth={0.7}
        strokeDasharray="2 2"
      />

      {/* Upper lobe — ellipse-ish with a latitudinal hoop for depth. */}
      <ellipse
        cx={60}
        cy={22}
        rx={13}
        ry={15}
        fill="var(--color-ink)"
        fillOpacity={0.18}
        stroke="var(--color-ink)"
        strokeOpacity={0.75}
        strokeWidth={1}
      />
      <ellipse
        cx={60}
        cy={22}
        rx={13}
        ry={3.2}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.7}
      />
      <ellipse
        cx={60}
        cy={14}
        rx={7}
        ry={1.8}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.45}
        strokeWidth={0.6}
      />
      <ellipse
        cx={60}
        cy={30}
        rx={7}
        ry={1.8}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.45}
        strokeWidth={0.6}
      />

      {/* Lower lobe */}
      <ellipse
        cx={60}
        cy={58}
        rx={13}
        ry={15}
        fill="var(--color-ink)"
        fillOpacity={0.18}
        stroke="var(--color-ink)"
        strokeOpacity={0.75}
        strokeWidth={1}
      />
      <ellipse
        cx={60}
        cy={58}
        rx={13}
        ry={3.2}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.7}
      />
      <ellipse
        cx={60}
        cy={50}
        rx={7}
        ry={1.8}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.45}
        strokeWidth={0.6}
      />
      <ellipse
        cx={60}
        cy={66}
        rx={7}
        ry={1.8}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.45}
        strokeWidth={0.6}
      />

      {/* Nodal-plane tick through origin */}
      <line
        x1={48}
        y1={40}
        x2={72}
        y2={40}
        stroke="var(--color-ink)"
        strokeOpacity={0.35}
        strokeWidth={0.6}
        strokeDasharray="1 2"
      />
    </svg>
  );
}
