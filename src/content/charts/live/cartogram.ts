import type { LiveChart } from "@/content/chart-schema";

export const cartogram: LiveChart = {
  id: "cartogram",
  name: "Cartogram",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Distorts geography so each region's visual size matches its data value, not its square mileage.",
  whenToUse:
    "Reach for a cartogram when the story is about people, votes, or dollars — quantities whose visual weight should match their underlying count, not the land they sit on. It is the deliberate cure for the choropleth's area-bias problem: Wyoming stops dominating the page, California stops hiding behind its coastline. Skip it when the audience needs to navigate by geography (driving directions, tornado tracks, travel times) — a cartogram sacrifices legibility of place to tell a quantitative truth.",
  howToRead:
    "Read size first, position second. Each region is drawn with side-length proportional to the square root of its value, so area scales linearly with the underlying count. Neighbouring squares preserve only rough geographic adjacency — New York is still north of Virginia, California still sits on the left edge — but coastlines and shapes are gone. A single glance should tell you which regions carry most of the total; the layout exists to give you enough geographic memory to navigate, nothing more.",
  example: {
    title: "US population, 2024, rendered as a grid cartogram",
    description:
      "Using 2024 Census estimates, California (39M) becomes the largest square and dwarfs Wyoming (0.6M), which collapses to a near-invisible dot. The New York Times used exactly this technique for its 2016 election map — every county sized by votes cast — to counter the trope that the country was a sea of red. The red was real; the weight was not.",
  },
  elements: [
    {
      selector: "size-encoding",
      label: "Size encoding",
      explanation:
        "Every square's side-length is the square root of its population divided by the maximum. Taking the square root is the whole trick — it makes area (not side) proportional to the value, so the eye reads size as quantity. Without the square root, a state 10x more populous would look 100x bigger.",
    },
    {
      selector: "cell-size",
      label: "Cell size",
      explanation:
        "The California square is the visual anchor — sized to 39M, the largest in the dataset. In a choropleth California's physical shape would carry it; here its population does. The encoding strips away shape and lets magnitude do the talking.",
    },
    {
      selector: "largest-region",
      label: "Largest region",
      explanation:
        "Texas is the second-largest square (30M) — still geographically in the south, but no longer outranking CA just because it is wider on a map. The cartogram forces the reader to see population weight, not land area.",
    },
    {
      selector: "smallest-region",
      label: "Smallest region",
      explanation:
        "Vermont and DC collapse to near-dots. This is the deliberate inversion of the choropleth: low-count regions should not dominate the page, no matter how many square miles they occupy. If a dot feels unimportant, the encoding is working.",
    },
    {
      selector: "cell-label",
      label: "Cell label",
      explanation:
        "Larger squares carry their state code; smaller ones drop the label to avoid clutter. Labelling every square in a cartogram defeats the chart — the reader loses the shape of the data under typography. Label the top ~15 and let the rest work as texture.",
    },
    {
      selector: "legend",
      label: "Size scale",
      explanation:
        "A cartogram legend shows reference squares at chosen round numbers so the reader can calibrate the nonlinear mapping. Because the encoding uses a square-root scale, intermediate values appear closer in size than a naive linear glance would suggest — the legend is the calibration device.",
    },
  ],
};
