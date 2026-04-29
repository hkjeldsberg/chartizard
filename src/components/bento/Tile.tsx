import Link from "next/link";
import { cn } from "@/lib/utils";
import { primarySurface, type SectorId } from "@/lib/sectors";

export type TileSize = "S" | "M" | "L" | "W" | "T";

// span mapping: [mobile, tablet@6col, desktop@12col] × [cols, rows]
// Row-spans at each breakpoint share a common divisor so `grid-auto-flow:
// dense` can always fill holes. Mobile/tablet: {1, 2}. Desktop: {2, 4}.
// Tile aspect ratio = (col-span × col-w) / (row-span × row-h); Grid.tsx's
// auto-rows sets row-h so the bento tiles into one rectangle without gaps.
const SIZE_MAP: Record<TileSize, string> = {
  S: "col-span-1 row-span-1 @[520px]:col-span-2 @[520px]:row-span-1 @[900px]:col-span-3 @[900px]:row-span-2",
  M: "col-span-2 row-span-1 @[520px]:col-span-3 @[520px]:row-span-1 @[900px]:col-span-4 @[900px]:row-span-2",
  L: "col-span-2 row-span-2 @[520px]:col-span-4 @[520px]:row-span-2 @[900px]:col-span-6 @[900px]:row-span-4",
  W: "col-span-2 row-span-1 @[520px]:col-span-6 @[520px]:row-span-1 @[900px]:col-span-8 @[900px]:row-span-2",
  T: "col-span-1 row-span-2 @[520px]:col-span-2 @[520px]:row-span-2 @[900px]:col-span-3 @[900px]:row-span-4",
};

interface TileProps {
  href: string;
  size: TileSize;
  sectors: ReadonlyArray<SectorId>;
  title: string;
  familyLabel?: string;
  eyebrow?: string;
  status: "live" | "planned";
  children: React.ReactNode;
}

export function Tile({
  href,
  size,
  sectors,
  title,
  familyLabel,
  eyebrow,
  status,
  children,
}: TileProps) {
  const surface = primarySurface(sectors);
  const isPlanned = status === "planned";

  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-lg",
        "border border-[--color-hairline]",
        "transition-[transform,box-shadow] duration-300",
        "hover:shadow-[0_6px_32px_-18px_rgba(26,22,20,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]",
        "@container/tile",
        SIZE_MAP[size],
      )}
      style={{ backgroundColor: surface }}
      data-status={status}
      aria-label={`${title}${isPlanned ? " — coming soon" : ""}`}
    >
      <div className="flex h-full w-full flex-col p-4 sm:p-5">
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[--color-ink-mute]">
            {eyebrow}
          </p>
        )}

        <div className="relative flex-1">
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              isPlanned && "opacity-60 transition-opacity group-hover:opacity-90",
            )}
          >
            {children}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <h3 className="font-display text-base leading-tight tracking-tight text-[--color-ink] @[200px]/tile:text-lg">
            {title}
          </h3>
          {familyLabel && (
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[--color-ink-mute]">
              {familyLabel}
            </span>
          )}
        </div>

        {isPlanned && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-[--color-ink]/15 bg-[--color-surface]/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[--color-ink-soft] backdrop-blur-sm">
            Soon
          </span>
        )}
      </div>
    </Link>
  );
}
