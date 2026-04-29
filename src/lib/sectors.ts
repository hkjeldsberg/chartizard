export type SectorId =
  | "general"
  | "statistics"
  | "data-science"
  | "time-series"
  | "hierarchical"
  | "networks"
  | "flow"
  | "finance"
  | "business"
  | "project-management"
  | "quality"
  | "marketing"
  | "economics"
  | "politics"
  | "medicine"
  | "biology"
  | "genetics"
  | "chemistry"
  | "physics"
  | "earth-sciences"
  | "electrical"
  | "mechanical"
  | "software"
  | "cartography"
  | "decision-analysis"
  | "mathematics"
  | "linguistics"
  | "astrology"
  | "social-sciences"
  | "infographics";

interface SectorDef {
  id: SectorId;
  label: string;
  short: string;
  surface: string;
}

const ORDER: SectorDef[] = [
  { id: "general", label: "General Purpose", short: "General", surface: "var(--color-surface-general)" },
  { id: "statistics", label: "Statistics", short: "Stats", surface: "var(--color-surface-statistics)" },
  { id: "data-science", label: "Data Science & ML", short: "Data Sci", surface: "var(--color-surface-statistics)" },
  { id: "time-series", label: "Time Series & Temporal", short: "Time", surface: "var(--color-surface-slate)" },
  { id: "hierarchical", label: "Hierarchical & Tree", short: "Hierarchy", surface: "var(--color-surface-earth)" },
  { id: "networks", label: "Networks & Graphs", short: "Networks", surface: "var(--color-surface-software)" },
  { id: "flow", label: "Flow & Process", short: "Flow", surface: "var(--color-surface-software)" },
  { id: "finance", label: "Finance & Trading", short: "Finance", surface: "var(--color-surface-finance)" },
  { id: "business", label: "Business & Management", short: "Business", surface: "var(--color-surface-business)" },
  { id: "project-management", label: "Project Management", short: "PM", surface: "var(--color-surface-business)" },
  { id: "quality", label: "Quality & Process Improvement", short: "Quality", surface: "var(--color-surface-business)" },
  { id: "marketing", label: "Marketing & Sales", short: "Marketing", surface: "var(--color-surface-finance)" },
  { id: "economics", label: "Economics & Demographics", short: "Econ", surface: "var(--color-surface-finance)" },
  { id: "politics", label: "Political Science", short: "Politics", surface: "var(--color-surface-medicine)" },
  { id: "medicine", label: "Medicine & Healthcare", short: "Medicine", surface: "var(--color-surface-medicine)" },
  { id: "biology", label: "Biology & Life Sciences", short: "Biology", surface: "var(--color-surface-biology)" },
  { id: "genetics", label: "Genetics & Bioinformatics", short: "Genetics", surface: "var(--color-surface-biology)" },
  { id: "chemistry", label: "Chemistry & Biochemistry", short: "Chemistry", surface: "var(--color-surface-chemistry)" },
  { id: "physics", label: "Physics & Astronomy", short: "Physics", surface: "var(--color-surface-physics)" },
  { id: "earth-sciences", label: "Earth Sciences & Meteorology", short: "Earth", surface: "var(--color-surface-earth)" },
  { id: "electrical", label: "Electrical / Signal / Control", short: "EE", surface: "var(--color-surface-software)" },
  { id: "mechanical", label: "Mechanical & Process Eng.", short: "Mech", surface: "var(--color-surface-earth)" },
  { id: "software", label: "Software & Systems Eng.", short: "Software", surface: "var(--color-surface-software)" },
  { id: "cartography", label: "Cartography & GIS", short: "Maps", surface: "var(--color-surface-earth)" },
  { id: "decision-analysis", label: "Decision Analysis & Systems", short: "Decision", surface: "var(--color-surface-business)" },
  { id: "mathematics", label: "Mathematics & Logic", short: "Math", surface: "var(--color-surface-statistics)" },
  { id: "linguistics", label: "Linguistics", short: "Ling", surface: "var(--color-surface-general)" },
  { id: "astrology", label: "Astrology / Esoteric", short: "Astrology", surface: "var(--color-surface-physics)" },
  { id: "social-sciences", label: "Social Sciences", short: "Social", surface: "var(--color-surface-business)" },
  { id: "infographics", label: "Infographics & Communication", short: "Info", surface: "var(--color-surface-general)" },
];

export const SECTORS: ReadonlyArray<SectorDef> = ORDER;

const BY_ID: Record<SectorId, SectorDef> = Object.fromEntries(
  ORDER.map((s) => [s.id, s]),
) as Record<SectorId, SectorDef>;

export function getSector(id: SectorId): SectorDef {
  return BY_ID[id];
}

export function primarySurface(sectors: ReadonlyArray<SectorId>): string {
  const first = sectors[0];
  return first ? BY_ID[first].surface : "var(--color-surface-slate)";
}
