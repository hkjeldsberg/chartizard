import type { LiveChart } from "@/content/chart-schema";

export const pictogram: LiveChart = {
  id: "pictogram",
  name: "Pictogram",
  family: "comparison",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Repeats a single pictorial glyph at scale so counts become visible without reading numbers.",
  whenToUse:
    "Reach for a pictogram when the audience may not read axes fluently — or when the subject (people, animals, cups, rifles) has an icon that carries meaning a rectangle can't. Best with small integer multiples; breaks down above a few hundred units per row.",
  howToRead:
    "One glyph equals one unit of the stated scale, so count glyphs, not pixels. Fractional tails matter: a half-icon means half a unit, and rounding them up silently inflates the count. Compare rows by length, as you would a bar chart, but let the glyph itself remind you what is being counted.",
  example: {
    title: "Isotype — Otto Neurath and Gerd Arntz, Vienna 1925",
    description:
      "The International System Of TYpographic Picture Education was designed to make statistics legible to pre-literate readers at the Gesellschafts- und Wirtschaftsmuseum. Arntz's inked glyphs — workers, rifles, grain sacks — carried the subject and the count in one stroke. The movement's rule stands: show the truncated last icon. A pictogram with half-figures is honest; a pictogram rounded up to whole figures is propaganda.",
  },
  elements: [
    {
      selector: "unit-glyph",
      label: "Unit glyph",
      explanation:
        "One whole icon stands for exactly one unit on the scale — here, ten cups of coffee. The icon is chosen to look like its subject so the chart does not need a second legend.",
    },
    {
      selector: "fractional-glyph",
      label: "Fractional glyph",
      explanation:
        "The last icon in a row is rendered at partial width when the count does not land on a whole unit. Isotype's rule: show the truncation. Rounding a 6.5 up to 7 whole icons inflates the number by 8% and hides the honest remainder.",
    },
    {
      selector: "row-label",
      label: "Row label",
      explanation:
        "Each row is one category. The label sits left of the glyphs so the eye reads category → icon run → count, the same order as spoken language.",
    },
    {
      selector: "modal-row",
      label: "Modal row",
      explanation:
        "The longest row is the category with the highest count. Ranking rows from longest to shortest lets the reader pick the mode out at a glance — the reason this chart exists instead of a table.",
    },
    {
      selector: "scale-annotation",
      label: "Scale annotation",
      explanation:
        "The key that binds glyphs to numbers: one icon equals N units. Without it the chart is a cartoon. Always state the unit; never let the viewer guess whether a figure is one person or one thousand.",
    },
  ],
};
