import type { ChartEntry } from "@/content/chart-schema";
import type { SectorId } from "@/lib/sectors";
import type { ChartFamily } from "@/lib/families";
import type { DataShape } from "@/lib/data-shapes";

export interface FilterState {
  sectors: ReadonlyArray<SectorId>;
  families: ReadonlyArray<ChartFamily>;
  shapes: ReadonlyArray<DataShape>;
  liveOnly: boolean;
}

const EMPTY: FilterState = {
  sectors: [],
  families: [],
  shapes: [],
  liveOnly: false,
};

type SearchParamValue = string | ReadonlyArray<string> | undefined;
type SearchParams = Record<string, SearchParamValue>;

function readList<T extends string>(value: SearchParamValue): T[] {
  if (!value) return [];
  const raw: string = typeof value === "string" ? value : value.join(",");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as T[];
}

export function parseFilters(params: SearchParams): FilterState {
  return {
    sectors: readList<SectorId>(params.sector),
    families: readList<ChartFamily>(params.family),
    shapes: readList<DataShape>(params.shape),
    liveOnly: params.live === "1",
  };
}

export function isEmptyFilter(f: FilterState): boolean {
  return (
    f.sectors.length === 0 &&
    f.families.length === 0 &&
    f.shapes.length === 0 &&
    !f.liveOnly
  );
}

export function applyFilters(
  charts: ReadonlyArray<ChartEntry>,
  f: FilterState,
): ChartEntry[] {
  return charts.filter((c) => {
    if (f.liveOnly && c.status !== "live") return false;
    if (f.sectors.length && !c.sectors.some((s) => f.sectors.includes(s))) return false;
    if (f.families.length && !f.families.includes(c.family)) return false;
    if (f.shapes.length && !c.dataShapes.some((d) => f.shapes.includes(d))) return false;
    return true;
  });
}

export function serializeFilters(f: FilterState): URLSearchParams {
  const out = new URLSearchParams();
  if (f.sectors.length) out.set("sector", f.sectors.join(","));
  if (f.families.length) out.set("family", f.families.join(","));
  if (f.shapes.length) out.set("shape", f.shapes.join(","));
  if (f.liveOnly) out.set("live", "1");
  return out;
}

export function toggleInList<T>(list: ReadonlyArray<T>, value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export { EMPTY as EMPTY_FILTER };
