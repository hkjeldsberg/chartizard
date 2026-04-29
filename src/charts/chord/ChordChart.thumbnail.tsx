export function ChordThumbnail() {
  // Tiny chord silhouette: six arc segments on a ring plus a few curved
  // chords inside. Not a real chord layout — just a recognisable sketch.
  const cx = 60;
  const cy = 40;
  const rOut = 30;
  const rIn = 24;

  // Six arcs, varying lengths, summing to 2π.
  const fractions = [0.28, 0.18, 0.19, 0.09, 0.14, 0.12];
  const gap = 0.04;

  let a = -Math.PI / 2;
  const arcs = fractions.map((f, i) => {
    const start = a + gap / 2;
    const end = a + f * Math.PI * 2 - gap / 2;
    a += f * Math.PI * 2;
    const x0 = cx + rOut * Math.cos(start);
    const y0 = cy + rOut * Math.sin(start);
    const x1 = cx + rOut * Math.cos(end);
    const y1 = cy + rOut * Math.sin(end);
    const xi1 = cx + rIn * Math.cos(end);
    const yi1 = cy + rIn * Math.sin(end);
    const xi0 = cx + rIn * Math.cos(start);
    const yi0 = cy + rIn * Math.sin(start);
    const large = end - start > Math.PI ? 1 : 0;
    const d = `M${x0} ${y0} A${rOut} ${rOut} 0 ${large} 1 ${x1} ${y1} L${xi1} ${yi1} A${rIn} ${rIn} 0 ${large} 0 ${xi0} ${yi0} Z`;
    const opacity = 0.85 - i * 0.1;
    return { d, opacity, start, end };
  });

  // A few illustrative chords (Bezier through the centre).
  const chord = (s: number, e: number) => {
    const x1 = cx + rIn * Math.cos(s);
    const y1 = cy + rIn * Math.sin(s);
    const x2 = cx + rIn * Math.cos(e);
    const y2 = cy + rIn * Math.sin(e);
    return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  };

  // Midpoints of selected arcs, used as chord endpoints.
  const mid = (i: number) => (arcs[i].start + arcs[i].end) / 2;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Chords inside the ring. */}
      <path
        d={chord(mid(0), mid(2))}
        stroke="var(--color-ink)"
        strokeOpacity={0.35}
        strokeWidth={3}
        fill="none"
      />
      <path
        d={chord(mid(0), mid(4))}
        stroke="var(--color-ink)"
        strokeOpacity={0.3}
        strokeWidth={2.4}
        fill="none"
      />
      <path
        d={chord(mid(1), mid(2))}
        stroke="var(--color-ink)"
        strokeOpacity={0.25}
        strokeWidth={2}
        fill="none"
      />
      <path
        d={chord(mid(3), mid(5))}
        stroke="var(--color-ink)"
        strokeOpacity={0.2}
        strokeWidth={1.2}
        fill="none"
      />

      {/* Arc segments around the ring. */}
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill="var(--color-ink)" opacity={arc.opacity} />
      ))}
    </svg>
  );
}
