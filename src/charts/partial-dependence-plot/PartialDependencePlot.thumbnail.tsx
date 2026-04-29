export function PartialDependencePlotThumbnail() {
  // Thumbnail: faint ICE lines behind a bold PDP curve.
  // x-axis = feature value, y-axis = predicted output.
  // Shape: flat left, steep rise in middle, plateau right.
  const iceOffsets = [-18, -10, -5, 0, 5, 10, 18, -14, 14, -8, 8, -20, 20, -3, 3];

  // PDP path points (feature value, prediction) in viewBox 120×80
  // x: 10→110, y: 10→70 (inverted: low y = high prediction)
  const pdpPoints = "10,64 22,62 34,58 46,46 58,28 70,16 82,12 94,11 110,10";

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="10" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="10" y1="10" x2="10" y2="68" stroke="var(--color-hairline)" />

      {/* ICE lines — thin, low-opacity individual trajectories */}
      {iceOffsets.map((offset, i) => (
        <polyline
          key={i}
          points={`10,${64 + offset * 0.3} 22,${62 + offset * 0.28} 34,${58 + offset * 0.25} 46,${46 + offset * 0.22} 58,${28 + offset * 0.18} 70,${16 + offset * 0.15} 82,${12 + offset * 0.14} 94,${11 + offset * 0.13} 110,${10 + offset * 0.12}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="0.8"
          strokeOpacity="0.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* PDP average curve — bold */}
      <polyline
        points={pdpPoints}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
