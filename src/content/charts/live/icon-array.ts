import type { LiveChart } from "@/content/chart-schema";

export const iconArray: LiveChart = {
  id: "icon-array",
  name: "Icon Array",
  family: "composition",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A 10×10 grid of 100 stick figures in which N icons are highlighted to show the frequency of an event — the standard format for communicating medical risk to non-specialist audiences.",

  whenToUse:
    "Use an icon array when a probability needs to be communicated to people without statistical training: clinical informed consent, public-health campaigns, screening decisions. The format works because viewers count discrete objects rather than decode a percentage. Reserve it for a single event probability at a time; layering two probabilities on one grid compounds cognitive load without adding clarity.",

  howToRead:
    "Each icon represents one person out of the reference population of 100. Dark icons are the people who experience the event; light icons are those who do not. Read the count directly — no scale, no axis. The 10×10 grid convention is deliberate: a square grid makes it easy to estimate at a glance that roughly a quarter, a third, or a half of the icons are highlighted.",

  example: {
    title: "Annual fall risk for adults aged 65+, Harding Center for Risk Literacy",
    description:
      "The Max Planck Institute's Harding Center uses 10×10 icon arrays in its evidence-based fact boxes distributed to German physicians and patients. For falls in older adults, 30 dark figures out of 100 outperforms the statement '30%' or '1 in 3' in comprehension tests (Galesic et al., Medical Decision Making, 2009): viewers asked to identify how many people would NOT be affected make 40% fewer errors with the icon array than with the verbal form.",
  },

  elements: [
    {
      selector: "event-icons",
      label: "Event icons",
      explanation:
        "The dark stick figures represent people in the reference class who experience the event. Their count is the numerator of the risk fraction. Placing them in the top-left corner — reading order — ensures viewers encounter the event cases first, which reduces anchoring on the complement.",
    },
    {
      selector: "non-event-icons",
      label: "Non-event icons",
      explanation:
        "The light figures are the people who do not experience the event. Their presence is as informative as the dark figures: both the event rate and its complement are simultaneously visible, which is the key cognitive advantage over pie charts and bar charts for risk communication.",
    },
    {
      selector: "grid-structure",
      label: "10×10 grid",
      explanation:
        "The 100-figure square grid is a Gigerenzer convention. 100 is a natural frequency denominator that people already think in (percentages), so the grid requires no translation. The square shape — rather than a single long row — allows the eye to estimate sub-quantities (rows of 10, blocks of 25) without counting every figure.",
    },
    {
      selector: "count-label",
      label: "Count label",
      explanation:
        "The '30 in 100' heading states the frequency explicitly so viewers who do not count the figures still receive the number. Gigerenzer insists on natural frequencies ('30 in 100') rather than percentages ('30%') or conditional probabilities ('0.30') because natural frequencies carry the sample size implicitly and are less prone to base-rate neglect.",
    },
    {
      selector: "verbal-frame",
      label: "Verbal frame",
      explanation:
        "The sentence below the grid names the population (adults aged 65+), the event (a fall), and the time horizon (each year). Without this frame the icon array is ambiguous: 30 in 100 what, over what period? The Cochrane Collaboration's patient decision-aid standards require all three components to appear alongside any risk figure.",
    },
  ],
};
