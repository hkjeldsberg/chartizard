import type { LiveChart } from "@/content/chart-schema";

export const circuitDiagram: LiveChart = {
  id: "circuit-diagram",
  name: "Circuit / Schematic Diagram",
  family: "flow",
  sectors: ["electrical"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A symbolic, topology-preserving drawing of an electrical circuit — components as standard glyphs, wires as Manhattan paths, connections marked by junction dots.",
  whenToUse:
    "Use a schematic when the electrical topology is the story and the physical layout is not. Two boards that wire the same schematic behave identically no matter how their copper is routed. Reach for a circuit diagram to specify, review, or teach a design; reach for a PCB layout only when you need to manufacture one.",
  howToRead:
    "Follow the signal from input to output. Vcc and GND rails bound the drawing at the top and bottom; components hang between them through Manhattan wires. Each resistor and capacitor carries a reference designator (R1, C2) plus a value. A dot at a crossing means the wires are joined; no dot means they pass over each other. Active devices (transistors, op-amps) show their polarity by the arrowhead — on an NPN transistor the emitter arrow points out.",
  example: {
    title: "Single-stage common-emitter NPN amplifier",
    description:
      "The canonical textbook amplifier: a 2N3904 biased by R1/R2, loaded by Rc, stabilised by Re with a bypass capacitor Ce, and capacitively coupled at Cin and Cout. The schematic is the circuit's contract — published first by J. A. Fleming in the valve era of the 1890s and codified today by IEC 60617 (international) and IEEE 315 (American National Standard). Every textbook, datasheet, and application note uses the same glyphs for the same reason: an engineer in Tokyo can build what an engineer in Berlin drew, with no translation.",
  },
  elements: [
    {
      selector: "vcc-rail",
      label: "Vcc rail",
      explanation:
        "The positive supply rail, drawn as a horizontal line spanning the top of the schematic. Every component that draws current from the supply taps off this rail. By convention the rail is labelled with its voltage (here +9 V); unlabelled rails are an invitation to blow up prototypes.",
    },
    {
      selector: "resistor",
      label: "Resistor",
      explanation:
        "The zigzag glyph is the ANSI/IEEE 315 resistor symbol (the IEC 60617 alternative is a plain rectangle — both are read the same). Orientation is irrelevant; only the connections and the value matter. Label each resistor with a reference designator and its ohmic value, preferably with tolerance when it affects the circuit.",
    },
    {
      selector: "capacitor",
      label: "Capacitor",
      explanation:
        "Two parallel plates with a small gap — the symbol visually echoes the device's construction. A coupling capacitor like Cin passes the AC signal while blocking DC bias, letting the amplifier sit at its operating point independent of the source.",
    },
    {
      selector: "npn-transistor",
      label: "NPN transistor (Q1)",
      explanation:
        "Three terminals: base on the left, collector up, emitter down. The arrowhead on the emitter is the polarity marker — outward arrow is NPN, inward arrow is PNP. The internal vertical bar is the base-emitter junction; a small base current steers a much larger collector current, which is how the stage amplifies.",
    },
    {
      selector: "ground-symbol",
      label: "Ground symbol",
      explanation:
        "The three-line triangle fixes the 0 V reference. Every voltage elsewhere in the schematic is implicitly measured against it. Separate symbols distinguish earth ground from chassis ground from signal ground — conflating them is a classic source of noise bugs.",
    },
    {
      selector: "junction-dot",
      label: "Junction dot",
      explanation:
        "A filled dot at a crossing means three or more wires are electrically joined. Absence of a dot at a crossing means the wires pass over without connecting. The convention is load-bearing: a four-way crossing without a dot is ambiguous and modern schematic capture tools refuse to let you draw one.",
    },
    {
      selector: "reference-designator",
      label: "Reference designator + value",
      explanation:
        "Every component carries a unique designator (R1, C2, Q1) that ties the schematic to the bill of materials and the PCB. The value beside it (47 kΩ, 10 µF, 2N3904) specifies the part. Without both, the drawing is a topology sketch, not a buildable design.",
    },
  ],
};
