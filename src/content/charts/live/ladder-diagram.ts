import type { LiveChart } from "@/content/chart-schema";

export const ladderDiagram: LiveChart = {
  id: "ladder-diagram",
  name: "Ladder Diagram",
  family: "flow",
  sectors: ["electrical"],
  dataShapes: ["network"],
  tileSize: "W",
  status: "live",
  synopsis:
    "A graphical PLC programming language that draws control logic as horizontal rungs between two vertical power rails — every rung is a boolean expression from L1 to N.",
  whenToUse:
    "Reach for ladder when you are programming a PLC to coordinate discrete machinery: motor starters, interlocks, conveyor sequencing, safety circuits. Its strength is that control engineers and electricians read it the same way, so plant-floor maintenance can diagnose a running machine without becoming software engineers.",
  howToRead:
    "Read each rung left to right as a boolean AND: continuity from L1 to N energises the output coil at the right end. Contacts in series are ANDed; contacts in parallel are ORed. A normally-open contact `| |` is true when its tag is on; a normally-closed contact `|/|` is true when its tag is off. An ellipse or `( )` on the right is an output coil that drives whatever its tag names. Labels are everything — a contact without a tag is unreadable.",
  example: {
    title: "Three-wire motor start/stop with a latching auxiliary contact",
    description:
      "The plant-floor classic: PB_Start is a momentary pushbutton, PB_Stop is a normally-closed E-stop, and MotorRun_Aux is the motor contactor's own auxiliary contact wired in parallel with Start to latch the circuit on. Pressing Stop breaks continuity and drops the contactor out. Ladder logic was born from 1960s hard-wired relay panels — when Dick Morley's Modicon 084 shipped in 1968 as the first programmable logic controller, the choice to emulate ladder meant the electricians who maintained the old relay cabinets could program the new boxes with no retraining. IEC 61131-3 (1993, revised 2013) codified ladder as one of five PLC programming languages, and it is still the dominant one fifty years on.",
  },
  elements: [
    {
      selector: "l1-rail",
      label: "L1 power rail",
      explanation:
        "The left vertical line — the hot side of the control supply. Every rung starts here. The visual metaphor is literal: a 1960s relay panel had two vertical bus bars and the control wiring ran between them like the rungs of a ladder.",
    },
    {
      selector: "n-rail",
      label: "N (neutral) rail",
      explanation:
        "The right vertical line — the return side. An output coil energises only when its rung completes a continuous path from L1 through every evaluated-true contact back to N. Think of the rails as the two poles of a boolean truth table rendered as power.",
    },
    {
      selector: "no-contact",
      label: "Normally-open (NO) contact",
      explanation:
        "Drawn as `| |`, two short vertical lines with a gap. It passes continuity only when the named tag is energised. PB_Start on rung 1 is the canonical use: a momentary button that closes the contact for as long as the operator holds it.",
    },
    {
      selector: "nc-contact",
      label: "Normally-closed (NC) contact",
      explanation:
        "Drawn as `|/|`, the same two verticals with a diagonal slash. It passes continuity when its tag is off and breaks when the tag is on — the inverse of a NO contact. E-stop and Stop pushbuttons are almost always wired as NC so that a broken wire fails the circuit safe, not dangerous.",
    },
    {
      selector: "output-coil",
      label: "Output coil",
      explanation:
        "The ellipse (or `( )`) at the right end of a rung. When the rung evaluates true, the coil is energised and the device it names turns on. Physically this drove a relay coil on a 1960s panel; on a PLC it sets an internal bit that maps to a digital output.",
    },
    {
      selector: "latch-branch",
      label: "Latching branch",
      explanation:
        "Rung 1 shows the three-wire-start latch: MotorRun_Aux — the motor contactor's own auxiliary contact — is wired in parallel with PB_Start. Once the motor energises, its aux contact closes and keeps the rung true even after the operator releases the Start button. Stop breaks the series path and drops the whole thing out.",
    },
    {
      selector: "rung-boolean",
      label: "Rung as boolean expression",
      explanation:
        "Each rung compiles to a boolean formula: coil := (contacts in series ANDed, parallel branches ORed). A ladder program is a bag of these expressions evaluated every scan cycle, top to bottom. That is why ladder looks like a circuit but behaves like code — it is a program, not a schematic, and the 'wires' are logical signals, not currents.",
    },
  ],
};
