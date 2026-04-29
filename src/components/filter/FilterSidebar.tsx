"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { cn } from "@/lib/utils";
import { SECTORS, type SectorId } from "@/lib/sectors";
import { FAMILIES, type ChartFamily } from "@/lib/families";
import { DATA_SHAPES, type DataShape } from "@/lib/data-shapes";
import {
  parseFilters,
  serializeFilters,
  toggleInList,
  type FilterState,
} from "./filter-state";
import type { ChartEntry } from "@/content/chart-schema";

interface FilterSidebarProps {
  charts: ReadonlyArray<ChartEntry>;
}

export function FilterSidebar({ charts }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      params[k] = v;
    });
    return parseFilters(params);
  }, [searchParams]);

  const navigate = (next: FilterState) => {
    const qs = serializeFilters(next).toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    });
  };

  const counts = useMemo(() => computeCounts(charts, filters), [charts, filters]);

  return (
    <aside
      className={cn(
        "flex flex-col gap-8 text-sm",
        isPending && "opacity-80 transition-opacity",
      )}
      aria-label="Filter charts"
    >
      <FacetGroup
        title="Availability"
        items={[
          { id: "live", label: "Live charts only", count: counts.live },
        ]}
        isActive={() => filters.liveOnly}
        onToggle={() => navigate({ ...filters, liveOnly: !filters.liveOnly })}
      />

      <FacetGroup
        title="Field / Sector"
        items={SECTORS.map((s) => ({
          id: s.id,
          label: s.label,
          count: counts.sector[s.id] ?? 0,
        }))}
        isActive={(id) => filters.sectors.includes(id as SectorId)}
        onToggle={(id) =>
          navigate({
            ...filters,
            sectors: toggleInList(filters.sectors, id as SectorId),
          })
        }
      />

      <FacetGroup
        title="Purpose / Family"
        items={FAMILIES.map((f) => ({
          id: f.id,
          label: f.label,
          count: counts.family[f.id] ?? 0,
        }))}
        isActive={(id) => filters.families.includes(id as ChartFamily)}
        onToggle={(id) =>
          navigate({
            ...filters,
            families: toggleInList(filters.families, id as ChartFamily),
          })
        }
      />

      <FacetGroup
        title="Data shape"
        items={DATA_SHAPES.map((d) => ({
          id: d.id,
          label: d.label,
          count: counts.shape[d.id] ?? 0,
        }))}
        isActive={(id) => filters.shapes.includes(id as DataShape)}
        onToggle={(id) =>
          navigate({
            ...filters,
            shapes: toggleInList(filters.shapes, id as DataShape),
          })
        }
      />
    </aside>
  );
}

interface FacetItem {
  id: string;
  label: string;
  count: number;
}

function FacetGroup({
  title,
  items,
  isActive,
  onToggle,
}: {
  title: string;
  items: ReadonlyArray<FacetItem>;
  isActive: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-ink-mute]">
        {title}
      </h3>
      <ul className="mt-3 space-y-1">
        {items.map((item) => {
          const active = isActive(item.id);
          const disabled = !active && item.count === 0;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                disabled={disabled}
                className={cn(
                  "flex w-full items-center justify-between rounded border border-transparent px-1.5 py-1 text-left text-[13px] transition-colors",
                  "hover:border-[--color-hairline] hover:bg-[--color-surface] hover:text-[--color-ink]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]",
                  active &&
                    "border-[--color-ink] bg-[--color-ink] text-[--color-page] hover:border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-page]",
                  disabled && "opacity-40 hover:border-transparent hover:bg-transparent",
                )}
                aria-pressed={active}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "ml-3 font-mono text-[11px] tabular-nums",
                    active ? "text-[--color-page]/80" : "text-[--color-ink-mute]",
                  )}
                >
                  {item.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Compute facet counts for the current filter state — each facet's count
// reflects what the selection would look like if that facet were toggled ON.
function computeCounts(
  charts: ReadonlyArray<ChartEntry>,
  filters: FilterState,
) {
  const sector: Partial<Record<SectorId, number>> = {};
  const family: Partial<Record<ChartFamily, number>> = {};
  const shape: Partial<Record<DataShape, number>> = {};
  let live = 0;

  for (const c of charts) {
    const matchesSector =
      filters.sectors.length === 0 ||
      c.sectors.some((s) => filters.sectors.includes(s));
    const matchesFamily =
      filters.families.length === 0 || filters.families.includes(c.family);
    const matchesShape =
      filters.shapes.length === 0 ||
      c.dataShapes.some((d) => filters.shapes.includes(d));
    const matchesLive = !filters.liveOnly || c.status === "live";

    if (matchesFamily && matchesShape && matchesLive) {
      for (const s of c.sectors) sector[s] = (sector[s] ?? 0) + 1;
    }
    if (matchesSector && matchesShape && matchesLive) {
      family[c.family] = (family[c.family] ?? 0) + 1;
    }
    if (matchesSector && matchesFamily && matchesLive) {
      for (const d of c.dataShapes) shape[d] = (shape[d] ?? 0) + 1;
    }
    if (matchesSector && matchesFamily && matchesShape && c.status === "live") {
      live += 1;
    }
  }

  return { sector, family, shape, live };
}
