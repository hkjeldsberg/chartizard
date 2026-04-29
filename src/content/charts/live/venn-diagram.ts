import type { LiveChart } from "@/content/chart-schema";

export const vennDiagram: LiveChart = {
  id: "venn-diagram",
  name: "Venn Diagram",
  family: "relationship",
  sectors: ["mathematics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Three overlapping circles partition a population into every combination of set memberships.",
  whenToUse:
    "Reach for a Venn when the question is membership: which items belong to set A, which to B, which to both, and how many fall outside every set. It only earns its keep when every region carries a count — otherwise it's a logo, not a chart.",
  howToRead:
    "Each circle is a set. The overlap of two circles is items in both sets; the triple overlap is items in all three. Read the numbers, not the areas — Venn circles are drawn at fixed positions, so the region sizes are not proportional to the counts inside them. A region labelled with a small number inside a big visual sliver is normal.",
  example: {
    title: "Feature adoption across SaaS subscription tiers",
    description:
      "A product team draws a three-set Venn over Analytics, API access, and SSO users to decide where to invest next. The chart exposes that 7% of the user base uses all three features and that the API-only and SSO-only regions are each under 2%, meaning those features almost never land without Analytics alongside. The 32% outside all circles is the churn-risk segment.",
  },
  elements: [
    {
      selector: "set-circle",
      label: "Set circle",
      explanation:
        "One circle is one set. Its interior contains every item that has the property the set defines — here, every user of a given feature. Circle size is fixed for layout, not scaled to cardinality.",
    },
    {
      selector: "exclusive-region",
      label: "Exclusive region",
      explanation:
        "The part of a circle that sits outside every other circle holds items in that set and no others. The A-only sliver answers the question \"who uses Analytics but nothing else?\" — 35% of the user base here.",
    },
    {
      selector: "intersection",
      label: "Intersection",
      explanation:
        "Overlapping regions are items belonging to every circle that covers them. The three-way centre is the hardest region to earn: 7% of users reach for Analytics, API, and SSO together.",
    },
    {
      selector: "region-label",
      label: "Region label",
      explanation:
        "Every region needs an explicit count or percentage. Without labels you cannot distinguish \"A only\" from \"A∩B\" visually, because Venn region areas are not proportional to their cardinalities.",
    },
    {
      selector: "cardinality-rule",
      label: "Cardinality rule",
      explanation:
        "A Venn diagram is only a data chart if every region — including the area outside all circles — is labelled with a count. The 32% outside the circles here is as much a finding as anything inside them.",
    },
    {
      selector: "three-set-limit",
      label: "Three-set limit",
      explanation:
        "Three overlapping circles are the most a Venn can handle while keeping all seven regions legible. Four-set Venns require ellipses (Edwards, Venn's 1880 construction) and break the one-glance readability that makes the chart worth drawing.",
    },
  ],
};
