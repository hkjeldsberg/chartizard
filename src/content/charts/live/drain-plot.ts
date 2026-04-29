import type { LiveChart } from "@/content/chart-schema";

export const drainPlot: LiveChart = {
  id: "drain-plot",
  name: "Drain Plot",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Family of I_D–V_DS curves at stepped gate voltages — the single page on which a MOSFET reveals its threshold, transconductance, and output resistance.",
  whenToUse:
    "This is the validation plot every analog-IC designer inspects after fitting a SPICE model or measuring a new silicon revision. The five curves together encode more parameters than any single sweep: threshold voltage V_th sits at the gap between the bottom curve and the others; transconductance g_m is the spacing between adjacent saturated plateaus; output resistance is the slope you can barely see in saturation. A 1-D transfer characteristic (I_D vs V_GS) tells you one number; the drain plot tells you the transistor's personality.",
  howToRead:
    "Pick a curve — it is held at a single V_GS. Sweep left to right along V_DS: at low V_DS the channel is a resistor and current rises almost linearly (triode region). Past the pinch-off point V_DS = V_GS − V_th the channel chokes and current flattens (saturation region). The locus of those knees is a parabola; every curve crosses it at its own V_GS. The lowest curve here sits just above threshold (V_GS = 1.0 V, V_th = 0.7 V) and is nearly flat — in hand-sketch textbooks it is often drawn on the axis to represent cutoff.",
  example: {
    title: "Generic n-channel enhancement MOSFET, V_th = 0.7 V, k = 0.6 mA/V², V_GS ∈ {1.0, 1.5, 2.0, 2.5, 3.0} V",
    description:
      "Sedra & Smith's 'Microelectronic Circuits' (Chapter 4, every edition since 1982) opens MOSFET operation with exactly this plot; Gray & Meyer's 'Analysis and Design of Analog Integrated Circuits' reproduces it on the inside cover. The spacing between the top two plateaus (V_GS = 2.5 V and 3.0 V) is wider than between the bottom two — a direct read of the (V_GS − V_th)² saturation law. Shift V_th up 200 mV and every curve drops visibly; this plot is how foundry engineers first spot a process drift.",
  },
  elements: [
    {
      selector: "triode-region",
      label: "Triode region",
      explanation:
        "Low-V_DS rising flank of every curve. Here the channel behaves as a voltage-controlled resistor: I_D = k·[(V_GS − V_th)·V_DS − V_DS²/2]. Near the origin the V_DS² term is negligible, so slope is proportional to the overdrive V_GS − V_th — the reason the curves fan out with increasing V_GS.",
    },
    {
      selector: "saturation-region",
      label: "Saturation region",
      explanation:
        "High-V_DS plateau to the right of each knee. The channel has pinched off at the drain end; further increases in V_DS leave I_D ≈ k·(V_GS − V_th)²/2, independent of V_DS. Analog designers biased in this region are using the MOSFET as a voltage-controlled current source — the backbone of every differential pair and current mirror.",
    },
    {
      selector: "pinch-off-locus",
      label: "Pinch-off locus",
      explanation:
        "The parabolic boundary V_DS = V_GS − V_th separating triode from saturation. Every curve meets it at its own V_GS; tracing it across the family shows where each transistor transitions. The highlighted ring marks the knee of the V_GS = 2.5 V curve — the single point the manifest calls out because it is the clearest 'textbook knee' on the family.",
    },
    {
      selector: "cutoff-curve",
      label: "Cutoff / near-threshold curve",
      explanation:
        "The bottom curve sits at V_GS = 1.0 V, only 300 mV above threshold. Its overdrive squared is tiny (0.09 V²), so saturation current is likewise tiny and the trace hugs the x-axis. Drop V_GS below V_th and the curve would collapse onto the axis entirely — the 'cutoff' region proper.",
    },
    {
      selector: "vgs-labels",
      label: "V_GS labels",
      explanation:
        "Each curve is annotated at its right edge with the gate voltage that produced it. A drain plot is colour-independent — the same five curves print correctly in black ink because the parameter is labelled, not encoded by hue. An unlabelled family is a decorative squiggle.",
    },
    {
      selector: "x-axis",
      label: "V_DS axis",
      explanation:
        "Drain-to-source voltage — the sweep variable. Typical analog bias points sit in saturation (V_DS a few hundred millivolts above the knee); digital switches swing V_DS the full width of the plot between cutoff and triode.",
    },
    {
      selector: "y-axis",
      label: "I_D axis",
      explanation:
        "Drain current in milliamps — the dependent variable. The top of the plot defines the transistor's current budget at maximum gate drive; a foundry datasheet calls out this peak as I_Dsat(max) with the process-corner it was measured at.",
    },
  ],
};
