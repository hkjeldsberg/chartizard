import type { LiveChart } from "@/content/chart-schema";

export const pyramidChart: LiveChart = {
  id: "pyramid-chart",
  name: "Pyramid Chart",
  family: "hierarchy",
  sectors: ["marketing"],
  dataShapes: ["categorical"],
  tileSize: "T",
  status: "live",
  synopsis:
    "Stacks tiers of decreasing width to assert that each level depends on the one below it.",
  whenToUse:
    "Use a pyramid when the categories are strictly ordered and each tier is a prerequisite for the one above. If your categories are peers — product lines, regions, age brackets — a pyramid lies about their relationship. Reach for a bar chart or a treemap instead.",
  howToRead:
    "Start at the bottom. The widest tier is the foundation, the narrowest is the aspiration. Vertical position is priority, not time. Width is the editorial signal the chart type is forcing on you: a wider tier is meant to read as more fundamental, not more numerous. If the author has put real quantities on the tiers, check whether width actually encodes them or whether it's purely symbolic — most published pyramids are the latter.",
  example: {
    title: "Maslow's hierarchy of needs, 1943",
    description:
      "Abraham Maslow never drew his hierarchy as a pyramid; he listed the five needs as prose in A Theory of Human Motivation. The pyramid shape was added by management consultants in the 1960s and has since become inseparable from the theory, largely because the widening base makes the dependency claim feel visually obvious. That is also the critique: the chart sells a strict ordering (self-actualization is impossible without esteem, impossible without love, etc.) that Maslow himself walked back.",
  },
  elements: [
    {
      selector: "peak-tier",
      label: "Peak tier",
      explanation:
        "The narrow top of the pyramid. Its small width signals scarcity: the fewest people reach it, and the chart type claims you cannot get there without everything below. In Maslow's version this is self-actualization.",
    },
    {
      selector: "tier-label",
      label: "Tier label",
      explanation:
        "The name and caption for each row. Without labels a pyramid is just a triangle — the labels are where the categorical information lives.",
    },
    {
      selector: "width-encoding",
      label: "Width encoding",
      explanation:
        "The decreasing width is the chart's single most important claim: each tier depends on the wider one below. That claim is rhetorical, not numeric. If the author wants width to carry a real quantity, they need to say so explicitly — most pyramids use width as pure symbol.",
    },
    {
      selector: "base-tier",
      label: "Base tier",
      explanation:
        "The widest tier at the bottom. It is foundational by construction: everything above inherits a dependency on it. In Maslow's version this is the physiological tier (food, water, sleep).",
    },
    {
      selector: "ordering-axis",
      label: "Ordering axis",
      explanation:
        "Vertical position encodes priority, not time or magnitude. Bottom-up means foundational-to-aspirational. A pyramid with categories that are not strictly ordered is the single most-common misuse of the chart type.",
    },
    {
      selector: "shape",
      label: "Pyramid shape",
      explanation:
        "The triangular silhouette is the chart. A rectangle with the same labels would not read as a dependency stack — the tapering is what sells the ordering. That power is also why the chart is so easy to abuse: it makes any list look like a hierarchy.",
    },
  ],
};
