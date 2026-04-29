export function ConvexTreemapThumbnail() {
  // Four convex-hull blobs with inter-hull whitespace — the chart's
  // distinguishing silhouette. Inside each hull, 3-5 filled circles
  // suggest packaged leaves sized by value. Hand-placed at 120×80.

  type Pt = readonly [number, number];

  const hulls: ReadonlyArray<{ poly: Pt[]; op: number }> = [
    // Top-left (React-ish): large, packs a big circle
    {
      poly: [
        [8, 8], [50, 6], [54, 22], [48, 36], [28, 40], [10, 32], [6, 18],
      ],
      op: 0.16,
    },
    // Top-right (Testing)
    {
      poly: [
        [70, 10], [110, 14], [114, 28], [104, 38], [82, 38], [68, 26],
      ],
      op: 0.12,
    },
    // Bottom-left (Build)
    {
      poly: [
        [8, 46], [36, 44], [48, 54], [46, 68], [28, 74], [10, 68], [4, 56],
      ],
      op: 0.14,
    },
    // Bottom-right (Lint)
    {
      poly: [
        [64, 46], [104, 48], [114, 58], [108, 72], [82, 74], [66, 68], [60, 56],
      ],
      op: 0.10,
    },
  ];

  // Circles inside each hull: [cx, cy, r]
  const leaves: ReadonlyArray<readonly [number, number, number]> = [
    // React cluster (first hull)
    [26, 22, 9],  // react-dom dominant
    [42, 16, 5],
    [40, 30, 4],
    [16, 26, 4],
    // Testing cluster
    [88, 22, 7],
    [100, 28, 5],
    [78, 30, 4],
    // Build cluster
    [24, 58, 6],
    [38, 60, 5],
    [14, 62, 4],
    // Lint cluster
    [82, 60, 5],
    [96, 58, 5],
    [72, 64, 4],
    [102, 66, 4],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {hulls.map((h, i) => (
        <polygon
          key={`hull-${i}`}
          points={h.poly.map((p) => p.join(",")).join(" ")}
          fill="var(--color-ink)"
          fillOpacity={h.op}
          stroke="var(--color-ink)"
          strokeOpacity={0.35}
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      ))}
      {leaves.map(([cx, cy, r], i) => (
        <circle
          key={`leaf-${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--color-ink)"
          fillOpacity={0.6}
        />
      ))}
    </svg>
  );
}
