import type { LiveChart } from "@/content/chart-schema";

export const starPlot: LiveChart = {
  id: "star-plot",
  name: "Star Plot / Kiviat Diagram",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A single entity profiled across many axes — one polyline, one shape, one signature.",
  whenToUse:
    "Use a star plot when you want the reader to recognise one entity's profile at a glance: a wine's tasting notes, a candidate's skill mix, a machine's performance signature. The chart's job is the silhouette, not the number. If you need to compare two or more profiles, switch to a radar chart — overlapping polylines on a star plot quickly become unreadable.",
  howToRead:
    "Seven axes radiate from the centre. Each axis is a separate variable, scored on a common 0–10 scale. A value is plotted as a point at the appropriate distance along its axis, and the points are connected into a closed polyline. Shapes that balloon outward mean the entity scores high across the board; shapes that spike along one or two axes name the entity's distinguishing traits. The centre is zero. The order of axes around the dial is an editorial choice — rotate it and the silhouette changes, so keep it fixed when comparing variants of the same profile.",
  example: {
    title: "Kiviat (1975) benchmarking mainframe performance",
    description:
      "Philip Kiviat introduced this layout at a 1973 ACM workshop, published in 1975, to profile a single computer system across axes like CPU utilisation, memory residency, and I/O wait time. IBM capacity planners adopted it to spot which resource a workload actually stressed — a CPU-bound job and an I/O-bound job had visibly different silhouettes even when their aggregate throughput matched.",
  },
  elements: [
    {
      selector: "axis",
      label: "Axis",
      explanation:
        "One radial spoke per variable. Each axis runs from zero at the centre to its maximum at the rim, and each carries its own unit in principle — though star plots typically normalise every axis to a common 0–10 or 0–100 scale so the shape is comparable across axes.",
    },
    {
      selector: "tick-grid",
      label: "Tick grid",
      explanation:
        "Concentric polygons at regular intervals give the eye a scale. Without the grid the reader has no way to estimate individual values — the shape tells you the profile, the grid tells you the magnitude.",
    },
    {
      selector: "polyline",
      label: "Profile polyline",
      explanation:
        "The closed line connecting the seven values is the chart's subject. Its shape is the entity's signature — a balloon means balanced strength, a star with long arms names the traits that dominate. This is the single-entity cousin of the radar chart, which overlays several polylines on the same grid.",
    },
    {
      selector: "value-mark",
      label: "Value mark",
      explanation:
        "A single vertex — one axis's score. The dot fixes the polyline at a precise radius, so the reader can read an individual value without being distracted by the polygon's overall shape.",
    },
    {
      selector: "origin",
      label: "Centre origin",
      explanation:
        "The origin is zero on every axis. A collapsed polyline pulled toward the centre is a weak profile across the board; a polyline that hugs the centre on one axis names a specific deficit.",
    },
  ],
};
