import type { LiveChart } from "@/content/chart-schema";

export const balancedScorecard: LiveChart = {
  id: "balanced-scorecard",
  name: "Balanced Scorecard",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Kaplan and Norton's 1992 four-perspective strategy framework — Financial, Customer, Process, Learning — arranged around a central mission statement with causal arrows linking the quadrants.",

  whenToUse:
    "Reach for the balanced scorecard when an organisation needs to manage against a strategy, not just a budget. The four-perspective structure forces leadership to ask whether the financial outcomes they want have corresponding measures at every causal layer beneath them: the customer experience that produces revenue, the internal processes that produce the customer experience, and the capability investments that produce the processes. Use it for annual strategy alignment and quarterly executive reviews.",

  howToRead:
    "Read the causal chain backwards from the Financial quadrant (top): financial results are the output, customer satisfaction is the driver, operational process performance is the mechanism, and learning and growth investment is the foundation. The arrows show the direction of causation. Within each quadrant, each measure has a pre-committed target; the scorecard's analytical job is to surface which quadrant's underperformance is propagating forward into the financial result.",

  example: {
    title: "Kaplan & Norton's Rockwater case, HBR 1992",
    description:
      "Robert Kaplan and David Norton's original HBR article built the balanced scorecard around Rockwater, a subsea engineering division of Brown & Root. Rockwater's financial target (ROC improvement) was traced causally to customer measures (tier-1 customer satisfaction), then to process measures (safety incident rate, rework hours), then to learning measures (employee skills index, strategic job readiness). The framework revealed that Rockwater's safety compliance rate — an internal process measure — was the binding constraint on its customer satisfaction scores, which was the binding constraint on margin. No purely financial review had surfaced the link.",
  },

  elements: [
    {
      selector: "financial-perspective",
      label: "Financial perspective",
      explanation:
        "The top quadrant asks: to succeed financially, what must we achieve? Typical measures include revenue growth, cost per unit, operating margin, and return on capital. In a for-profit context this is the terminal goal; in a non-profit or government context it becomes a constraint (stay solvent, minimise cost per outcome) rather than the purpose.",
    },
    {
      selector: "customer-perspective",
      label: "Customer perspective",
      explanation:
        "The right quadrant asks: to achieve our financial goals, how must we appear to our customers? Typical measures include satisfaction scores, retention rate, response time, and net promoter score. This quadrant bridges the financial outcome to the internal activities that produce it — without defined customer measures, financial targets float free of any operational lever.",
    },
    {
      selector: "process-perspective",
      label: "Internal business process perspective",
      explanation:
        "The bottom quadrant asks: to satisfy our customers, what internal processes must we excel at? These are operational measures within the organisation's direct control — cycle time, defect rate, throughput, compliance rate. They are the mechanism that produces the customer outcome; deterioration here propagates forward into the customer quadrant within one to two periods.",
    },
    {
      selector: "learning-perspective",
      label: "Learning and growth perspective",
      explanation:
        "The left quadrant asks: to excel at our processes, how must our organisation learn and improve? Typical measures are employee skill certification rates, training hours, knowledge-system availability, and employee engagement. This quadrant is the slowest-moving and the most neglected — its effects are lagged by months or years, so it is systematically underinvested relative to the financial quadrant.",
    },
    {
      selector: "strategy-statement",
      label: "Central strategy statement",
      explanation:
        "The centre of the frame holds the organisation's mission or strategic hypothesis in one sentence. Its presence is the balanced scorecard's most underappreciated design decision: every measure in every quadrant must be causally traceable to this statement. A measure that cannot be traced is not part of the strategy and should be removed.",
    },
    {
      selector: "causal-arrows",
      label: "Causal chain arrows",
      explanation:
        "The arrows from Learning → Process → Customer → Financial encode the framework's core claim: that financial performance is a lagging indicator of operational health, which is a lagging indicator of customer outcomes, which is a lagging indicator of organisational capability. The arrows make the theory of the business explicit and testable — if the causal links do not hold in practice, the strategy is wrong, not the measurement system.",
    },
  ],
};
