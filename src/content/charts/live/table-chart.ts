import type { LiveChart } from "@/content/chart-schema";

export const tableChart: LiveChart = {
  id: "table-chart",
  name: "Table Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "W",
  status: "live",

  synopsis:
    "Displays raw values in a row-column grid — the oldest data format in existence, predating every chart type in this atlas.",

  whenToUse:
    "Use a table when the precise value of each cell matters and the reader needs to look up, compare, or copy specific numbers. If the shape of the data (trend, distribution, proportion) is the point, a chart will communicate faster. If the number itself is the point, the table wins. Tables also outperform charts when readers need to cross-reference multiple attributes simultaneously.",

  howToRead:
    "Scan the header row to identify what each column measures. Read rows left-to-right to see one entity's full profile; read columns top-to-bottom to compare one attribute across entities. A bold total or summary row at the bottom aggregates the column. Sorted rows — here, by distance to the Broad Street pump — let the gradient of change emerge without any visual encoding at all.",

  example: {
    title: "John Snow's Broad Street cholera outbreak, London, 1854",
    description:
      "Snow compiled house-by-house death counts, attack rates, household sizes, and pump distances into a single table. The causal argument is latent in the column layout: sort by distance and deaths fall monotonically from 81 on Broad Street itself to 4 on King Street, 230 yards away. The map gets the fame; the table supplied the proof.",
  },

  elements: [
    {
      selector: "header-row",
      label: "Header row",
      explanation:
        "Each header cell names one variable. The column label is the only annotation the table provides; without it the values are orphaned numbers. Here the six columns name the street, its water source, and four epidemiological counts from Snow's original survey.",
    },
    {
      selector: "data-rows",
      label: "Data rows",
      explanation:
        "Each row is one observational unit — in this case one street near the Broad Street pump. Reading across a row gives a complete profile of that location. Alternating row shading is a visual separator, not an encoding; it carries no data.",
    },
    {
      selector: "column-borders",
      label: "Column borders",
      explanation:
        "Vertical rules separate columns and guide the eye down a single variable. The outer border closes the table, signalling that no values extend outside it. Cell padding keeps text from touching the rules.",
    },
    {
      selector: "distance-column",
      label: "Distance to pump (yards)",
      explanation:
        "Snow sorted his table by distance to the Broad Street pump, transforming a list into an argument. As distance increases from 19 to 230 yards, deaths drop from 81 to 4. No line is drawn; the gradient is legible in the numbers alone — the table's defining capability.",
    },
    {
      selector: "total-row",
      label: "Total row",
      explanation:
        "The bottom row aggregates numeric columns across all rows. In Snow's original document the totals confirmed the scale of the outbreak: 227 deaths and 273 attacks in a ten-street radius around a single pump over 10 days in August 1854.",
    },
    {
      selector: "source-caption",
      label: "Source caption",
      explanation:
        "A table without provenance is unverifiable. The source caption records where the data came from so a reader can check or update the values. Cuneiform tablets from Uruk c. 3500 BCE carried no author attribution; modern data practice adds it explicitly.",
    },
  ],
};
