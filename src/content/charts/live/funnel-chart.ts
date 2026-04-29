import type { LiveChart } from "@/content/chart-schema";

export const funnelChart: LiveChart = {
  id: "funnel-chart",
  name: "Funnel Chart",
  family: "flow",
  sectors: ["marketing"],
  dataShapes: ["categorical"],
  tileSize: "T",
  status: "live",
  synopsis:
    "Stacked trapezoids whose widths are proportional to counts at each sequential stage of a conversion process.",
  whenToUse:
    "Reach for a funnel when you have a fixed, ordered sequence of stages and a count at each one — the canonical case is a purchase flow where every stage is a subset of the one above. Funnels pretend to be flow diagrams, but they are really stacked proportions wearing a costume. If your stages are not strictly nested, or the order is negotiable, use a bar chart or a Sankey instead and stop lying with the shape.",
  howToRead:
    "Each trapezoid's width encodes the count entering that stage relative to the top of the funnel. The narrowing between two adjacent stages is the drop-off, and the percentage next to it tells you how severe the bleed is. Read top to bottom for the cumulative story, but look at the step-to-step differences to find the leak — the widest narrowing is where the biggest cohort is being lost, not the narrowest trapezoid at the bottom.",
  example: {
    title: "E-commerce purchase funnel — 10,000 visits to 520 purchases",
    description:
      "An online storefront logs 10,000 visits, of which 6,400 view a product, 2,100 add to cart, 1,050 reach checkout, and 520 purchase. The eye is pulled to the final 520 at the bottom, but the largest single drop sits between product view and cart: 6,400 down to 2,100, a 67% loss in a single step. That is where product teams should focus, not checkout abandonment.",
  },
  elements: [
    {
      selector: "stage",
      label: "Stage",
      explanation:
        "One trapezoid, one stage of the process. Its top-width encodes the count entering the stage and its bottom-width encodes the count leaving for the next stage. The taper between the two edges is not decorative — it is the drop-off.",
    },
    {
      selector: "stage-label",
      label: "Stage label",
      explanation:
        "The name of the step plus the absolute count at that step. Always show the raw count alongside the trapezoid width; without the number, small differences read as noise and large differences read as cliffs.",
    },
    {
      selector: "drop-off",
      label: "Drop-off",
      explanation:
        "The step between two stages, where the funnel narrows. This is the chart's point of diagnostic value: the step with the steepest taper is the one bleeding the most users, regardless of how many were lost in absolute terms earlier.",
    },
    {
      selector: "conversion-rate",
      label: "Conversion rate",
      explanation:
        "The percentage of users from the previous stage who made it to the current stage, annotated to the right of each step. Raw counts hide the severity of stepwise loss at the bottom of the funnel, where every absolute number is small.",
    },
    {
      selector: "top-width",
      label: "Top width",
      explanation:
        "The total entering the funnel — the denominator for every percentage below. If this is a biased population (paid-traffic visitors, existing account-holders), every downstream stat inherits the bias.",
    },
    {
      selector: "bottom-width",
      label: "Bottom width",
      explanation:
        "The count of users who completed the final stage. Read against the top-width, not in isolation: 520 purchases is a 5.2% end-to-end conversion on 10,000 visits, which is the number a product manager actually has to explain.",
    },
  ],
};
