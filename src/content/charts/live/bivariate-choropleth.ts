import type { LiveChart } from "@/content/chart-schema";

export const bivariateChoropleth: LiveChart = {
  id: "bivariate-choropleth",
  name: "Bivariate Choropleth",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Two variables encoded into a single colour per region, revealing correlation geography single-variable maps can't.",
  whenToUse:
    "Reach for a bivariate choropleth when the question is whether two measures move together across space. Median income × education, poverty × life expectancy, turnout × partisanship — the chart earns its cost when the spatial correlation is the insight, and a pair of side-by-side univariate maps would force the reader to do the join in their head.",
  howToRead:
    "Each region is binned on two axes simultaneously and coloured from a 3×3 palette. Find a region, then trace its fill back to the legend: the horizontal axis is one variable, the vertical is the other. The dark diagonal corner is where both variables are high; the light corner is where both are low. The two off-diagonal corners are where the variables diverge — those are the regions the bivariate encoding exists to surface.",
  example: {
    title: "Cynthia Brewer's bivariate palettes, 1990s",
    description:
      "Brewer and her collaborators at Penn State designed the ColorBrewer palettes partly to solve the bivariate-map problem: how to pack two quantitative variables into one colour channel without making readers fail a colour-matching task. The 3×3 grid is the practical cap. Nine distinguishable fills, an explicit legend, and a palette whose diagonal reads as intensity and whose off-diagonals read as hue — the US Census Bureau's American Community Survey atlases lean on this pattern heavily.",
  },
  elements: [
    {
      selector: "high-high-region",
      label: "High-high region",
      explanation:
        "Both variables are in their top tier. The dark diagonal corner of the palette — saturated blue-purple — is the densest visual mark, and the eye finds it first. Use the high-high fill sparingly; if more than a third of regions land here the bins are miscalibrated.",
    },
    {
      selector: "low-low-region",
      label: "Low-low region",
      explanation:
        "Both variables are in their bottom tier. The lightest neutral fill is the visual rest state. Regions with limited data or values near the low breakpoint for both variables cluster here.",
    },
    {
      selector: "mismatched-region",
      label: "Mismatched region",
      explanation:
        "A region where the two variables disagree — high on one, low on the other. Off-diagonal corners of the palette are tinted toward a single hue (blue or red), making these outliers visible. This is the insight the bivariate encoding exists for; a univariate income map would hide it.",
    },
    {
      selector: "bivariate-legend",
      label: "Bivariate legend",
      explanation:
        "The 3×3 swatch grid is not optional. Nine fills are beyond the colour-matching limit of most viewers — without an inline legend the map is unreadable. Place it where the eye lands after a cell hover, usually in the top-right of the plot.",
    },
    {
      selector: "income-axis",
      label: "Income axis",
      explanation:
        "The legend's horizontal axis. Each column is one income tier. Binning choice matters: equal-count (quantile) bins spread the fills evenly, equal-interval bins preserve absolute differences. Name the choice in a caption.",
    },
    {
      selector: "education-axis",
      label: "Education axis",
      explanation:
        "The legend's vertical axis. Each row is one education tier. Running education upward follows the convention that 'more' reads as up — if you reverse it to match a printing constraint, call that out explicitly.",
    },
  ],
};
