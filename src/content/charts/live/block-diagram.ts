import type { LiveChart } from "@/content/chart-schema";

export const blockDiagram: LiveChart = {
  id: "block-diagram",
  name: "Block Diagram",
  family: "flow",
  sectors: ["electrical", "software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Functional-units-and-arrows schematic of a feedback system — blocks are transfer functions, arrows are signals.",
  whenToUse:
    "Reach for a block diagram when the system is defined by the relationships between its parts rather than the parts themselves. It is the shared whiteboard notation of control engineering, signal-processing design, and embedded-software architecture: abstract enough to ignore component counts, concrete enough to argue about stability, gain, and latency.",
  howToRead:
    "Follow the arrows left to right. Each rectangle is a functional block, usually labelled with its transfer function or role (PID, Amplifier, Motor). A triangle is a pure gain. A circle with a cross inside is a summing junction — the plus and minus signs on its inputs tell you how the incoming signals combine. Every arrow is a signal; labels on the arrows name the quantity flowing along the wire. The chart's whole argument lies in the loops: a line returning from the output back to an earlier summing junction is feedback, and that loop is the reason the diagram exists.",
  example: {
    title: "Closed-loop motor-speed control",
    description:
      "The textbook example from Nichols and Bode's MIT Radiation Laboratory work in the 1940s, formalised in IEEE block-diagram standards in the 1960s: a reference speed enters a summing junction, the error is amplified and passed through a PID controller, a power amplifier drives a motor, and a tachometer measures actual speed and subtracts it back at the junction. Without the feedback line the diagram is just an open-loop chain; with it, the same six blocks describe why the motor holds its setpoint when load increases. Simulink's entire graphical language is a direct descendant of this notation.",
  },
  elements: [
    {
      selector: "summing-junction",
      label: "Summing junction",
      explanation:
        "The circle with a cross, Σ. Each incoming arrow carries a sign — plus for an added input, minus for a subtracted one — and the junction emits their signed sum. In a feedback loop the minus sign is load-bearing: subtracting the measured output from the reference yields the error the controller acts on.",
    },
    {
      selector: "gain-block",
      label: "Gain",
      explanation:
        "A right-pointing triangle. It multiplies its input by a constant — no dynamics, no memory. Gain blocks are the chart's dimensionless amplifiers; they set the loop's sensitivity and, combined with the controller, determine whether the closed loop is stable or oscillates.",
    },
    {
      selector: "controller-block",
      label: "Controller",
      explanation:
        "A rectangle labelled with the controller's transfer function — here PID, but also lead-lag compensators, state-space matrices, or discrete filters. The controller is the block the designer tunes; every other block is usually fixed by the physical plant.",
    },
    {
      selector: "plant-block",
      label: "Plant",
      explanation:
        "The system being controlled — a motor, a chemical reactor, a drone's attitude dynamics. Drawn as a rectangle with the process's transfer function inside. The plant is what the rest of the loop exists to govern; the diagram's abstraction is that its internal complexity is compressed into a single box.",
    },
    {
      selector: "feedback-path",
      label: "Feedback path",
      explanation:
        "The wire that returns from the plant output, through a sensor, back to the summing junction. Without this line the diagram is an open-loop schematic and the chart loses its purpose. The feedback path is the diagram's central claim: measuring the output and subtracting it from the reference lets the controller reject disturbances the designer never anticipated.",
    },
    {
      selector: "signal-wire",
      label: "Signal wire",
      explanation:
        "A labelled arrow naming the quantity flowing between two blocks — ω* (reference speed), error e, control u, drive voltage V, measured output. Block diagrams treat signals as abstract quantities with units; the rectangles transform them, the wires carry them, and the labels keep the engineer honest about what the loop is actually regulating.",
    },
  ],
};
