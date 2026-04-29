import type { ChartFamily } from "@/lib/families";

interface PlaceholderTileProps {
  family: ChartFamily;
}

// Faint family-specific silhouettes — used for every "planned" chart.
// These are NOT precise renderings; they're the visual grammar of the family so
// the bento grid still reads as "a gallery of charts" before the real ones arrive.
export function PlaceholderTile({ family }: PlaceholderTileProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full opacity-50"
    >
      <g stroke="var(--color-ink-soft)" fill="none" strokeWidth="1.2" strokeLinecap="round">
        {renderFamily(family)}
      </g>
    </svg>
  );
}

function renderFamily(family: ChartFamily) {
  switch (family) {
    case "comparison":
      return (
        <>
          <rect x="14" y="40" width="10" height="30" fill="var(--color-ink-soft)" opacity="0.35" stroke="none" />
          <rect x="30" y="28" width="10" height="42" fill="var(--color-ink-soft)" opacity="0.35" stroke="none" />
          <rect x="46" y="50" width="10" height="20" fill="var(--color-ink-soft)" opacity="0.35" stroke="none" />
          <rect x="62" y="22" width="10" height="48" fill="var(--color-ink-soft)" opacity="0.35" stroke="none" />
          <rect x="78" y="36" width="10" height="34" fill="var(--color-ink-soft)" opacity="0.35" stroke="none" />
          <rect x="94" y="44" width="10" height="26" fill="var(--color-ink-soft)" opacity="0.35" stroke="none" />
        </>
      );
    case "composition":
      return (
        <>
          <circle cx="60" cy="40" r="24" />
          <path d="M60 40 L60 16 A24 24 0 0 1 81 52 Z" fill="var(--color-ink-soft)" opacity="0.25" stroke="none" />
          <path d="M60 40 L81 52 A24 24 0 0 1 41 56 Z" fill="var(--color-ink-soft)" opacity="0.15" stroke="none" />
        </>
      );
    case "distribution":
      return (
        <>
          <path d="M10 65 C28 65, 28 30, 45 30 C62 30, 62 65, 78 65 C90 65, 90 45, 108 45" />
          {[20, 30, 42, 52, 62, 70, 82, 95].map((x) => (
            <line key={x} x1={x} y1="68" x2={x} y2="72" />
          ))}
        </>
      );
    case "relationship":
      return (
        <>
          {[
            [22, 58], [36, 44], [28, 30], [52, 50], [64, 38], [72, 22],
            [80, 52], [92, 34], [46, 62], [100, 48],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.2" fill="var(--color-ink-soft)" opacity="0.45" stroke="none" />
          ))}
          <line x1="16" y1="66" x2="108" y2="20" strokeDasharray="2 3" opacity="0.5" />
        </>
      );
    case "flow":
      return (
        <>
          <rect x="14" y="30" width="20" height="20" rx="2" fill="var(--color-ink-soft)" opacity="0.25" stroke="none" />
          <rect x="50" y="14" width="20" height="20" rx="2" fill="var(--color-ink-soft)" opacity="0.25" stroke="none" />
          <rect x="50" y="46" width="20" height="20" rx="2" fill="var(--color-ink-soft)" opacity="0.25" stroke="none" />
          <rect x="86" y="30" width="20" height="20" rx="2" fill="var(--color-ink-soft)" opacity="0.25" stroke="none" />
          <line x1="34" y1="40" x2="50" y2="24" />
          <line x1="34" y1="40" x2="50" y2="56" />
          <line x1="70" y1="24" x2="86" y2="40" />
          <line x1="70" y1="56" x2="86" y2="40" />
        </>
      );
    case "change-over-time":
      return (
        <>
          <path d="M10 60 C24 56, 28 40, 42 44 C52 48, 56 30, 70 32 C82 34, 86 18, 108 14" />
          <path d="M10 66 C24 62, 28 52, 42 54 C52 56, 58 44, 70 48 C82 52, 86 38, 108 40" strokeDasharray="1 3" opacity="0.45" />
        </>
      );
    case "hierarchy":
      return (
        <>
          <circle cx="60" cy="18" r="4" fill="var(--color-ink-soft)" opacity="0.4" stroke="none" />
          <circle cx="28" cy="44" r="3" fill="var(--color-ink-soft)" opacity="0.4" stroke="none" />
          <circle cx="60" cy="44" r="3" fill="var(--color-ink-soft)" opacity="0.4" stroke="none" />
          <circle cx="92" cy="44" r="3" fill="var(--color-ink-soft)" opacity="0.4" stroke="none" />
          {[16, 24, 36, 48, 60, 72, 84, 96, 108].map((x, i) => (
            <circle key={i} cx={x} cy="68" r="2" fill="var(--color-ink-soft)" opacity="0.3" stroke="none" />
          ))}
          <line x1="60" y1="22" x2="28" y2="40" />
          <line x1="60" y1="22" x2="60" y2="40" />
          <line x1="60" y1="22" x2="92" y2="40" />
        </>
      );
    case "geospatial":
      return (
        <>
          <path d="M18 24 C28 16, 40 22, 52 18 C68 12, 82 28, 94 22 C102 18, 108 34, 104 48 C100 62, 84 66, 68 60 C52 54, 38 68, 24 58 C14 50, 14 34, 18 24 Z" fill="var(--color-ink-soft)" opacity="0.2" stroke="none" />
          <path d="M18 24 C28 16, 40 22, 52 18 C68 12, 82 28, 94 22 C102 18, 108 34, 104 48 C100 62, 84 66, 68 60 C52 54, 38 68, 24 58 C14 50, 14 34, 18 24 Z" />
          <circle cx="54" cy="40" r="2.5" fill="var(--color-ink)" opacity="0.5" stroke="none" />
        </>
      );
    case "specialty":
      return (
        <>
          <circle cx="60" cy="40" r="28" strokeDasharray="3 3" />
          <line x1="32" y1="40" x2="88" y2="40" />
          <line x1="60" y1="12" x2="60" y2="68" />
          <circle cx="60" cy="40" r="6" fill="var(--color-ink-soft)" opacity="0.4" stroke="none" />
        </>
      );
  }
}
