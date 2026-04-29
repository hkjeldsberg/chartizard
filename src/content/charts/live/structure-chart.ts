import type { LiveChart } from "@/content/chart-schema";

export const structureChart: LiveChart = {
  id: "structure-chart",
  name: "Structure Chart",
  family: "hierarchy",
  sectors: ["software"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Hierarchical tree of software modules with data and control couples labelled on the call edges.",
  whenToUse:
    "Reach for a structure chart when you are designing a procedural program and need to commit, on paper, to the module hierarchy before anyone writes code. It is a planning artifact, not an observation: it captures the intent of who calls whom and what flows between them.",
  howToRead:
    "Read top-down. The root is the program's entry point; children are the modules it invokes; grandchildren are the modules they invoke in turn. The edges are the invocation lines. On every edge, look for the small circle-and-tail glyphs: a filled circle is a data couple (a parameter), a hollow circle is a control couple (a flag or status). The glyph's tail points in the direction the couple travels. A double-sided rectangle is a pre-written library module — treat it as a black box.",
  example: {
    title: "Payroll program, c. 1978",
    description:
      "Yourdon and Constantine's original 1975 Structured Design used a payroll program as its recurring worked example: Main calls Read Employee Records, Compute Pay, and Write Paycheck, and Compute Pay in turn calls Compute Gross, Compute Tax, and Compute Net. The chart's punchline is the couple inventory — if Compute Tax needs a flag from Main to choose a tax bracket, that control couple is visible on the chart and becomes a design smell. Structured design argued that minimising control couples (the flags) was the measurable route to loosely coupled, highly cohesive modules.",
  },
  elements: [
    {
      selector: "root-module",
      label: "Root module",
      explanation:
        "The program's entry point, drawn at the top. In a structure chart the root is always the controlling module — it invokes its children and coordinates the result. Its name is usually the program name itself (here, Main Payroll).",
    },
    {
      selector: "sub-module",
      label: "Sub-module",
      explanation:
        "An internal module called by its parent and, in turn, calling its own children. Structured design judged a sub-module by two criteria: high cohesion (it does one thing) and low coupling (it communicates with its parent through few, simple couples). A sub-module with many couples is a redesign candidate.",
    },
    {
      selector: "library-module",
      label: "Library module",
      explanation:
        "Drawn with a double-sided rectangle (inner vertical rules on each short side) to mark it as a pre-written module the designer does not need to decompose further. File I/O, sort utilities, and math routines typically appear as library modules — the chart stops at the boundary of what you are designing.",
    },
    {
      selector: "data-couple",
      label: "Data couple",
      explanation:
        "A small filled circle with a tail, sitting on the edge between two modules. It names a parameter flowing between caller and callee (hours, gross-pay, tax-rate). Data couples are the chart's accepted currency — most edges carry several, and they are the module's published interface.",
    },
    {
      selector: "control-couple",
      label: "Control couple",
      explanation:
        "An open circle with a tail — a flag or status value rather than data. Control couples are the chart's warning signs: a module that takes flags to decide what to do is deciding someone else's logic on their behalf. Structured design's central prescription was to minimise them, a heuristic that survives today as 'tell, don't ask'.",
    },
    {
      selector: "invocation-edge",
      label: "Invocation edge",
      explanation:
        "A plain line (no arrowheads in the original notation; modern redraws add a small head at the child end for legibility) signifying 'the parent calls the child'. A structure chart's edges do not depict control flow in time — a parent may call a child many times or conditionally. The edge says only that the call relationship exists.",
    },
  ],
};
