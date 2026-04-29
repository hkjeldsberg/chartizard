import type { LiveChart } from "@/content/chart-schema";

export const pipingInstrumentationDiagram: LiveChart = {
  id: "piping-instrumentation-diagram",
  name: "Piping & Instrumentation (P&ID)",
  family: "flow",
  sectors: ["mechanical"],
  dataShapes: ["network"],
  tileSize: "W",
  status: "live",
  synopsis:
    "The schematic contract between process and control engineers: every pipe, vessel, valve, and instrument in a plant, drawn with the ANSI/ISA-5.1 symbol vocabulary.",
  whenToUse:
    "Use a P&ID when you are designing, commissioning, or maintaining a process plant and need a single drawing that carries both the piping and the control scheme. It is the reference every discipline reads — process engineers size the pipes against it, control engineers turn each loop into a DCS function block or a PLC rung, and operators use it to trace a fault at 2am.",
  howToRead:
    "Follow the thick solid lines — those are the process pipes — and read their connectivity as a directed graph of vessels and in-line devices. Instrument bubbles are circles hung off the pipe at the tap point; the letters inside are the ISA tag. First letter names the measured variable (F flow, P pressure, T temperature, L level); subsequent letters name the function (T transmitter, I indicator, C controller, A alarm). A single circle is a field instrument; a double-concentric circle is a DCS function. Thin dashed lines are signal wires, not pipes. The loop number (here -101) groups every instrument serving the same control job.",
  example: {
    title: "Heat-exchanger recirculation loop with a flow-control pair",
    description:
      "Tank T-101 feeds pump P-101, which discharges through control valve CV-101 into heat exchanger HX-101, and the cooled stream returns to the tank. Flow transmitter FT-101 measures the pump discharge and reports to flow-indicator-controller FIC-101 (drawn as a double-concentric circle — a DCS block, not a field instrument); FIC-101 modulates CV-101 to hold the setpoint. PT-101 watches tank pressure, TT-101 watches return temperature, and both report to the control room. ANSI/ISA-5.1 (1984, last revised 2009) standardised this symbol vocabulary after decades of vendor-specific notations; the same drawing hands across a Bechtel refinery and a craft brewery without translation.",
  },
  elements: [
    {
      selector: "storage-tank",
      label: "Storage tank (T-101)",
      explanation:
        "A vessel that holds process inventory. Rectangular body with a curved top is the convention for an atmospheric tank; closed pressure vessels are drawn with rounded ends. The tag prefix T- groups all tanks in the plant; the -101 suffix locates it in unit 100.",
    },
    {
      selector: "pump-symbol",
      label: "Pump (P-101)",
      explanation:
        "A circle with a small triangle inside pointing in the flow direction denotes a centrifugal pump. Positive-displacement pumps use a different glyph. The triangle is not decoration — it disambiguates inlet from outlet when the pump is drawn in isolation.",
    },
    {
      selector: "control-valve",
      label: "Control valve (CV-101)",
      explanation:
        "Two triangles meeting at a point form the hourglass body of a globe-style valve. The small rectangle on the stem above is the actuator — diaphragm, electric, or piston — that moves the valve in response to a controller signal. A manual block valve omits the actuator.",
    },
    {
      selector: "heat-exchanger",
      label: "Heat exchanger (HX-101)",
      explanation:
        "A circle with two zigzag lines across the bore represents a shell-and-tube exchanger; the zigzags are the tube bundle. Plate-and-frame exchangers use a chevron glyph instead. Each symbol in ISA-5.1 is shape-coded so the drawing can be read in photocopy, at a glance, in a control room.",
    },
    {
      selector: "instrument-tag",
      label: "Instrument bubble (e.g. FT-101)",
      explanation:
        "A circle with an ISA tag is a process instrument. First letter is the measured variable (F flow, P pressure, T temperature, L level), subsequent letters are the function (T transmitter, I indicator, C controller). A double-concentric circle signals a DCS function block; a single circle is field-mounted. The -101 loop number binds every instrument serving the same control loop.",
    },
    {
      selector: "signal-line",
      label: "Signal line (dashed)",
      explanation:
        "Thin dashed lines carry information, not fluid. ISA-5.1 distinguishes long-dash for electric, short-dash for pneumatic, and other variants for software and hydraulic signals. The FT-to-FIC line is the feedback input; the FIC-to-CV line is the controller output that modulates the valve. Never confuse a signal line with a pipe.",
    },
    {
      selector: "process-line",
      label: "Process line (thick solid)",
      explanation:
        "The thickest stroke on the drawing is a main process pipe. Line number, size, and material spec ride on it in a full-scale P&ID; here we show only the topology. The pipe between pump discharge and the control valve is carrying whatever the plant is processing — the drawing does not tell you what, only how it moves.",
    },
  ],
};
