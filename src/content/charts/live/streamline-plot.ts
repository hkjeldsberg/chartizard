import type { LiveChart } from "@/content/chart-schema";

export const streamlinePlot: LiveChart = {
  id: "streamline-plot",
  name: "Streamline Plot",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Integral curves of a 2D vector field, drawn from scattered seed points integrated forward and backward in time.",
  whenToUse:
    "Reach for streamlines when the integrated path through a field matters more than the field's local direction at any one point. They are the classical idiom of fluid dynamics, and the natural partner chart to a quiver plot of the same field: arrows show what a tracer would do instantaneously, streamlines show what it would do over time.",
  howToRead:
    "Each curve is the trajectory a particle would follow if dropped at a seed point and pushed by the field V(x, y). The curves never cross in a steady flow. Bunched streamlines mean high speed; widely spaced streamlines mean low speed. For this point vortex V = (-y, x) / sqrt(r^2 + 0.1), the curves are concentric circles and the radius of each ring labels its seed distance from the centre.",
  example: {
    title: "Reynolds's dye-streak experiments (1883)",
    description:
      "Osborne Reynolds's 1883 paper in the Philosophical Transactions of the Royal Society, 'An experimental investigation of the circumstances which determine whether the motion of water shall be direct or sinuous, and of the law of resistance in parallel channels', introduced streamlines to experimental fluid mechanics by injecting coloured dye into pipe flow. In 2D steady flow, streamlines, pathlines, and streaklines coincide — a pedagogically important fact that makes the chart readable as any of the three interpretations.",
  },
  elements: [
    {
      selector: "streamline",
      label: "Streamline",
      explanation:
        "One integral curve of the vector field. Computed here with a fourth-order Runge-Kutta integrator stepping 200 times forward and 200 times backward from each seed, at dt = 0.05.",
    },
    {
      selector: "vortex-centre",
      label: "Vortex centre",
      explanation:
        "The origin of the flow. For a pure rotation V = (-y, x) / sqrt(r^2 + 0.1), streamlines circle this point without ever reaching it. Any closed curve that encircles the vortex has non-zero circulation.",
    },
    {
      selector: "concentric-signature",
      label: "Concentric-circle signature",
      explanation:
        "Fifteen streamlines nested as concentric rings is the visual fingerprint of a point vortex. Recognising the pattern tells you the flow is rotational and axisymmetric before you read a single coordinate.",
    },
    {
      selector: "seed-point",
      label: "Seed point",
      explanation:
        "Each small dot is where integration started. The curve passing through a seed is the particle trajectory through that point; integrating backward as well as forward makes the curve pass through the seed rather than starting at it.",
    },
    {
      selector: "tight-streamline",
      label: "Small-radius streamline",
      explanation:
        "A streamline seeded close to the origin circles in a tight loop. Because this field's magnitude is softened near r = 0, tight loops do not diverge — a naked 1/r vortex would spin infinitely fast at the core.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Horizontal spatial coordinate. The domain x in [-5, 5] matches the sibling vector-field plot so the two renderings of the same flow are directly comparable.",
    },
  ],
};
