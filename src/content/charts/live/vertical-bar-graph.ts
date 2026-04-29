import type { LiveChart } from "@/content/chart-schema";

export const verticalBarGraph: LiveChart = {
  id: "vertical-bar-graph",
  name: "Vertical Bar Graph",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "William Playfair's 1786 invention — the first chart to ever replace a table of numbers with lengths the eye could compare directly.",
  whenToUse:
    "Reach for the vertical bar graph when the point of the chart is that a bar chart exists at all. For modern ranking tasks, prefer the general bar chart; for historical reproduction, teaching the invention of statistical graphics, or any argument that hinges on how graphics replaced tables, the Playfair form is the original article — alternating shading, plain baseline, value labels above each bar, no gridlines.",
  howToRead:
    "Every bar is one partner country; its height is the value of Scottish imports or exports in 1780–81. Read bars as lengths against the shared baseline — a bar twice as tall means twice the trade. Playfair ordered the bars alphabetically rather than by value; readers had to scan, not rank. The alternating dark-and-light shading is a strictly visual device, not an encoding — it keeps adjacent bars from blurring together when the chart is printed small.",
  example: {
    title: "Playfair's 1786 Commercial and Political Atlas — Scotland's 1781 imports",
    description:
      "The vertical bar graph made its first appearance as Chart 3 of William Playfair's 1786 *Commercial and Political Atlas*, showing Scotland's imports from seventeen partner countries for the year ending Christmas 1781. Ireland leads at roughly £117,000; Flanders trails at under £3,000; America is near-absent because the colonies were actively in revolt. Before this plate, a table of seventeen numbers needed a patient reader; after it, a glance did the arithmetic — which is why historians of graphics treat 1786 as year zero of statistical visualization.",
  },
  elements: [
    {
      selector: "bar",
      label: "Bar",
      explanation:
        "One rectangle per partner country. The height encodes value of trade in pounds sterling; the width is arbitrary and held constant across all bars so only height varies. Playfair fixed a convention here that still holds: width is scaffolding, height is data.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The common zero line every bar grows from. It is unlabelled in Playfair's original — he let value labels above each bar carry the scale — but its presence is what turns a row of rectangles into a comparable ranking.",
    },
    {
      selector: "value-label",
      label: "Value label",
      explanation:
        "The number above each bar. Playfair's original drops the y-axis entirely and relies on these labels for exact values, using the bar heights only to carry proportional judgement. A modern bar chart restores the y-axis; the historical form treats the label as primary.",
    },
    {
      selector: "alternating-shading",
      label: "Alternating shading",
      explanation:
        "Adjacent bars are filled light / dark / light / dark. This is a print-era typographical device — it keeps neighbouring bars visually distinct at small sizes and on hand-engraved plates. It encodes nothing; remove it and the chart still means the same thing.",
    },
    {
      selector: "country-label",
      label: "Country label",
      explanation:
        "The partner country name printed along the baseline. Playfair arranged them alphabetically rather than by value — a choice that forces the reader's eye to hunt for the tallest bar rather than read a ranking directly. Modern bar charts almost always resort by value; the alphabetical ordering is a historical artefact worth preserving in reproduction.",
    },
    {
      selector: "chart-frame",
      label: "Chart frame",
      explanation:
        "The ruled rectangle surrounding the plot. In 1786 Playfair drew a full frame with tick labels only on the left edge and carried the alphabetical country list along the bottom — the frame is the chart's furniture, not its data. This single plate invented the convention every bar chart since has inherited.",
    },
  ],
};
