import type { LiveChart } from "@/content/chart-schema";

export const tileMap: LiveChart = {
  id: "tile-map",
  name: "Tile Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A choropleth's rival: every US state rendered as an equal-size square so Rhode Island reads as loud as Texas.",
  whenToUse:
    "Choose a tile map when the data story is about the states themselves, not their geography. A conventional choropleth drowns small states (Rhode Island, Delaware, DC) under their giant neighbours; equal tiles give every jurisdiction the same visual weight, which is what you want when the question is political, demographic, or policy-scoped and every state counts as one observation.",
  howToRead:
    "Read the grid as an approximate compass: the Pacific states sit on the left, the Atlantic states on the right, the South runs along the bottom. Colour encodes the variable (here, median household income). Because each tile is identical in area, your eye can't be fooled by Montana-sized whitespace — a pale tile in the South reads the same as a pale tile in New England, and the clusters emerge cleanly.",
  example: {
    title: "US election coverage, NPR and FiveThirtyEight",
    description:
      "NPR and FiveThirtyEight popularised tile maps during presidential primaries and general elections in the 2010s. The motivation is concrete: on a geographic US map Wyoming's three electoral votes occupy a vast rectangle while Rhode Island's four nearly disappear, which inverts the political signal. Tile maps fix that by handing every state the same pixel budget, so the electoral map reads as a political tally rather than a land survey.",
  },
  elements: [
    {
      selector: "state-tile",
      label: "State tile",
      explanation:
        "One square per jurisdiction, 50 states plus DC. Position roughly follows US geography but the tile's area is constant, so magnitude comes from colour alone. The two-letter USPS abbreviation sits inside in monospace; label ink flips from dark on light tiles to page-colour on dark tiles so it stays legible across the ramp.",
    },
    {
      selector: "high-income-cluster",
      label: "High-income cluster",
      explanation:
        "The Northeast corridor — Massachusetts, Connecticut, New Jersey, Maryland, New Hampshire, DC — prints as the grid's darkest band. On a conventional choropleth these states are narrow slivers that the eye can skim past; on a tile map they form an unmissable block.",
    },
    {
      selector: "low-income-cluster",
      label: "Low-income cluster",
      explanation:
        "Mississippi, West Virginia, Louisiana, Arkansas and Alabama run along the bottom as the palest tiles. The Deep South band is the tile-map's clearest editorial payoff: a stable economic pattern that a geographic choropleth obscures by weighting Mississippi against the emptiness of neighbouring Texas.",
    },
    {
      selector: "state-abbreviation",
      label: "State abbreviation",
      explanation:
        "The two-letter USPS code is the tile's only identifier. A tile map leans on the reader recognising that RI is Rhode Island — in exchange, the chart gives Rhode Island the same real estate as Texas. If your audience can't read USPS codes, this chart isn't the right one.",
    },
    {
      selector: "grid-layout",
      label: "Grid layout",
      explanation:
        "Twelve columns, eight rows, square cells. Positions follow the NPR / FiveThirtyEight convention: WA top-left of the lower 48, ME at the top-right, FL anchoring the southeast, AK floated above the Pacific Northwest and HI parked under California. Strict geographic accuracy is the price of equal weight — if your story depends on distance or adjacency, use a choropleth instead.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "The ramp runs from $50k (pale) to $100k (dark ink), covering the 2023 range for US state median household income. The scale is sequential because income is sequential; a diverging scale would be wrong here because there is no natural midpoint.",
    },
  ],
};
