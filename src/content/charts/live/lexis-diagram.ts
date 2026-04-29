import type { LiveChart } from "@/content/chart-schema";

export const lexisDiagram: LiveChart = {
  id: "lexis-diagram",
  name: "Lexis Diagram",
  family: "distribution",
  sectors: ["economics", "medicine"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Plots demographic data on three interlocking coordinate systems — period, age, and birth cohort — sharing a single 2D plane.",

  whenToUse:
    "Use a Lexis diagram when your question cannot be cleanly separated into age effects versus period effects versus cohort effects. Mortality surveillance, fertility trends, and labour-force participation all suffer from this entanglement; the Lexis surface makes it visible. If your question concerns only one of the three dimensions, a simpler line chart or bar chart suffices.",

  howToRead:
    "The x-axis is calendar year (period); the y-axis is age. A point at (year, age) represents an individual who was that age at that moment. The 45-degree diagonal lines are birth cohorts: follow a diagonal and you are watching one generation age through time. Shaded cells whose intensity is high in a vertical band indicate a period effect (a war, a pandemic year); intensity concentrated in a horizontal band indicates an age effect; intensity concentrated along a diagonal indicates a cohort effect.",

  example: {
    title: "1918 influenza pandemic mortality, Human Mortality Database",
    description:
      "On the Lexis surface the 1918 influenza spike appears as an intensified diagonal stripe cutting through the 18-35 age band during 1917-1920 — not a clean vertical column (which would signal a period effect equal across all ages) but a cohort-shaped slash. This showed epidemiologists that the young adults born around 1883-1900 were disproportionately killed, likely because prior influenza exposure had primed their immune systems for a cytokine-storm overreaction. A conventional age-standardised line chart obscures this completely.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "Period axis (calendar year)",
      explanation:
        "The horizontal axis encodes calendar time. A vertical slice through the diagram at any year captures a cross-section of the entire living population at that moment, regardless of birth cohort.",
    },
    {
      selector: "y-axis",
      label: "Age axis",
      explanation:
        "The vertical axis encodes age. A horizontal slice captures everyone who was that age at any calendar time — an age-specific rate over multiple generations and periods.",
    },
    {
      selector: "period-band",
      label: "Period band (1918 pandemic)",
      explanation:
        "The vertical shaded strip marks 1917-1920, the peak years of the influenza pandemic. Its light tint covers all ages, representing elevated mortality across the entire population during that period.",
    },
    {
      selector: "age-band",
      label: "Age band (18-35)",
      explanation:
        "The horizontal shaded band marks ages 18-35 — the range where influenza mortality was unexpectedly high. In a typical flu season, the very young and the elderly bear the greatest burden; the 1918 strain reversed this.",
    },
    {
      selector: "cohort-diagonal",
      label: "Birth-cohort diagonal",
      explanation:
        "Each dashed 45-degree diagonal line traces one birth cohort through age and time. Following the 1895 diagonal leftward-upward: that generation was born in 1895, reached age 23 in 1918, and experienced the worst of the pandemic at exactly military-service age.",
    },
    {
      selector: "cohort-intersection",
      label: "Cohort intersection (hardest-hit zone)",
      explanation:
        "The dark intersection of the period band and the age band is where influenza mortality was highest. Its diagonal shape is the Lexis diagram's diagnostic signature: it follows the 1883-1902 birth cohorts, not a clean period or age stratum, confirming a cohort-specific vulnerability.",
    },
  ],
};
