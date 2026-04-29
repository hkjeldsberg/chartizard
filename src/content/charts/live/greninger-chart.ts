import type { LiveChart } from "@/content/chart-schema";

export const greningerChart: LiveChart = {
  id: "greninger-chart",
  name: "Greninger Chart",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["geospatial"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A polar stereographic grid that converts Laue X-ray back-reflection spots into crystal orientation angles, enabling rapid indexing before digital diffractometers.",

  whenToUse:
    "Use a Greninger chart when you have a Laue back-reflection diffraction photograph from a single crystal and need to identify the crystal orientation or confirm a zone axis. It was the pre-computational standard in metallurgy and mineralogy for determining crystallographic orientations of turbine blades, gemstones, and semiconductor wafers.",

  howToRead:
    "The chart is a polar grid. Radial distance from the centre encodes the Bragg angle 2θ: spots closer to the centre diffracted from planes with larger d-spacings. Angular position around the chart encodes the azimuthal angle φ of each reflected beam. To use it, overlay a tracing of the diffraction film on the chart, rotate until spots fall on the grid intersections, and read off (hkl) Miller indices from the angular coordinates. The central spot is the zone axis — here the (001) pole of a cubic crystal.",

  example: {
    title: "Turbine-blade single-crystal orientation, Rolls-Royce, 1970s",
    description:
      "During development of directionally solidified nickel superalloy turbine blades (RR2000 series), metallurgists at Rolls-Royce used Greninger charts to verify that each blade's [001] axis was aligned within 10° of the blade's centrifugal stress direction. Misalignment of even 15° degraded creep life by 30%. A. B. Greninger's 1935 graphical method, published in Zeitschrift für Kristallographie, remained the shop-floor standard until automated XRD orientation mapping (1990s) replaced it.",
  },

  elements: [
    {
      selector: "polar-grid",
      label: "Polar grid",
      explanation:
        "Concentric rings mark fixed 2θ angles (Bragg reflection angles); radial spokes mark fixed azimuthal angles φ. Each grid intersection is a unique (2θ, φ) coordinate. When a spot from the diffraction film lands at a grid intersection, that intersection's coordinates directly give the geometric relationship of the corresponding reflecting plane to the beam direction.",
    },
    {
      selector: "diffraction-spots",
      label: "Diffraction spots",
      explanation:
        "Each filled circle is one Laue reflection — a plane in the crystal that satisfied Bragg's law at the polychromatic X-ray source used in Laue photography. The spatial arrangement of spots is not random: spots in a straight line through the centre lie in the same crystallographic zone (they share a zone axis).",
    },
    {
      selector: "miller-labels",
      label: "Miller index labels (hkl)",
      explanation:
        "Once a spot is located on the Greninger grid, its Miller indices (hkl) are determined from the crystal symmetry and the angles read off the grid. The labels here mark low-index reflections of a cubic crystal near the (001) zone axis. Higher-index reflections appear at larger 2θ, closer to the chart edge.",
    },
    {
      selector: "radial-axis",
      label: "Radial axis (2θ)",
      explanation:
        "Radial distance encodes the Bragg angle 2θ. Smaller 2θ (inner rings) means longer d-spacings — low-index planes like (100) and (010). Larger 2θ (outer rings) means shorter d-spacings from high-index planes like (321). The chart is drawn for a fixed crystal-to-film distance, conventionally 3 cm for back-reflection Laue.",
    },
    {
      selector: "azimuthal-axis",
      label: "Azimuthal angle (φ)",
      explanation:
        "The angular position around the chart encodes φ, the rotation of the reflected beam around the incident beam axis. For a crystal on a goniometer, φ distinguishes reflections from planes on opposite sides of the zone axis. The four-fold symmetry of the cubic (001) pattern is visible in the spot distribution.",
    },
  ],
};
