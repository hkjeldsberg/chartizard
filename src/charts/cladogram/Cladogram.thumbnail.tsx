// Cladogram thumbnail — rectangular tree silhouette with ALL leaves reaching
// the same rightmost x-coordinate (the defining visual signature of a cladogram),
// plus small filled squares marking synapomorphies on selected branches.

export function CladogramThumbnail() {
  // 8 leaves, evenly spaced vertically.
  const leafY = [8, 18, 28, 38, 48, 58, 68, 76];
  // All leaves at the same x (equal branch length convention).
  const leafX = 108;

  // Internal node x positions (evenly spaced in depth — equal branch lengths).
  const rootX = 10; const rootY = (leafY[0] + leafY[7]) / 2;
  const gnathX = 24; const gnathY = (leafY[1] + leafY[7]) / 2;
  const ostX = 38;  const ostY = (leafY[2] + leafY[7]) / 2;
  const ampX = 52;  const ampY = (leafY[2] + leafY[3]) / 2;
  const amnX = 66;  const amnY = (leafY[4] + leafY[7]) / 2;
  const repX = 80;  const repY = (leafY[4] + leafY[5]) / 2;
  const mamX = 80;  const mamY = (leafY[6] + leafY[7]) / 2;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root to Lamprey */}
      <polyline points={`${rootX},${rootY} ${rootX},${leafY[0]} ${leafX},${leafY[0]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Root to gnath */}
      <polyline points={`${rootX},${rootY} ${rootX},${gnathY} ${gnathX},${gnathY}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* gnath to Shark */}
      <polyline points={`${gnathX},${gnathY} ${gnathX},${leafY[1]} ${leafX},${leafY[1]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* gnath to ost */}
      <polyline points={`${gnathX},${gnathY} ${gnathX},${ostY} ${ostX},${ostY}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* ost to amphibia */}
      <polyline points={`${ostX},${ostY} ${ostX},${ampY} ${ampX},${ampY}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* amp to Salamander */}
      <polyline points={`${ampX},${ampY} ${ampX},${leafY[2]} ${leafX},${leafY[2]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* amp to Frog */}
      <polyline points={`${ampX},${ampY} ${ampX},${leafY[3]} ${leafX},${leafY[3]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* ost to amniota */}
      <polyline points={`${ostX},${ostY} ${ostX},${amnY} ${amnX},${amnY}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* amniota to reptilia */}
      <polyline points={`${amnX},${amnY} ${amnX},${repY} ${repX},${repY}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* reptilia to Snake */}
      <polyline points={`${repX},${repY} ${repX},${leafY[4]} ${leafX},${leafY[4]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* reptilia to Chicken */}
      <polyline points={`${repX},${repY} ${repX},${leafY[5]} ${leafX},${leafY[5]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* amniota to mammalia */}
      <polyline points={`${amnX},${amnY} ${amnX},${mamY} ${mamX},${mamY}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* mammalia to Mouse */}
      <polyline points={`${mamX},${mamY} ${mamX},${leafY[6]} ${leafX},${leafY[6]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      {/* mammalia to Human */}
      <polyline points={`${mamX},${mamY} ${mamX},${leafY[7]} ${leafX},${leafY[7]}`} fill="none" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Synapomorphy squares */}
      {/* jaws — on gnath incoming branch */}
      <rect x={(rootX + gnathX) / 2 - 2.5} y={gnathY - 2.5} width={5} height={5} fill="var(--color-ink)" rx={0.5} />
      {/* amniotic egg — on amniota incoming branch */}
      <rect x={(ostX + amnX) / 2 - 2.5} y={amnY - 2.5} width={5} height={5} fill="var(--color-ink)" rx={0.5} />
      {/* mammary glands — on mammalia incoming branch */}
      <rect x={(amnX + mamX) / 2 - 2.5} y={mamY - 2.5} width={5} height={5} fill="var(--color-ink)" rx={0.5} />

      {/* Root and leaf dots */}
      <circle cx={rootX} cy={rootY} r={1.8} fill="var(--color-ink)" />
      {leafY.map((y, i) => (
        <circle key={i} cx={leafX} cy={y} r={1.4} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
