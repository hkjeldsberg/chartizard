import type { LiveChart } from "@/content/chart-schema";

export const burnDownChart: LiveChart = {
  id: "burn-down-chart",
  name: "Burn-Down Chart",
  family: "change-over-time",
  sectors: ["project-management"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A sprint's remaining work plotted day by day against the straight-line ideal, so the team's pace reads as a shape.",
  whenToUse:
    "Reach for a burn-down when a team has committed to a fixed scope within a fixed window (a Scrum sprint, a release train, a hardening phase) and wants a daily honesty check. It answers one question: is the remaining work trending to zero fast enough to finish on time.",
  howToRead:
    "Start at the top-left — the full scope — and follow the actual line downward. The dashed diagonal is the ideal burn rate: scope divided by days. When the actual line sits above the ideal, the team is behind; below, ahead. The slope between any two days is the team's velocity for that stretch. A flat patch means no points closed; a steep drop means a heavy close-out day. The gap between the actual line and zero at the right edge is the work that did not ship.",
  example: {
    title: "Scrum sprint review, 14-day sprint, 80 points committed",
    description:
      "Ken Schwaber and Mike Cohn popularised the burn-down in the early 2000s as Scrum's default sprint-progress chart. The convention is strict: full scope on day one, empty burndown tray on day last. This example shows a team that onboarded slowly through days 1-3, found its stride mid-sprint as the unknowns resolved, and closed the sprint with five points still on the board — an honest under-delivery the chart makes impossible to hide.",
  },
  elements: [
    {
      selector: "ideal-line",
      label: "Ideal line",
      explanation:
        "The dashed diagonal from full scope on day one to zero on the final day. It is scope divided by days — the straight-line burn the team would achieve with perfectly uniform velocity. It is the chart's prediction, not a goal; reality almost never matches it.",
    },
    {
      selector: "actual-line",
      label: "Actual line",
      explanation:
        "The team's real remaining work, replotted each day. The slope between two days is that day's velocity. A line that stays above the ideal is a team running behind; one below is ahead. Segments with no slope are days that closed zero points — usually a signal to look for blockers.",
    },
    {
      selector: "starting-point",
      label: "Starting scope",
      explanation:
        "The top-left anchor — the total story points committed at sprint planning. This point is fixed by convention; a classic burn-down does not let the scope number change mid-sprint, which is the chart's most-cited weakness.",
    },
    {
      selector: "inflection",
      label: "Mid-sprint inflection",
      explanation:
        "The point where the actual line stops lagging and starts tracking the ideal. It is almost always where the team's understanding of the work catches up with the estimate. Watch for it; a sprint without an inflection is a sprint where velocity never recovered.",
    },
    {
      selector: "ending-gap",
      label: "Ending gap",
      explanation:
        "The vertical distance between the final actual point and zero. It is the sprint's under-delivery in the chart's own units. A team that consistently ends with a positive gap is over-committing; one that hits zero early is under-committing.",
    },
    {
      selector: "x-axis",
      label: "Day axis",
      explanation:
        "The sprint timeline, one tick per working day. A two-week Scrum sprint is 10-14 ticks depending on whether weekends are drawn. The axis is bounded by the sprint — a burn-down never extends past the commit window.",
    },
  ],
};
