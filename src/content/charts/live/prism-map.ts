import type { LiveChart } from "@/content/chart-schema";

export const prismMap: LiveChart = {
  id: "prism-map",
  name: "Prism Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A choropleth extruded into 3D — each region's footprint is raised into a prism whose height encodes a value, projected in axonometric view.",
  whenToUse:
    "Reach for a prism map when a choropleth's colour ramp fails to carry the story — when the value range spans two or three orders of magnitude, or when the audience needs the comparison to feel physical rather than statistical. Height is a stronger perceptual channel than fill-tint, and stacking it on top of the geographic footprint keeps the 'where' and the 'how much' legible in one view. Avoid it when precision matters — occlusion and foreshortening turn exact comparison into guesswork.",
  howToRead:
    "Each state rises from its 2D footprint as a rectangular prism whose height is proportional to the value — here, 2024 population. Read the base for location and the top for magnitude. The axonometric projection preserves parallel lines so the eye can compare heights directly: California, Texas, and Florida stand as the tall front row; the northern states are flat slabs. Hidden-surface management relies on a back-to-front painter's algorithm: farther prisms draw first so closer ones overwrite them, and within each prism only the sides whose outward normals face the viewer are drawn at all.",
  example: {
    title: "US state population, 2024",
    description:
      "Ten simplified state footprints extruded by population. California's 39 million towers over Montana's 1.1 million by an almost comical margin — a choropleth would compress that ratio into a dark-red-versus-pale-red contrast that understates it. The prism map makes the ratio physical: one prism is roughly 35 times taller than another, and the eye reads that ratio instantly. The chart also teaches the technique's main weakness — you will notice that the tall foreground prisms (CA, TX) partially hide the mid-row states behind them. That is the cost of trading a flat colour scale for a vertical encoding.",
  },
  elements: [
    {
      selector: "prism",
      label: "Prism",
      explanation:
        "One state, one rectangular prism. The base is the state's footprint on the shared map plane; the top is a parallel copy raised by an amount proportional to the value. Every prism is drawn as three visible quadrilaterals — two side faces plus the top — the back faces are culled before rendering.",
    },
    {
      selector: "height-encoding",
      label: "Height encoding",
      explanation:
        "The vertical axis carries the quantitative channel. Heights are linearly proportional to value, so a prism twice as tall represents twice the population. The dashed reference line at the back-left corner marks the z-axis so the viewer can calibrate the tallest prism against the zero plane.",
    },
    {
      selector: "projection",
      label: "Axonometric projection",
      explanation:
        "Parallel lines in the scene stay parallel on screen — unlike a perspective projection, a prism twice as tall is drawn twice as tall regardless of where it sits on the map. The trade is that there is no vanishing point and no depth cue from foreshortening; the viewer reads depth from the slight downward-right shear of the y-axis alone.",
    },
    {
      selector: "occlusion",
      label: "Occlusion",
      explanation:
        "Tall prisms in the foreground hide short prisms behind them. This chart orients the view so the tallest prisms (California, Texas, Florida) sit in the front row and the shorter northern states sit cleanly in the back — the composition is doing work the projection cannot. A different view angle would fix one occlusion and create another.",
    },
    {
      selector: "base-map",
      label: "Base map",
      explanation:
        "The flat quadrilateral behind the prisms is the shared ground plane. It carries the geographic layer that the choropleth's colour ramp would have carried on its own. Keeping the base plane visible means the map is never lost — the viewer can still read 'which state' even when 'how much' is doing the loud work.",
    },
    {
      selector: "value-contrast",
      label: "Tall vs flat contrast",
      explanation:
        "New York in the back row stands roughly twenty times taller than neighbouring North Dakota, and the eye reads that ratio without needing the number. The prism map's whole claim is that this ratio is perceptually stronger than the equivalent choropleth fill-shade — dark red vs medium red vs light red collapses in a legend the viewer has to consult; two prisms with obviously different heights do not.",
    },
  ],
};
