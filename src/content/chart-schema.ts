import type { SectorId } from "@/lib/sectors";
import type { ChartFamily } from "@/lib/families";
import type { DataShape } from "@/lib/data-shapes";
import type { TileSize } from "@/components/bento/Tile";

export interface ChartElement {
  selector: string;
  label: string;
  explanation: string;
}

export interface RealWorldExample {
  title: string;
  description: string;
}

export interface ChartMeta {
  id: string;
  name: string;
  family: ChartFamily;
  sectors: ReadonlyArray<SectorId>;
  dataShapes: ReadonlyArray<DataShape>;
  tileSize: TileSize;
  status: "live" | "planned";
  synopsis?: string;
}

export interface LiveChart extends ChartMeta {
  status: "live";
  whenToUse: string;
  howToRead: string;
  example: RealWorldExample;
  elements: ReadonlyArray<ChartElement>;
}

export interface PlannedChart extends ChartMeta {
  status: "planned";
}

export type ChartEntry = LiveChart | PlannedChart;

export function isLiveChart(c: ChartEntry): c is LiveChart {
  return c.status === "live";
}

// Minimal runtime validation — throws on duplicate IDs or invalid live shape.
// Runs once at module load; keeps Zod out of the dependency tree for v1.
export function validateCatalog(entries: ReadonlyArray<ChartEntry>): void {
  const seen = new Set<string>();
  for (const c of entries) {
    if (seen.has(c.id)) {
      throw new Error(`Duplicate chart id: ${c.id}`);
    }
    seen.add(c.id);
    if (c.status === "live") {
      if (c.elements.length === 0) {
        throw new Error(`Live chart "${c.id}" has no elements[]`);
      }
      if (!c.example?.title) {
        throw new Error(`Live chart "${c.id}" missing real-world example`);
      }
    }
  }
}
