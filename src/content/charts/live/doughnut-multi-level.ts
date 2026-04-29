import type { LiveChart } from "@/content/chart-schema";

export const doughnutMultiLevel: LiveChart = {
  id: "doughnut-multi-level",
  name: "Multi-Level Doughnut",
  family: "composition",
  sectors: ["general", "hierarchical"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Concentric rings where each ring is a level of hierarchy and the centre hole hosts the total.",
  whenToUse:
    "Reach for a multi-level doughnut when you have strict two- or three-level categorical hierarchy AND a total you want the viewer to read without scanning. The hole in the middle is not decoration — it is a display surface for the KPI. Use sunburst instead when the hierarchy is three-plus levels deep; its filled centre exploits radial space that the doughnut sacrifices for the KPI.",
  howToRead:
    "Read outward from the hole. The inner ring is the top-level composition; each inner wedge's angular sweep defines the bounds of its children in the outer ring. Sub-category colours are the parent's colour at lower opacity — this is the only channel tying a child to its parent, since the two rings are structurally separate arcs. The centre carries magnitude; the rings carry structure. Never exceed three rings: beyond that the outer ring's sub-wedges become too narrow to label.",
  example: {
    title: "SaaS operating-expense breakdown, Q1 FY25",
    description:
      "Personnel dominates at 60% (Salaries 75% of that, Benefits 17%, Training 8%); Facilities is 18% (mostly Rent), Operations 14% (Cloud the largest), R&D 8%. The $24.3M total in the hole anchors the structure in dollar terms. The same data as a flat pie would produce thirteen slivers and no hierarchy; the doughnut preserves the Personnel→Salaries composition that is the real story of a people-heavy company.",
  },
  elements: [
    {
      selector: "inner-ring",
      label: "Inner ring",
      explanation:
        "The top-level categorical breakdown. Each wedge's angle is its share of the whole. Order largest-first clockwise from 12 o'clock so rank is readable without re-sorting.",
    },
    {
      selector: "outer-ring",
      label: "Outer ring",
      explanation:
        "The sub-category level. Each outer wedge sits inside its parent's angular sweep and takes its share of that sweep, not the whole. Children always alias to their parent by position — the outer ring cannot be re-sorted independently.",
    },
    {
      selector: "centre-hole",
      label: "Centre hole",
      explanation:
        "The defining difference from sunburst. The hole is a display surface for a title, total, or KPI — here the $24.3M opex total. Sunburst fills this space with the root node; the doughnut sacrifices that pixel real-estate to keep magnitude visible alongside structure.",
    },
    {
      selector: "ring-alignment",
      label: "Ring alignment",
      explanation:
        "The radial line where an inner-ring boundary continues into the outer ring is the chart's structural rule: children never cross their parent's bounds. Mis-aligned rings break the hierarchy read — each sub-wedge must start and end exactly where its parent does.",
    },
    {
      selector: "parent-child-colour",
      label: "Parent-child colour",
      explanation:
        "Sub-categories inherit their parent's hue at reduced opacity. This is the chart's only hierarchy-aliasing channel; if you colour the outer ring independently, viewers lose the mapping from sub to parent and the two rings become two unrelated pies.",
    },
  ],
};
