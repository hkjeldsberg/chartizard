export type DataShape =
  | "categorical"
  | "continuous"
  | "temporal"
  | "geospatial"
  | "hierarchical"
  | "network";

export const DATA_SHAPES: ReadonlyArray<{ id: DataShape; label: string }> = [
  { id: "categorical", label: "Categorical" },
  { id: "continuous", label: "Continuous" },
  { id: "temporal", label: "Temporal" },
  { id: "geospatial", label: "Geospatial" },
  { id: "hierarchical", label: "Hierarchical" },
  { id: "network", label: "Network" },
];
