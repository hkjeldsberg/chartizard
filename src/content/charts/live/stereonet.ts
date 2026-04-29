import type { LiveChart } from "@/content/chart-schema";

export const stereonet: LiveChart = {
  id: "stereonet",
  name: "Stereonet / Wulff Net",
  family: "specialty",
  sectors: ["earth-sciences"],
  dataShapes: ["geospatial"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Projects 3-D orientations (planes and lines) onto a 2-D circle via equal-angle (Wulff, 1902) stereographic projection.",

  whenToUse:
    "Use a stereonet when the data are orientations — strike and dip of bedding, fault planes, fold axes, crystal faces — and the question is geometric: do the planes share a common axis? Do the lineations cluster? A histogram cannot answer these questions because orientation is circular in two angular dimensions simultaneously.",

  howToRead:
    "The outer circle (the primitive circle) is the horizontal plane; its centre is the vertical direction. A dipping plane plots as a curved arc bowing toward the dip direction — steeper dips bow less, vertical planes plot as straight diameters. A linear feature (lineation, fold axis) plots as a single dot: the shallower the plunge, the closer to the rim; vertical lines plot at the centre. Grid arcs at 10° spacing provide a protractor for reading angles directly off the net.",

  example: {
    title: "Allmendinger, Cardozo & Fisher, Structural Geology Algorithms (Cambridge, 2012)",
    description:
      "Allmendinger's open-source Stereonet software (now in its ninth major version) uses this projection to plot fold-axis data from map transects: the β-axis cluster defined by intersecting bedding-pole great circles identifies a plunging anticline at ~047°/24° within seconds of digitising the field measurements. No trigonometry is done by hand — the eye reads the cluster directly.",
  },

  elements: [
    {
      selector: "primitive-circle",
      label: "Primitive circle",
      explanation:
        "The outer ring is the stereographic 'horizon' — the trace of the horizontal plane. Everything inside represents lower-hemisphere orientations. The radius is a constant set equal to the net radius R; in Wulff's equal-angle projection a point at colatitude φ from the vertical plots at r = R·tan(φ/2).",
    },
    {
      selector: "great-circle-arc",
      label: "Great-circle arc (dipping plane)",
      explanation:
        "Each geological plane plots as a curved arc crossing the net. The arc bows toward the dip direction; where the arc intersects the primitive circle, the plane strikes horizontally. Dip angle is read by counting 10° grid intervals from the rim inward along the dip direction. Three planes are shown here: N45°E/60°SE, N00°/45°W, and N90°E/30°S.",
    },
    {
      selector: "lineation-point",
      label: "Lineation point",
      explanation:
        "A linear structural feature — stretching lineation, slickenside, mineral fibre — projects to a single point. Trend is its compass bearing; plunge is its angle below horizontal. Points near the rim are shallowly plunging; points near the centre are steeply plunging. The three plotted lineations span moderate to steep plunges at different azimuths.",
    },
    {
      selector: "small-circle",
      label: "Small circle (latitude ring)",
      explanation:
        "The concentric rings are small circles of constant colatitude from the vertical — analogous to lines of latitude on a globe. They do not represent real data; they are the net's protractor for reading plunge angles. In the equal-angle (Wulff) net they are exactly circular, whereas in the equal-area (Schmidt) net they are distorted.",
    },
    {
      selector: "net-centre",
      label: "Centre of net",
      explanation:
        "The centre point represents the vertical direction (straight down in the lower hemisphere). A fold axis or lineation plunging at 90° — directly downward — would plot here. The centre is also the intersection of all great circles that represent vertical planes.",
    },
    {
      selector: "fold-cluster",
      label: "Fold-axis orientation cluster",
      explanation:
        "The six dots near trend 045°/plunge 25° are repeat measurements of the same fold axis from different outcrops along a map transect. Scatter in the cluster reflects measurement error and real curvature of the fold hinge. The tight grouping confirms a consistent northeast-plunging fold — a conclusion impossible to draw from tabulated azimuth numbers alone.",
    },
  ],
};
