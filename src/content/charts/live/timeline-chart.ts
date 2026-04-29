import type { LiveChart } from "@/content/chart-schema";

export const timelineChart: LiveChart = {
  id: "timeline-chart",
  name: "Timeline Chart",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "A horizontal spine annotated with dated events. The oldest chart form we still use — and the one where curation, not encoding, does the analytical work.",
  whenToUse:
    "Reach for a timeline when the story is a sequence of named moments on a shared axis of time. It is the right tool when readers need to see ordering, co-occurrence, and distance between events; it is the wrong tool when the quantity at each moment is what matters (use a line chart) or when events have duration worth comparing (use a Gantt).",
  howToRead:
    "Follow the spine left to right. Each marker is an event; its horizontal position is its date, nothing more. Labels are staggered above and below to avoid overlap, not to encode a second variable. Clusters — several events jammed into a few years — are the readable story: they show when the field was molten. Long gaps are the other story. Era bands behind the spine are editorial commentary, not data.",
  example: {
    title: "A Chart of Biography, Joseph Priestley, 1765",
    description:
      "The modern left-to-right timeline stabilised with Joseph Priestley's 1765 A Chart of Biography, which plotted two thousand famous lives as horizontal bars along a common time axis. The convention predates him by sixteen centuries — Trajan's Column (113 AD) already inscribed a war as a left-to-right sequence — but Priestley is where the conventions we still use were written down. The encoding is almost trivial. The analytical work is editorial: which twelve browsers make the cut, which era bands you draw, which cluster you let speak and which you let thin out.",
  },
  elements: [
    {
      selector: "event-marker",
      label: "Event marker",
      explanation:
        "A dot on the spine at the event's date. Size carries no meaning — every event is the same weight visually. If you find yourself wanting to size markers by importance, you are reaching for a different chart.",
    },
    {
      selector: "event-cluster",
      label: "Event cluster",
      explanation:
        "Several events falling within a short span. On this chart 1993-1996 packs Mosaic, Netscape, IE 1.0, and Opera into four years — the field went from one browser to five. Clusters are the readable signal a timeline gives you for free; leave them dense, do not spread the labels to hide them.",
    },
    {
      selector: "era-band",
      label: "Era band",
      explanation:
        "A soft background tint spanning a named period. Bands are editorial, not data: they tell the reader which framing to apply to the events inside them. Keep the tint faint so it sits behind the marks rather than competing with them.",
    },
    {
      selector: "year-axis",
      label: "Year axis",
      explanation:
        "The only axis a timeline has. It must be continuous and proportional — a year in the 1990s takes the same horizontal space as a year in the 2020s — otherwise the distances between clusters lie.",
    },
    {
      selector: "staggered-label",
      label: "Staggered label",
      explanation:
        "Labels alternate above and below the spine, and within each side across two rows, so adjacent events do not collide. The stagger is collision avoidance, nothing more: a label above does not mean anything different from a label below.",
    },
    {
      selector: "spine",
      label: "Spine",
      explanation:
        "The horizontal line the markers sit on. Keep it thin and continuous — it is a ruler, not an accent. Breaking the spine is a strong editorial move (it says the two sides are not on the same time axis) and should only be used when you mean it.",
    },
  ],
};
