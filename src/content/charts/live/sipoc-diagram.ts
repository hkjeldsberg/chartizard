import type { LiveChart } from "@/content/chart-schema";

export const sipocDiagram: LiveChart = {
  id: "sipoc-diagram",
  name: "SIPOC Diagram",
  family: "flow",
  sectors: ["business", "quality"],
  dataShapes: ["categorical"],
  tileSize: "W",
  status: "live",

  synopsis:
    "A five-column table that frames a process within its supplier and customer context: Suppliers, Inputs, Process, Outputs, Customers.",

  whenToUse:
    "Use a SIPOC at the start of any process improvement project — it is the mandatory first artifact in DMAIC (Define-Measure-Analyze-Improve-Control), Six Sigma's structured improvement cycle. The chart forces the team to name the suppliers and customers they have been implicitly assuming. Motorola's quality programs documented the earliest known use in the 1980s; George Eckes popularised the framework in The Six Sigma Revolution (2001, Wiley). A SIPOC belongs before any data collection: it defines scope.",

  howToRead:
    "Read left to right: suppliers provide inputs, which enter the process, which produces outputs that reach customers. The centre Process column contains 4-7 high-level steps with arrows indicating sequence — not a detailed flowchart, but enough to bound what is in and out of scope. The outer four columns contain unordered lists, not ranked items. Pair with a value-stream map when the Process column needs cycle-time data: VSM goes deep on that column; SIPOC frames it within supplier and customer context.",

  example: {
    title: "Customer-support ticket resolution, software-as-a-service team",
    description:
      "A SaaS support team building a DMAIC project around ticket resolution time fills in a SIPOC before measuring anything. The exercise immediately surfaces that 'Engineering team' is an implicit supplier whose response latency the team has never tracked, and that 'Future searchers' — people who will read the knowledge-base article produced by a resolved ticket — are an overlooked customer whose needs differ from the reporter's. Both findings change the scope of what to measure next.",
  },

  elements: [
    {
      selector: "suppliers-column",
      label: "Suppliers column",
      explanation:
        "Lists the external entities or internal teams that provide inputs to the process. Naming suppliers explicitly is the column that most frequently surprises teams: they discover they have been implicitly depending on a party whose SLA they have never negotiated. In DMAIC projects, the suppliers column informs the Measure phase by identifying whose data you need to collect.",
    },
    {
      selector: "inputs-column",
      label: "Inputs column",
      explanation:
        "Lists the materials, data, or artefacts that enter the process from the suppliers. Inputs are specific and measurable — not 'information' but 'severity level' or 'system logs'. If an input cannot be traced to a supplier in the left column, it is either missing a supplier or it is not a true input.",
    },
    {
      selector: "process-column",
      label: "Process column",
      explanation:
        "Shows 4-7 high-level steps in sequence, connected by arrows. This is the only column with an inherent order. The steps should be at a consistent level of abstraction — not a mix of strategic steps and implementation details. The Process column is the scope boundary: anything not represented here is outside the project.",
    },
    {
      selector: "outputs-column",
      label: "Outputs column",
      explanation:
        "Lists the products, reports, or artefacts the process produces. Outputs must be traceable to customers in the right column; if an output has no customer, it is waste. Distinguishing outputs (what the process produces) from outcomes (what customers achieve with them) is a common point of confusion that the Outputs and Customers columns together resolve.",
    },
    {
      selector: "customers-column",
      label: "Customers column",
      explanation:
        "Lists everyone who receives or uses the outputs — internal roles and external parties alike. Like the Suppliers column, the Customers column frequently surfaces overlooked stakeholders. In the customer-support example, 'Future searchers' who read knowledge-base articles are a customer class that most support teams optimise for only after the SIPOC exercise forces them to name it.",
    },
    {
      selector: "column-header-row",
      label: "Column header row",
      explanation:
        "The five header cells give the diagram its acronym: S-I-P-O-C. Each header names the category of information in that column. The headers are not data; they are the framework. A SIPOC without headers is just a five-column table; the headers carry the analytical vocabulary that lets teams from different organisations read each other's SIPOCs without prior explanation.",
    },
    {
      selector: "process-step-chain",
      label: "Process step chain",
      explanation:
        "The sequence of boxes and arrows inside the Process column is the only part of a SIPOC that shows causality. The arrows do not carry cycle-time data — that is value-stream map territory. Their job is to confirm that the process has a beginning (where inputs enter) and an end (where outputs leave), and that the team agrees on the high-level order. Disagreement about the step order during SIPOC construction is a signal that the team does not yet share a mental model of the process.",
    },
  ],
};
