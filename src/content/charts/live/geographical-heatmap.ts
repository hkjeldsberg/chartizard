import type { LiveChart } from "@/content/chart-schema";

export const geographicalHeatmap: LiveChart = {
  id: "geographical-heatmap",
  name: "Geographical Heatmap",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A continuous kernel-density intensity surface overlaid on a geographic base, derived from point-event locations rather than administrative boundaries.",

  whenToUse:
    "Use a geographical heatmap when your input is a collection of georeferenced point events — GPS tracks, incident reports, delivery origins — and the question is where activity is dense, not which labelled region ranks highest. The distinguishing test: if the underlying geography has no named administrative units relevant to the question, a choropleth cannot apply.",

  howToRead:
    "Each location's colour encodes the estimated density of nearby point events. Warm colours (orange, red) mark zones where events cluster; transparent or cool zones are sparse. The kernel radius controls the spatial smoothing: a narrow kernel shows sharp peaks, a wide kernel shows broad basins. Where two hotspots' kernels overlap, the contributions add, producing a saddle of intermediate density between them.",

  example: {
    title: "Strava global heatmap, 2017",
    description:
      "Strava aggregated over one billion GPS activity segments and rendered them as a continuous density surface — making running and cycling routes visible as bright filaments against dark terrain. The 2017 release attracted immediate security scrutiny when analysts noticed that isolated bright loops in otherwise dark regions corresponded to the perimeters of classified military installations, whose personnel had been recording workouts. Nathan Yau's FlowingData documented the pattern; the incident demonstrated how anonymous density aggregation can still reveal sensitive spatial structure.",
  },

  elements: [
    {
      selector: "density-hotspot",
      label: "Density hotspot",
      explanation:
        "A region where the kernel-density estimate peaks. The colour saturates at the centre and fades radially outward. The hotspot's position is the mean of the nearby point events weighted by the kernel function — not the location of any single event. In the Strava heatmap, hotspots coincided with popular running loops: park perimeters, riverfronts, and coastal paths.",
    },
    {
      selector: "base-map",
      label: "Base map",
      explanation:
        "The geographic reference layer beneath the density overlay. Here it is a simplified city block grid with a diagonal thoroughfare. The base map anchors the density surface spatially so viewers can relate hotspots to recognisable landmarks — without it the heatmap is just a colour field.",
    },
    {
      selector: "low-density",
      label: "Low-density region",
      explanation:
        "Transparent or near-transparent zones indicate few or no point events within the kernel radius. The absence of colour is as informative as its presence: in urban-activity maps, low-density blocks often correspond to industrial areas, water bodies, or zones with restricted access. Contrast against a choropleth, where every administrative region receives a colour regardless of event count.",
    },
    {
      selector: "kde-kernel",
      label: "KDE kernel",
      explanation:
        "The kernel-density estimator places a smooth probability-mass function — here a Gaussian radial gradient — at each point event, then sums contributions across the map. The kernel's bandwidth (radius) controls smoothing: narrow kernels produce spiky surfaces, wide kernels smooth detail into broad basins. This waterfront hotspot illustrates how a second kernel overlaps additively with the central peak, raising density in the corridor between them.",
    },
    {
      selector: "colour-scale-legend",
      label: "Density scale",
      explanation:
        "The legend maps the continuous density estimate to the warm colour ramp (transparent low, saturated warm high). Because KDE output is a continuous function rather than a discrete class, the ramp has no hard bin boundaries — any position along it is a valid density value. Reading the legend tells the viewer the direction of encoding; the exact numeric density values are typically omitted in exploratory applications.",
    },
    {
      selector: "point-events-density",
      label: "Inferred density from point events",
      explanation:
        "No individual GPS track or incident point is drawn on the map; only the aggregated density surface is shown. This is the defining property of KDE visualisation: raw events are invisible, but their spatial clustering is rendered as a smooth field. The suburban hill hotspot captures a concentration of off-road running routes whose individual traces would appear as dozens of overlapping paths if plotted directly.",
    },
  ],
};
