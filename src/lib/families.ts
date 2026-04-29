export type ChartFamily =
  | "comparison"
  | "composition"
  | "distribution"
  | "relationship"
  | "flow"
  | "change-over-time"
  | "hierarchy"
  | "geospatial"
  | "specialty";

interface FamilyDef {
  id: ChartFamily;
  label: string;
  description: string;
}

export const FAMILIES: ReadonlyArray<FamilyDef> = [
  { id: "comparison", label: "Comparison", description: "Read values against each other" },
  { id: "composition", label: "Composition", description: "Parts of a whole" },
  { id: "distribution", label: "Distribution", description: "Shape of the data" },
  { id: "relationship", label: "Relationship", description: "Correlation between variables" },
  { id: "flow", label: "Flow", description: "Movement between states or entities" },
  { id: "change-over-time", label: "Change Over Time", description: "Trends and trajectories" },
  { id: "hierarchy", label: "Hierarchy", description: "Nested or parent–child structure" },
  { id: "geospatial", label: "Geospatial", description: "Geography and place" },
  { id: "specialty", label: "Specialty", description: "Domain-specific and technical charts" },
];

const BY_ID: Record<ChartFamily, FamilyDef> = Object.fromEntries(
  FAMILIES.map((f) => [f.id, f]),
) as Record<ChartFamily, FamilyDef>;

export function getFamily(id: ChartFamily): FamilyDef {
  return BY_ID[id];
}
