export function AndrewsPlotThumbnail() {
  // Three bundles of Fourier-ish curves — solid, dashed, dotted — stacked.
  // Hand-authored paths that feel like sine/cosine combinations.
  const paths = [
    // Bundle 1 — solid, low band (setosa-like)
    { d: "M 10 60 C 25 56, 40 62, 55 58 S 80 52, 95 56 S 115 60, 115 58", dash: undefined, opacity: 0.9 },
    { d: "M 10 62 C 25 58, 40 64, 55 60 S 80 54, 95 58 S 115 62, 115 60", dash: undefined, opacity: 0.9 },
    { d: "M 10 58 C 25 54, 40 60, 55 56 S 80 50, 95 54 S 115 58, 115 56", dash: undefined, opacity: 0.9 },

    // Bundle 2 — dashed, mid band (versicolor-like)
    { d: "M 10 40 C 25 30, 40 48, 55 38 S 80 26, 95 42 S 115 34, 115 38", dash: "3 2", opacity: 0.75 },
    { d: "M 10 42 C 25 32, 40 50, 55 40 S 80 28, 95 44 S 115 36, 115 40", dash: "3 2", opacity: 0.75 },
    { d: "M 10 44 C 25 34, 40 52, 55 42 S 80 30, 95 46 S 115 38, 115 42", dash: "3 2", opacity: 0.75 },

    // Bundle 3 — dotted, upper band (virginica-like)
    { d: "M 10 22 C 25 10, 40 28, 55 18 S 80 6, 95 22 S 115 14, 115 18", dash: "1 2", opacity: 0.65 },
    { d: "M 10 24 C 25 12, 40 30, 55 20 S 80 8, 95 24 S 115 16, 115 20", dash: "1 2", opacity: 0.65 },
    { d: "M 10 20 C 25 8, 40 26, 55 16 S 80 4, 95 20 S 115 12, 115 16", dash: "1 2", opacity: 0.65 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Hairline axes */}
      <line x1="10" y1="72" x2="115" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="10" y1="6" x2="10" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity={p.opacity}
          strokeWidth="1.1"
          strokeDasharray={p.dash}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
