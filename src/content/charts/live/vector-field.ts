import type { LiveChart } from "@/content/chart-schema";

export const vectorField: LiveChart = {
  id: "vector-field",
  name: "Vector Field / Quiver Plot",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Arrows on a grid show the direction of a 2D vector field at every sampled point.",
  whenToUse:
    "Reach for a quiver plot when the raw local direction of a field matters — fluid velocity, electric or magnetic field, wind, ocean currents. Pair with a streamline plot when the integrated path matters more than the instantaneous direction.",
  howToRead:
    "Read each arrow as what a small tracer placed at that grid point would do instantaneously. Direction is the orientation of the arrow; magnitude is encoded separately (here, by stroke thickness) so short arrows in a fixed-length convention still read as meaningful data. The global pattern is the point of the chart: arrows that form concentric tangent loops indicate a vortex, arrows that all point in one direction a uniform flow, arrows converging to a point a sink.",
  example: {
    title: "Maxwell's electromagnetic field (1861)",
    description:
      "James Clerk Maxwell's 'On Physical Lines of Force' in the Philosophical Magazine (1861) used arrow diagrams to argue that electromagnetic action propagates through a field filling space. Modern scientific computing inherited the idiom directly. Matplotlib's quiver() made the plot the default way to inspect a 2D velocity or force field in Python, from aerodynamics to plasma physics.",
  },
  elements: [
    {
      selector: "arrow",
      label: "Arrow",
      explanation:
        "One arrow per grid point. Its direction is the field V(x, y) sampled at that location. Arrows are drawn at fixed visual length so direction reads cleanly across the whole grid; magnitude is encoded by stroke thickness.",
    },
    {
      selector: "vortex-centre",
      label: "Vortex centre",
      explanation:
        "The origin of the flow. For a point vortex V = (-y, x) / sqrt(r^2 + 0.1), the field rotates counter-clockwise around this point. Arrows never point at it — they circle it.",
    },
    {
      selector: "near-centre",
      label: "Arrow near the centre",
      explanation:
        "Close to the vortex core the field magnitude is small (the +0.1 in the denominator softens the singularity). With thickness encoding magnitude, these arrows render faintest even though their direction is still well-defined.",
    },
    {
      selector: "far-edge",
      label: "Arrow far from the centre",
      explanation:
        "Out near r = 5 the 1/sqrt(r^2 + 0.1) falloff is mild, so magnitude is close to unity and arrows render thickest. This is the chart's main way of showing which regions of the field are 'fast' versus 'slow'.",
    },
    {
      selector: "tangent-signature",
      label: "Tangent-to-circle signature",
      explanation:
        "A point vortex has every arrow tangent to the circle of radius r centred on the origin. Recognising this pattern at a glance is the core skill of reading quiver plots — it tells you the field is rotational and has no radial component.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Horizontal spatial coordinate of the grid. The grid is 12 by 12 over x in [-5, 5], which is dense enough to show circulation but sparse enough that individual arrows remain legible.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Vertical spatial coordinate. Together (x, y) label the point at which the field is sampled; the arrow drawn there is the value V(x, y).",
    },
  ],
};
