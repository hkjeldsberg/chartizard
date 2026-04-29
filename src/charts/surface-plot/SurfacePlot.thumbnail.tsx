export function SurfacePlotThumbnail() {
  // Tiny wireframe silhouette of a central peak (sombrero / Gaussian-ish) in
  // isometric projection. No data — a few x-curves + y-curves sketched by hand.
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
        y1={60}
        x2={98}
        y2={70}
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
        strokeDasharray="2 2"
      />
      <line
        x1={60}
        y1={60}
        x2={22}
        y2={70}
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
        strokeDasharray="2 2"
      />
      <line
        x1={60}
        y1={60}
        x2={60}
        y2={18}
        stroke="var(--color-hairline)"
        strokeWidth={0.75}
        strokeDasharray="2 2"
      />

      {/* x-curves (back-to-front) — flatter at the back, bump in the middle. */}
      <path
        d="M24,30 C36,32 48,28 60,24 C72,28 84,32 96,30"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.5}
        strokeWidth={0.9}
      />
      <path
        d="M22,40 C34,44 46,30 60,22 C74,30 86,44 98,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.85}
        strokeWidth={1}
      />
      <path
        d="M20,52 C32,56 46,40 60,28 C74,40 88,56 100,52"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.85}
        strokeWidth={1}
      />
      <path
        d="M18,64 C30,66 46,52 60,42 C74,52 90,66 102,64"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.6}
        strokeWidth={0.9}
      />

      {/* y-curves */}
      <path
        d="M36,32 C38,46 42,58 44,68"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.55}
        strokeWidth={0.8}
      />
      <path
        d="M60,22 C60,38 60,54 60,70"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.9}
        strokeWidth={1}
      />
      <path
        d="M84,32 C82,46 78,58 76,68"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.55}
        strokeWidth={0.8}
      />

      {/* Central peak marker */}
      <circle cx={60} cy={22} r={1.6} fill="var(--color-ink)" />
    </svg>
  );
}
