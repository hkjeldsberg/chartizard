import type { LiveChart } from "@/content/chart-schema";

export const isosurfacePlot: LiveChart = {
  id: "isosurface-plot",
  name: "Isosurface Plot",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Renders the 2-manifold where a scalar field f(x, y, z) equals a chosen constant — the implicit surface buried inside a volume.",
  whenToUse:
    "Reach for an isosurface when the scalar you care about lives in a 3D volume — electron density, vorticity, CT intensity, signed-distance — and a single value of it carves out a surface with physical meaning. The height-field surface-plot only handles z = f(x, y); the isosurface handles f(x, y, z) = c, which can fold back on itself, nest, or split into disconnected components.",
  howToRead:
    "Read the shape as a level set, not a height: every point on the surface has the same field value c, and the interior and exterior of the shape are regions where the field is higher or lower than c. Lower the threshold c and the surface inflates; raise it and the surface shrinks toward the field's maxima. Isosurface plots only work with an explicit projection callout because 3D shape on paper is ambiguous — axis tripod and nodal markers are load-bearing, not decoration.",
  example: {
    title: "Hydrogen 2p orbital, |ψ|² = 0.01",
    description:
      "The 2p_z orbital's probability density z²·exp(-r) has two isosurface lobes aligned on the z-axis, pinched to a node at z = 0. Every quantum-chemistry textbook reproduces this shape — the isosurface at roughly 1% of peak density is what 'a 2p orbital' visually means. Raising the threshold to 0.05 collapses the lobes toward their tips; dropping it to 0.002 swells them into a pair of fat balloons.",
  },
  elements: [
    {
      selector: "isosurface",
      label: "Isosurface",
      explanation:
        "The 2-manifold defined by f(x, y, z) = c. For the 2p_z orbital at |ψ|² = 0.01 that surface is two prolate lobes along the z-axis. The shape is implicit — there is no single z for each (x, y), so a height-field surface-plot cannot draw it.",
    },
    {
      selector: "upper-lobe",
      label: "Upper lobe",
      explanation:
        "The positive-z half of the orbital. Its widest radius sits roughly halfway up the lobe, where z²·exp(-r) balances between the z² numerator growing and the exp(-r) denominator shrinking.",
    },
    {
      selector: "nodal-plane",
      label: "Nodal plane (z = 0)",
      explanation:
        "The xy-plane where |ψ|² vanishes because z² = 0. Every 2p orbital has exactly one nodal plane perpendicular to its axis — a consequence of the angular quantum number l = 1. The isosurface pinches to zero here and the lobes never touch.",
    },
    {
      selector: "lower-lobe",
      label: "Lower lobe",
      explanation:
        "The negative-z half. In a sign-carrying plot of ψ (not ψ²) this lobe would be opposite in sign from the upper one; because we plot density, both lobes are identical in magnitude and shape.",
    },
    {
      selector: "mesh",
      label: "Mesh triangle",
      explanation:
        "The isosurface is approximated by a triangulated mesh — here, a surface of revolution with 14 longitudes and 11 latitudinal rings. In general-purpose scientific-visualisation tools the mesh is extracted by marching cubes (Lorensen and Cline, 1987): sample the scalar field on a 3D grid, then at every grid cell emit triangles wherever the cell's edges cross the threshold.",
    },
    {
      selector: "projection",
      label: "Projection",
      explanation:
        "Isometric projection — equal foreshortening on all three axes, 30° lift. With no viewpoint cue the dumbbell could be read as two overlapping discs; the tripod and nodal tick fix the orientation. Faces are painted back-to-front (painter's algorithm) so nearer mesh covers farther mesh without a z-buffer.",
    },
  ],
};
