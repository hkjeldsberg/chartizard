// Phylogenetic tree (phylogram) thumbnail — rectangular cladogram silhouette
// with root on the left and leaves on the right. Branch lengths are unequal,
// reflecting that this is a phylogram (time/distance encoded), not a cladogram.

export function PhylogeneticTreeThumbnail() {
  // Leaf y-positions (evenly spaced vertically, 8 taxa).
  const leafY = [8, 18, 28, 38, 48, 58, 68, 76];

  // Root x position.
  const rootX = 10;
  const rootY = (leafY[0] + leafY[leafY.length - 1]) / 2;

  // Internal node x positions (cumulative distance from root, scaled to ~10-90).
  // Topology: (Lamprey, (Shark, ((Salamander, Frog), ((Snake, Chicken), (Mouse, Human)))))
  // gnathostomata node
  const gnathX = 18; const gnathY = (leafY[1] + leafY[7]) / 2;
  // amphibia node
  const amphibiaX = 42; const amphibiaY = (leafY[2] + leafY[3]) / 2;
  // reptilia node
  const reptiliaX = 54; const reptiliaY = (leafY[4] + leafY[5]) / 2;
  // mammalia node
  const mammaliaX = 62; const mammaliaY = (leafY[6] + leafY[7]) / 2;
  // amniota node
  const amniotaX = 44; const amniotaY = (reptiliaY + mammaliaY) / 2;
  // osteichthyes node
  const ostX = 30; const ostY = (amphibiaY + amniotaY) / 2;

  // Leaf x positions (unequal — lamprey is deepest, humans most recent).
  const leafX = [96, 62, 88, 86, 82, 78, 80, 78];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root → Lamprey branch (long) */}
      <polyline
        points={`${rootX},${rootY} ${rootX},${leafY[0]} ${leafX[0]},${leafY[0]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Root → gnathostomata */}
      <polyline
        points={`${rootX},${rootY} ${rootX},${gnathY} ${gnathX},${gnathY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* gnathostomata → Shark */}
      <polyline
        points={`${gnathX},${gnathY} ${gnathX},${leafY[1]} ${leafX[1]},${leafY[1]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* gnathostomata → osteichthyes */}
      <polyline
        points={`${gnathX},${gnathY} ${gnathX},${ostY} ${ostX},${ostY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* osteichthyes → amphibia */}
      <polyline
        points={`${ostX},${ostY} ${ostX},${amphibiaY} ${amphibiaX},${amphibiaY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* amphibia → Salamander */}
      <polyline
        points={`${amphibiaX},${amphibiaY} ${amphibiaX},${leafY[2]} ${leafX[2]},${leafY[2]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* amphibia → Frog */}
      <polyline
        points={`${amphibiaX},${amphibiaY} ${amphibiaX},${leafY[3]} ${leafX[3]},${leafY[3]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* osteichthyes → amniota */}
      <polyline
        points={`${ostX},${ostY} ${ostX},${amniotaY} ${amniotaX},${amniotaY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* amniota → reptilia */}
      <polyline
        points={`${amniotaX},${amniotaY} ${amniotaX},${reptiliaY} ${reptiliaX},${reptiliaY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* reptilia → Snake */}
      <polyline
        points={`${reptiliaX},${reptiliaY} ${reptiliaX},${leafY[4]} ${leafX[4]},${leafY[4]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* reptilia → Chicken */}
      <polyline
        points={`${reptiliaX},${reptiliaY} ${reptiliaX},${leafY[5]} ${leafX[5]},${leafY[5]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* amniota → mammalia */}
      <polyline
        points={`${amniotaX},${amniotaY} ${amniotaX},${mammaliaY} ${mammaliaX},${mammaliaY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* mammalia → Mouse */}
      <polyline
        points={`${mammaliaX},${mammaliaY} ${mammaliaX},${leafY[6]} ${leafX[6]},${leafY[6]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* mammalia → Human */}
      <polyline
        points={`${mammaliaX},${mammaliaY} ${mammaliaX},${leafY[7]} ${leafX[7]},${leafY[7]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Root dot */}
      <circle cx={rootX} cy={rootY} r={1.8} fill="var(--color-ink)" />
      {/* Leaf dots */}
      {leafX.map((x, i) => (
        <circle key={i} cx={x} cy={leafY[i]} r={1.4} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
