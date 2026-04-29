import type { LiveChart } from "@/content/chart-schema";

export const shmooPlot: LiveChart = {
  id: "shmoo-plot",
  name: "Shmoo Plot",
  family: "relationship",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A 2D grid of pass/fail cells over two test parameters — the blob of passing cells is the silicon's operating envelope.",
  whenToUse:
    "Reach for a shmoo plot when you need to communicate the operating envelope of a digital circuit across two swept test conditions — typically supply voltage against clock frequency, but also temperature, process corner, or timing margin. It is the canonical yield chart in silicon validation: a wide green region means shipping-ready; a narrow green island means the die barely works.",
  howToRead:
    "Each cell is one (V_cc, frequency) test point. Light cells passed; dark cells failed. The boundary between the two regions is the design margin, and its distance from the nominal operating point is the chip's head-room. Tight boundary lines hugging the nominal point are a warning; a wide passing region with the nominal point sitting comfortably in the interior is the design you want to ship. Tilted boundaries carry information too: the slope tells you how voltage-sensitive the frequency target is.",
  example: {
    title: "Intel, AMD, TSMC silicon characterisation",
    description:
      "A memory die swept from 1.0 V to 1.5 V against 100 to 400 MHz fails in the lower-right — low voltage cannot sustain a high clock — and passes in the upper-left. The diagonal boundary, carved by the relation V_cc >= 1.0 + 0.002 · f, is the design margin that the datasheet turns into a guaranteed operating window. Named in the 1960s at Bell Labs after Al Capp's amorphous Shmoo cartoon (Li'l Abner, 1948) because the passing region is blob-shaped.",
  },
  elements: [
    {
      selector: "boundary",
      label: "Pass/fail boundary",
      explanation:
        "The contour that separates the passing region from the failing region. This is the chart's whole point — the shape and slope of this line is the design margin. Tight against the nominal operating point means little head-room; pushed far into the swept range means the silicon has margin to spare.",
    },
    {
      selector: "pass-cell",
      label: "Passing cell",
      explanation:
        "Any cell in the light region — one (V_cc, frequency) point where the chip produced the expected output on every vector in the test suite. Engineers ship the die when the nominal operating point sits comfortably inside a block of passing cells.",
    },
    {
      selector: "fail-cell",
      label: "Failing cell",
      explanation:
        "Any cell in the dark region — one test point where at least one vector returned the wrong data. Failures cluster in the lower-right because a high clock starves the logic of setup-time when voltage drops. A scatter of isolated failures inside the passing block is a red flag for a marginal bit-cell or a noise-sensitive path.",
    },
    {
      selector: "x-axis",
      label: "Supply voltage",
      explanation:
        "The first swept parameter — V_cc, the rail powering the logic. Lower voltage reduces drive strength and slows transitions; higher voltage accelerates timing but burns power and ages the die faster. The plot asks: how low can you go before the die stops working?",
    },
    {
      selector: "y-axis",
      label: "Clock frequency",
      explanation:
        "The second swept parameter — the target clock the chip is asked to meet. Higher frequency shrinks the window in which each gate must settle. The plot asks: how fast can you clock the die at this voltage before paths fail?",
    },
  ],
};
