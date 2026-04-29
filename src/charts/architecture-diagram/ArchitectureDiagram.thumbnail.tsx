// Silhouette of an architecture diagram — three columns of shapes with a
// couple of Manhattan-routed arrows between them. Not a faithful rendering
// of the full chart; just the genre at a glance.
export function ArchitectureDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Column 1 — external actor (dashed rect, User) */}
      <rect
        x="6"
        y="14"
        width="22"
        height="14"
        rx="3"
        ry="3"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      {/* Column 1 — external (Stripe) */}
      <rect
        x="6"
        y="50"
        width="22"
        height="14"
        rx="3"
        ry="3"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Column 2 — services (solid rounded rects) */}
      <rect
        x="48"
        y="10"
        width="22"
        height="12"
        rx="3"
        ry="3"
        fill="var(--color-ink)"
        fillOpacity="0.14"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <rect
        x="48"
        y="34"
        width="22"
        height="12"
        rx="3"
        ry="3"
        fill="var(--color-ink)"
        fillOpacity="0.14"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <rect
        x="48"
        y="58"
        width="22"
        height="12"
        rx="3"
        ry="3"
        fill="var(--color-ink)"
        fillOpacity="0.14"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />

      {/* Column 3 — database (cylinder) */}
      <g>
        <rect
          x="92"
          y="14"
          width="22"
          height="14"
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth="1"
        />
        <ellipse
          cx="103"
          cy="14"
          rx="11"
          ry="2.6"
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth="1"
        />
        <path
          d="M 92 28 A 11 2.6 0 0 0 114 28"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1"
        />
      </g>

      {/* Column 3 — queue (stadium / pill) */}
      <rect
        x="92"
        y="36"
        width="22"
        height="10"
        rx="5"
        ry="5"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />

      {/* Column 3 — external (FedEx) */}
      <rect
        x="92"
        y="54"
        width="22"
        height="12"
        rx="3"
        ry="3"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Manhattan arrows — column 1 → 2 → 3, L-shaped jogs */}
      {/* User (actor) → Web (top service) */}
      <polyline
        points="28,21 48,21 48,16"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <polygon points="48,16 46.4,19 49.6,19" fill="var(--color-ink)" />

      {/* Mid service → database (L turn) */}
      <polyline
        points="70,40 81,40 81,21 92,21"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <polygon points="92,21 89,19.4 89,22.6" fill="var(--color-ink)" />

      {/* Mid service → queue (straight right) */}
      <polyline
        points="70,40.5 81,40.5 81,41 92,41"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <polygon points="92,41 89,39.4 89,42.6" fill="var(--color-ink)" />

      {/* Bottom service → FedEx external */}
      <polyline
        points="70,64 81,64 81,60 92,60"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <polygon points="92,60 89,58.4 89,61.6" fill="var(--color-ink)" />
    </svg>
  );
}
