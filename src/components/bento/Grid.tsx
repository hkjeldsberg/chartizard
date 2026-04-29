import { cn } from "@/lib/utils";

// Row heights are tuned to the column width at each breakpoint so tiles
// tile into a single rectangle. Combined with Tile.tsx dropping the
// aspect-ratio override, every tile fills exactly its col-span × row-span
// cell area — no whitespace between, no overflow.
//   mobile  2-col  → col ≈ 150px, rows at 140px → tiles are ~square or 2:1
//   tablet  6-col  → col ≈ 80px,  rows at 80px
//   desktop 12-col → col ≈ 80px,  rows at 80px
export function Grid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bento-grid @container",
        "grid grid-cols-2 gap-3 auto-rows-[140px]",
        "@[520px]:grid-cols-6 @[520px]:auto-rows-[80px]",
        "@[900px]:grid-cols-12 @[900px]:auto-rows-[80px]",
        className,
      )}
      style={{ gridAutoFlow: "dense" }}
    >
      {children}
    </div>
  );
}
