import type { LiveChart } from "@/content/chart-schema";

export const surfacePlot: LiveChart = {
  id: "surface-plot",
  name: "Surface Plot (x, y, z)",
  family: "specialty",
  sectors: ["mathematics"],
  dataShapes: ["continuous"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Renders z = f(x, y) as an isometrically projected wireframe so the eye can read shape — at the cost of whatever sits behind the front face.",
  whenToUse:
    "Use a surface plot when a reader needs an intuition for the shape of a smooth function of two variables — peaks, troughs, ridges, saddles. It is the best tool when topology is the story; it is the wrong tool when exact values matter, because the back face is occluded.",
  howToRead:
    "The wireframe is a grid of two curve families: one curve per y-row and one per x-column, drawn back-to-front so closer curves paint over further ones. Height above the base plane is the function's value at that (x, y); dips below the plane are negative values. The axis tripod at the origin fixes the orientation — X runs right-forward, Y runs left-forward, Z runs up.",
  example: {
    title: "MATLAB's surf() and the sombrero function",
    description:
      "The surface plot became the scientific-computing default after MATLAB shipped surf() in 1984, and the sinc-derived sombrero z = sin(r)/r is its canonical demo — a central peak surrounded by decaying rings that a contour plot can also show but a 3D surface makes immediately legible. The technique traces back to SURFACE II at the Kansas Geological Survey (1973), which first automated hidden-line removal for contoured terrain.",
  },
  elements: [
    {
      selector: "wireframe",
      label: "Wireframe mesh",
      explanation:
        "The two families of curves that trace the surface — constant-y and constant-x slices. Drawing each curve as a polyline keeps the geometry honest: no shading implies data that isn't there. Back-to-front paint order does the hidden-line work; no z-buffer required.",
    },
    {
      selector: "peak",
      label: "Peak",
      explanation:
        "The global maximum, at (0, 0) where sin(r)/r = 1 by limit. The surface plot is strongest here — a contour plot would show this as an innermost ring, but the 3D projection makes the height differ from the surrounding trough ring visible at a glance.",
    },
    {
      selector: "trough-ring",
      label: "First trough",
      explanation:
        "The ring where sin(r)/r first goes negative (r ≈ 4.5). Surface renders dips below the base plane with real visual drop; a heatmap would encode the same information as a colour band and lose the spatial intuition.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The first input coordinate, projected into screen space as (x − y)·cos 30°. Without an axis tripod the viewer cannot orient the surface — the shape alone is ambiguous under rotation.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The second input coordinate. In isometric projection X and Y share the horizontal plane; the angle between them on screen is 60°, not the 90° they span in world coordinates.",
    },
    {
      selector: "z-axis",
      label: "Z-axis",
      explanation:
        "The value axis. Vertical distance on screen is not proportional to z alone — it is (x + y)·sin 30° − z — but once the eye subtracts the base plane tilt, heights read correctly by relative comparison.",
    },
    {
      selector: "projection",
      label: "Isometric projection",
      explanation:
        "Screen x = (x − y)·cos 30°, screen y = (x + y)·sin 30° − z. An isometric projection preserves parallel lines and equal scale on all three axes, which is why engineering drawings have used it since the 19th century. Edward Tufte argued against gratuitous 3D; for topological intuition on smooth functions the scientific-visualisation community has largely kept surface plots anyway.",
    },
  ],
};
