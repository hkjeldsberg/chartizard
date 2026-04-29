import type { LiveChart } from "@/content/chart-schema";

export const voronoiDiagram: LiveChart = {
  id: "voronoi-diagram",
  name: "Voronoi Diagram",
  family: "relationship",
  sectors: ["networks", "mathematics"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Partitions a plane into cells, one per seed point, where each cell contains every location closer to that seed than to any other.",
  whenToUse:
    "Reach for a Voronoi diagram when a set of point locations implies a space, not just a scatter — service areas around stores, catchment zones around hospitals, dominion zones around transmitters. It answers the question \"which point is closest?\" for every pixel at once. Avoid it when the seeds are ordered or hierarchical; a Voronoi treats every seed as equal and discards any ranking you might want to preserve.",
  howToRead:
    "Pick any point inside the bounding box and ask which seed is closest to it. That seed owns the cell the point sits in. Cell boundaries are the set of points equidistant to two seeds, so an edge between two cells is the perpendicular bisector of the segment joining their seeds. Vertices where three cells meet are equidistant to three seeds — the circumcenters of their triangle. Large cells signal lonely seeds with no close neighbours; tightly clustered seeds produce a fine mosaic of small cells.",
  example: {
    title:
      "Closest-POI search at Airbnb and Yelp — the Voronoi as a catchment map",
    description:
      "Dirichlet introduced these partitions in 1850 and Voronoi formalised them in 1908, but their modern payoff is in closest-point-of-interest search: a city with a few hundred coffee shops can be precomputed into a Voronoi mesh, after which any user coordinate returns its nearest shop in a single cell lookup. Airbnb, retail-chain site-selection teams, and game-AI pathfinders all lean on the same idea — partition the plane once, query cheaply forever.",
  },
  elements: [
    {
      selector: "cell",
      label: "Cell",
      explanation:
        "One polygon around one seed. Every point inside the cell is closer to that seed than to any other. The cell's shape is purely the geometry of its neighbours — you cannot read it from the seed alone.",
    },
    {
      selector: "seed",
      label: "Seed point",
      explanation:
        "The generating location for one cell. Move the seed and the surrounding cells redraw. In a coffee-shop map the seed is the shop; in a cellular-tower map the seed is the tower; in game AI the seeds are the waypoints.",
    },
    {
      selector: "edge",
      label: "Cell edge",
      explanation:
        "A boundary between two cells. Every point on the edge is exactly equidistant to the two seeds on either side — which makes the edge the perpendicular bisector of the segment between those seeds. That is the entire geometric rule of the diagram in one sentence.",
    },
    {
      selector: "vertex",
      label: "Vertex",
      explanation:
        "A point where three cells meet. It is equidistant to three seeds, so it is the circumcenter of the triangle they form. This dual relationship — Voronoi vertices and Delaunay triangles — is why modern libraries compute the two structures together.",
    },
    {
      selector: "empty-space",
      label: "Large cell",
      explanation:
        "An unusually large cell marks a seed with no close neighbours — a neighbourhood with only one coffee shop, a frontier tower, an isolated node. Large cells are the diagram's way of pointing at under-served space, which is why retail-planning teams read them first.",
    },
    {
      selector: "bounds",
      label: "Bounding box",
      explanation:
        "A Voronoi diagram on an unbounded plane has infinite outer cells, so the chart must clip to a viewport. The bounding rectangle is not data — it is the frame that makes outer cells finite and renderable. Resize the frame and the outer cells change without any seed moving.",
    },
  ],
};
