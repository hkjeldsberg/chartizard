// Rich-picture silhouette: two stick figures with a speech bubble and a
// thought bubble, a cloud at top-right, and crossed swords between them.
// The deliberately-informal, pencil-sketch feel is the point.

export function RichPictureDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Cloud (top-right) */}
      <path
        d="M 86,14 Q 82,8 88,7 Q 92,3 98,6 Q 106,4 108,10 Q 112,12 108,16 Q 106,20 100,19 Q 92,22 88,18 Q 82,18 86,14 Z"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />

      {/* Thought bubble with two connector dots (left-top) */}
      <ellipse
        cx="24"
        cy="18"
        rx="14"
        ry="6"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <circle cx="22" cy="28" r="1.4" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="0.7" />
      <circle cx="20" cy="32" r="0.9" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="0.6" />

      {/* Left stick figure */}
      <g stroke="var(--color-ink)" strokeWidth="1" strokeLinecap="round" fill="none">
        <circle cx="18" cy="40" r="3" fill="var(--color-surface)" />
        <line x1="18" y1="43" x2="18" y2="54" />
        <line x1="18" y1="46" x2="12" y2="50" />
        <line x1="18" y1="46" x2="24" y2="50" />
        <line x1="18" y1="54" x2="13" y2="62" />
        <line x1="18" y1="54" x2="23" y2="62" />
      </g>

      {/* Right stick figure with speech bubble */}
      <g stroke="var(--color-ink)" strokeWidth="1" strokeLinecap="round" fill="none">
        <circle cx="96" cy="48" r="3" fill="var(--color-surface)" />
        <line x1="96" y1="51" x2="96" y2="62" />
        <line x1="96" y1="54" x2="90" y2="58" />
        <line x1="96" y1="54" x2="102" y2="58" />
        <line x1="96" y1="62" x2="91" y2="70" />
        <line x1="96" y1="62" x2="101" y2="70" />
      </g>
      <ellipse
        cx="96"
        cy="30"
        rx="14"
        ry="5"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <polygon
        points="92,34 98,34 94,42"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      {/* Cover bubble edge under tail */}
      <line x1="92" y1="34" x2="98" y2="34" stroke="var(--color-surface)" strokeWidth="1.4" />

      {/* Crossed swords in the middle */}
      <g stroke="var(--color-ink)" strokeWidth="1" fill="var(--color-surface)">
        <g transform="rotate(45 60 48)">
          <rect x="59" y="38" width="2" height="20" />
        </g>
        <g transform="rotate(-45 60 48)">
          <rect x="59" y="38" width="2" height="20" />
        </g>
        <rect x="55" y="46" width="10" height="3" fill="var(--color-ink)" />
      </g>

      {/* A labelled-arrow hint between the two figures */}
      <path
        d="M 30,48 Q 45,52 75,52"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.9"
      />
    </svg>
  );
}
