import { LIVE_CHARTS } from "./live";
import { PLACEHOLDER_CHARTS } from "./placeholders";
import { validateCatalog, type ChartEntry } from "@/content/chart-schema";

const all: ReadonlyArray<ChartEntry> = [...LIVE_CHARTS, ...PLACEHOLDER_CHARTS];

validateCatalog(all);

export const ALL_CHARTS: ReadonlyArray<ChartEntry> = all;

const byId: Record<string, ChartEntry> = Object.fromEntries(
  all.map((c) => [c.id, c]),
);

export function getChartById(id: string): ChartEntry | undefined {
  return byId[id];
}

export { LIVE_CHARTS, PLACEHOLDER_CHARTS };
