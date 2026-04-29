// Phylogram thumbnail — rectangular ultrametric tree with proportional
// branch lengths. All leaves reach the same rightmost x (ultrametric
// alignment); node x-positions reflect inferred divergence times. Includes
// a small scale-bar in the lower-right to signal "phylogram, not cladogram".

export function PhylogramThumbnail() {
  // 8 leaves, evenly spaced vertically.
  const leafY = [8, 18, 28, 38, 48, 58, 68, 76];
  const leafX = 108; // ultrametric alignment: all leaves at same x

  // Internal node x-positions mapped from age (85 Mya at left, 0 Mya at right).
  const xAtMya = (mya: number) => {
    const rootX = 10;
    const span = leafX - rootX;
    return leafX - (mya / 85) * span;
  };

  // Topology:
  // (Palaeognathae: (Tinamou, (Ostrich, (Emu, Kiwi)))) | (Neognathae: ((Chicken, Turkey), (Duck, Goose)))
  const rootX = xAtMya(85);
  const rootY = (leafY[0] + leafY[7]) / 2;

  const palaeoX = xAtMya(70);
  const palaeoY = (leafY[0] + leafY[3]) / 2;

  const ratiteX = xAtMya(60);
  const ratiteY = (leafY[1] + leafY[3]) / 2;

  const emuKiwiX = xAtMya(50);
  const emuKiwiY = (leafY[2] + leafY[3]) / 2;

  const neognathaeX = xAtMya(35);
  const neognathaeY = (leafY[4] + leafY[7]) / 2;

  const gallX = xAtMya(35);
  const gallY = (leafY[4] + leafY[5]) / 2;

  const anserX = xAtMya(20);
  const anserY = (leafY[6] + leafY[7]) / 2;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root → palaeognathae */}
      <polyline
        points={`${rootX},${rootY} ${rootX},${palaeoY} ${palaeoX},${palaeoY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Root → neognathae */}
      <polyline
        points={`${rootX},${rootY} ${rootX},${neognathaeY} ${neognathaeX},${neognathaeY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* palaeognathae → Tinamou */}
      <polyline
        points={`${palaeoX},${palaeoY} ${palaeoX},${leafY[0]} ${leafX},${leafY[0]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* palaeognathae → ratites */}
      <polyline
        points={`${palaeoX},${palaeoY} ${palaeoX},${ratiteY} ${ratiteX},${ratiteY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* ratites → Ostrich */}
      <polyline
        points={`${ratiteX},${ratiteY} ${ratiteX},${leafY[1]} ${leafX},${leafY[1]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* ratites → emu-kiwi */}
      <polyline
        points={`${ratiteX},${ratiteY} ${ratiteX},${emuKiwiY} ${emuKiwiX},${emuKiwiY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* emu-kiwi → Emu */}
      <polyline
        points={`${emuKiwiX},${emuKiwiY} ${emuKiwiX},${leafY[2]} ${leafX},${leafY[2]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* emu-kiwi → Kiwi */}
      <polyline
        points={`${emuKiwiX},${emuKiwiY} ${emuKiwiX},${leafY[3]} ${leafX},${leafY[3]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* neognathae → galliformes */}
      <polyline
        points={`${neognathaeX},${neognathaeY} ${neognathaeX},${gallY} ${gallX},${gallY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* gall → Chicken */}
      <polyline
        points={`${gallX},${gallY} ${gallX},${leafY[4]} ${leafX},${leafY[4]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* gall → Turkey */}
      <polyline
        points={`${gallX},${gallY} ${gallX},${leafY[5]} ${leafX},${leafY[5]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* neognathae → anseriformes */}
      <polyline
        points={`${neognathaeX},${neognathaeY} ${neognathaeX},${anserY} ${anserX},${anserY}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* anser → Duck */}
      <polyline
        points={`${anserX},${anserY} ${anserX},${leafY[6]} ${leafX},${leafY[6]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* anser → Goose */}
      <polyline
        points={`${anserX},${anserY} ${anserX},${leafY[7]} ${leafX},${leafY[7]}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Root dot */}
      <circle cx={rootX} cy={rootY} r={1.8} fill="var(--color-ink)" />
      {/* Leaf dots */}
      {leafY.map((y, i) => (
        <circle key={i} cx={leafX} cy={y} r={1.4} fill="var(--color-ink)" />
      ))}

      {/* Scale bar (small, lower-left, representing a 20-Mya span) */}
      <line x1="12" y1="76" x2={12 + (20 / 85) * (leafX - rootX)} y2="76" stroke="var(--color-ink)" strokeWidth={1} />
      <line x1="12" y1="74" x2="12" y2="78" stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={12 + (20 / 85) * (leafX - rootX)} y1="74" x2={12 + (20 / 85) * (leafX - rootX)} y2="78" stroke="var(--color-ink)" strokeWidth={1} />
    </svg>
  );
}
