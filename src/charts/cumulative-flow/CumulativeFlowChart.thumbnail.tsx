// Cumulative Flow silhouette — four stacked bands rising left→right,
// with a subtle bulge in the middle band to suggest the WIP bottleneck.

export function CumulativeFlowThumbnail() {
  // The four bands, from top (To-Do, lightest) to bottom (Done, darkest).
  // Each band is described as a pair of y values at three x positions
  // (left, middle, right), interpolated with a smooth cubic-like path.
  // All four bands share edges, so we build them as stacked filled areas.

  // Top edge of each band at x = 8, 60, 112.
  // Bottom edge is the top edge of the band below.
  // Totals grow from left to right; bottom band (Done) grows most.
  const done = { L: 76, M: 68, R: 52 };
  const inReview = { L: 70, M: 60, R: 42 };
  const inProgress = { L: 60, M: 36, R: 32 }; // balloon at middle
  const toDo = { L: 38, M: 24, R: 18 };

  const band = (topL: number, topR: number, topM: number, botL: number, botM: number, botR: number) =>
    `M8 ${botL} C 30 ${botM}, 50 ${botM}, 60 ${botM} S 90 ${botR}, 112 ${botR} L112 ${topR} C 90 ${topR}, 70 ${topM}, 60 ${topM} S 30 ${topL}, 8 ${topL} Z`;

  // Baseline (the plot floor) at y=76.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Done — bottom band, darkest */}
      <path
        d={band(done.L, done.R, done.M, 76, 76, 76)}
        fill="var(--color-ink)"
        opacity="0.78"
      />
      {/* In Review */}
      <path
        d={band(inReview.L, inReview.R, inReview.M, done.L, done.M, done.R)}
        fill="var(--color-ink)"
        opacity="0.55"
      />
      {/* In Progress — shows the WIP balloon: thicker in the middle */}
      <path
        d={band(inProgress.L, inProgress.R, inProgress.M, inReview.L, inReview.M, inReview.R)}
        fill="var(--color-ink)"
        opacity="0.34"
      />
      {/* To-Do — top, lightest */}
      <path
        d={band(toDo.L, toDo.R, toDo.M, inProgress.L, inProgress.M, inProgress.R)}
        fill="var(--color-ink)"
        opacity="0.2"
      />
      {/* Axes hairlines */}
      <line x1="8" y1="76" x2="112" y2="76" stroke="var(--color-hairline)" />
      <line x1="8" y1="10" x2="8" y2="76" stroke="var(--color-hairline)" />
    </svg>
  );
}
