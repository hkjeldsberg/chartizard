import type { LiveChart } from "@/content/chart-schema";

export const streamgraph: LiveChart = {
  id: "streamgraph",
  name: "Streamgraph",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal", "categorical"],
  tileSize: "W",
  status: "live",
  synopsis:
    "A stacked area chart with its stack centred on zero instead of rising from a baseline — thickness encodes magnitude, and no band sits privileged on top.",
  whenToUse:
    "Use a streamgraph when you have many temporal categories that each change gradually and you want to compare their shapes without the bottom-up bias of a stacked area chart. It is a shape-first view: good for feeling the rise and fall of a dozen music genres, topics, or product lines over years. Skip it when readers need exact values — absolute position is gone and only band thickness remains readable.",
  howToRead:
    "Each band is one category; its vertical thickness at any point is its magnitude at that time. Bands are centred around the zero line so no single category reads as the base. Slide your eye along a band and read its flow; compare thicknesses across bands to compare magnitudes. Resist reading the top or bottom of a band as an absolute number — neither is.",
  example: {
    title: "Lee Byron's Last.fm listening history (2008)",
    description:
      "The chart form was popularised by Lee Byron and Martin Wattenberg's 2008 paper and its companion New York Times piece on box-office results. Byron applied it to his own Last.fm listening history: you can watch entire bands crest and fade across years of his life without any genre being pinned to a baseline. The NYT piece proved it scaled to ~7,500 films — each title a tiny stream in a decades-long river.",
  },
  elements: [
    {
      selector: "band",
      label: "Band",
      explanation:
        "One category's layer in the stack — here, one music genre's listening share per year. Its vertical thickness at each point is what encodes its size; its horizontal shape is its story.",
    },
    {
      selector: "centre-baseline",
      label: "Centre baseline",
      explanation:
        "The zero-centred axis around which every band is stacked symmetrically. Unlike a standard stacked area chart, no category sits on the floor — the baseline is placed to minimise the chart's total sway, which is why the silhouette looks organic.",
    },
    {
      selector: "band-thickness",
      label: "Band thickness",
      explanation:
        "The vertical distance between a band's top and bottom edge at a given time. This is the chart's only encoding of magnitude — the absolute y-position of a band is a layout artefact, not data.",
    },
    {
      selector: "convergence-year",
      label: "Crossover year",
      explanation:
        "The year where hip-hop's thickness first exceeds pop's. On a line chart this would be the crossing point of two lines; on a streamgraph it is the moment one band visibly outswells its neighbour. It is the kind of editorial beat the form is built to reveal.",
    },
    {
      selector: "legend",
      label: "Legend",
      explanation:
        "The key between colour and category. Streamgraphs are unusable without one — an unlabelled stream is an abstract watercolour. Keep legend order aligned with the stack order so reading is a glance, not a hunt.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Time, running left to right at even spacing. The curve interpolation between years is cosmetic — only the values at tick positions are data. Irregular time intervals will distort the apparent flow; keep them uniform.",
    },
  ],
};
