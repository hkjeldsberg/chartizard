import type { LiveChart } from "@/content/chart-schema";

export const nomogram: LiveChart = {
  id: "nomogram",
  name: "Nomogram",
  family: "specialty",
  sectors: ["medicine"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A pre-computer calculation graphic: lay a straightedge across parallel scales and read the answer where it intersects the output axis.",

  whenToUse:
    "Use a nomogram when a multi-variable equation must be communicated to practitioners who need an answer fast, without a computer. The canonical audience is a clinician at the bedside, a field engineer without software, or a student learning how input variables trade off against each other.",

  howToRead:
    "Each vertical scale represents one variable. Find the patient's value on each input scale and mark the point. Lay a straightedge (the isopleth) across all marked points simultaneously. Where the straightedge crosses the output scale is the predicted result. If the scales are non-linear, the spacing of tick marks embeds the transformation — no arithmetic required.",

  example: {
    title: "Kattan prostate-cancer nomogram, Memorial Sloan Kettering (1998)",
    description:
      "Michael Kattan's nomogram predicted 5-year recurrence-free survival from PSA level, Gleason grade, and clinical stage. It was validated on 983 patients and became the first nomogram to enter routine surgical practice — urologists used a printed card to give patients individualized recurrence probabilities at the consent visit, years before web-based calculators existed.",
  },

  elements: [
    {
      selector: "isopleth",
      label: "Isopleth",
      explanation:
        "The drawn line threading across all scales — a straightedge in paper use, a polyline in a rendered nomogram. It is the calculation made visible: every point on the line simultaneously satisfies the nomogram's underlying equation at those scale values. The isopleth is what distinguishes a nomogram from a table or graph.",
    },
    {
      selector: "tumor-scale",
      label: "Tumor Size scale",
      explanation:
        "The leftmost input axis, running 0 to 10 cm. Larger tumors carry higher recurrence risk; the tick spacing is linear. The patient value is 3 cm, marked where the isopleth intersects this scale.",
    },
    {
      selector: "nodes-scale",
      label: "Positive Lymph Nodes scale",
      explanation:
        "The count of lymph nodes with pathological involvement, 0 to 40. Node involvement is the strongest predictor of recurrence in most breast-cancer staging systems. Tick density is denser at the clinically meaningful low-count range.",
    },
    {
      selector: "er-scale",
      label: "ER Status scale",
      explanation:
        "Estrogen-receptor status is binary (positive or negative), encoded on a two-tick vertical scale. ER-positive tumors respond to hormone therapy, substantially altering the risk calculation. This scale demonstrates that nomograms can encode categorical predictors alongside continuous ones.",
    },
    {
      selector: "risk-scale",
      label: "Recurrence Risk scale",
      explanation:
        "The output axis — 10-year probability of breast-cancer recurrence as a percentage. The isopleth reads off the answer here. For this patient (3 cm, 4 nodes, ER+) the predicted risk is approximately 35%.",
    },
    {
      selector: "patient-annotation",
      label: "Patient annotation",
      explanation:
        "A text caption restating the patient's input values and the nomogram's output in plain language. Nomograms are communication tools as much as calculation tools: the caption closes the loop between the graphic and the clinical decision.",
    },
  ],
};
