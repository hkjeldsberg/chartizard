import type { LiveChart } from "@/content/chart-schema";

export const mosaicPlot: LiveChart = {
  id: "mosaic-plot",
  name: "Mosaic Plot (Marimekko)",
  family: "composition",
  sectors: ["statistics", "marketing"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Encodes a two-way contingency table as a grid whose cell areas equal joint probabilities.",
  whenToUse:
    "Reach for a mosaic when you have a cross-tabulation — two categorical variables with counts — and you need the reader to see marginal sizes and conditional breakdowns in the same image. It's the rare chart that shows the row total, the column total, and every cell at once.",
  howToRead:
    "Column width encodes the marginal: how much of the total population belongs to each region. Inside each column, horizontal bands encode the conditional: the share of each product within that region. Because both encodings are proportional, every cell's area equals the joint probability of its row and column. Compare widths to rank regions; compare band heights across columns to see where product preference shifts.",
  example: {
    title: "Survey cross-tab — product preference by region",
    description:
      "A 4000-respondent survey splits into four regions and four product choices. Render it as a mosaic and the dominance of Product A in West (50% of the narrowest column) reads as a small-but-tall rectangle, while East's more uniform preference reads as four bands of similar height in the widest column. A stacked bar chart would have hidden that West is much smaller than East; a pie-per-region would have hidden the between-region comparison. The mosaic keeps both.",
  },
  elements: [
    {
      selector: "cell",
      label: "Cell",
      explanation:
        "One bucket of the contingency table — here, North × Product A. The cell's area is proportional to the joint count (1120 × 40% = 448 respondents). Reading area takes practice; the width-times-height encoding is the whole point of the chart.",
    },
    {
      selector: "column-width",
      label: "Column width (marginal)",
      explanation:
        "Each column's horizontal extent encodes the share of respondents in that region — the marginal distribution over regions. North is widest (28%), West narrowest (20%). The mosaic's power is that this marginal is visible at the same time as the conditional breakdown inside.",
    },
    {
      selector: "band-height",
      label: "Band height (conditional)",
      explanation:
        "Inside each column, bands stack to 100% of that column. Heights encode the conditional probability of each product given the region. South's Product B band is tall (35%) because Product B leads in South, not because South is large.",
    },
    {
      selector: "column",
      label: "Column (one region)",
      explanation:
        "A full vertical stack represents one region's complete product breakdown. Scanning top-to-bottom inside a column is the same as reading a single-column stacked bar — the mosaic is four such stacks placed side by side, with their widths encoding extra information.",
    },
    {
      selector: "band",
      label: "Band (one product slice)",
      explanation:
        "The band for a single product in a single region. Compared across columns, the same-colored band is not a continuous strip (because bands above it vary), but tracing it still reveals which regions over- or under-index on that product.",
    },
    {
      selector: "axes",
      label: "Axes & legend",
      explanation:
        "Region names sit above each column; product categories are listed in the legend and distinguished by ink opacity. A mosaic can't carry a conventional y-axis — the y-scale is reset for each column — so the legend does the categorical work the axis would normally do.",
    },
  ],
};
