import type { LiveChart } from "@/content/chart-schema";

export const valueStreamMap: LiveChart = {
  id: "value-stream-map",
  name: "Value Stream Map",
  family: "flow",
  sectors: ["quality", "business"],
  dataShapes: ["network"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Lean-manufacturing notation for a product's journey from raw material to customer, with the inventory-wait vs value-add ratio drawn as a sawtooth underneath.",
  whenToUse:
    "Reach for a value stream map when the question is not how to do the work faster but how to stop waiting between steps. The chart separates material flow from information flow, pins a data tile to every process step, and lays the lead-time and processing-time totals side by side at the bottom — so the wait-to-work ratio is a fact, not an anecdote.",
  howToRead:
    "Read the top row first: customer on the right, supplier on the left, production control in the middle — the three entities that pull, push, and schedule material through the stream. The middle row is the physical flow, left to right: process boxes connected by striped push arrows, with a triangle containing a queue-count between each pair. Each process carries a 4-row data tile underneath (cycle time, changeover, uptime, operators). The bottom sawtooth is the diagnosis: wide flat segments are inventory-waiting (non-value-add); the narrow peaks under each process are the cycle-time bursts when work actually happens. The LT/PT summary at the bottom-right is the number people remember afterwards.",
  example: {
    title: "Toyota Production System, codified by Rother & Shook, 1999",
    description:
      "Value stream mapping began inside Toyota in the 1980s as an internal tool and was exported to the West by Mike Rother and John Shook's 1999 Lean Enterprise Institute workbook Learning to See. The chart does something rare — it is simultaneously the measurement and the diagnosis. A stamped-steel assembly line with four processes and ~180 seconds of real work typically carries 23 days of lead time; the sawtooth shows that 99.99% of a part's life in the plant is spent waiting in a pile next to a machine. The Lean discipline is the three-map cadence: current state (what is), future state (what should be after one improvement cycle), implementation plan (what changes to get there). Where this catalog's SIPOC Diagram (Batch 8 sibling) frames the process by listing suppliers, inputs, outputs, and customers around it, a value stream map goes inside the process itself — cycle time, changeover, and queue depth at every station.",
  },
  elements: [
    {
      selector: "process-box",
      label: "Process box",
      explanation:
        "A rectangle for one physical step — stamping, welding, assembly, shipping. One box per operator-manned station; if two parts of the line share an operator, they share a box. The box is the atomic unit of improvement in a kaizen event.",
    },
    {
      selector: "data-tile",
      label: "Data tile",
      explanation:
        "The four-row mini-table under each process: cycle time (C/T), changeover time (C/O), uptime, and operator count. These are the numbers that make the difference between a map that could be sketched on a napkin and a map that can be costed. Cycle time is per-part; changeover is the downtime between runs of different SKUs.",
    },
    {
      selector: "inventory-triangle",
      label: "Inventory triangle (push)",
      explanation:
        "A small filled triangle with a queue count, placed between two processes. The striped arrow into it is the push arrow — upstream pushes material downstream on its own schedule, regardless of downstream demand. Pull loops (supermarkets, kanban) are drawn with different shapes; a VSM full of push triangles is a VSM that needs a pull-system redesign.",
    },
    {
      selector: "entity",
      label: "Customer / supplier entity",
      explanation:
        "A factory icon for the customer (right) and supplier (left) — the two endpoints of the material flow. The demand rate on the customer box and the shipment frequency on the supplier box set the takt time for everything between them.",
    },
    {
      selector: "timeline-sawtooth",
      label: "Timeline sawtooth",
      explanation:
        "The line that runs across the bottom with narrow peaks under each process and wide valleys between them. The peak height is the value-add cycle time; the valley width is the inventory-wait time. The asymmetry is the point: on most maps the peaks are measured in seconds and the valleys in days.",
    },
    {
      selector: "lt-pt-ratio",
      label: "LT / PT summary",
      explanation:
        "Lead time divided by processing time, stated at the right edge of the timeline. A healthy ratio is in the low single digits; most first-draft maps come in at 1000 or more. This single number is what drives the future-state design.",
    },
    {
      selector: "info-flow",
      label: "Information flow",
      explanation:
        "Zigzag lines carry electronic schedules (MRP, EDI); straight lines carry manual information (paper kanban, verbal). Drawing them distinctly is a convention from Rother and Shook — the two flows break under different failure modes and should not be conflated on the map.",
    },
  ],
};
