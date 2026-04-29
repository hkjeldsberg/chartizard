import type { LiveChart } from "@/content/chart-schema";

export const burnUpChart: LiveChart = {
  id: "burn-up-chart",
  name: "Burn-Up Chart",
  family: "change-over-time",
  sectors: ["project-management"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Completed work climbs from zero toward a separately-plotted scope ceiling that can rise when stakeholders add work.",
  howToRead:
    "Two lines, both climbing or flat, never falling. The lower line is cumulative completed points. The upper line is total scope — when a stakeholder adds work mid-sprint, that line steps up. Read their gap as remaining work: when the two converge, the sprint finishes. The slope of the completed line is velocity. The step height on the scope line is the size of each scope change. A sprint that finishes looks like the completed line meeting a flat scope line; a sprint with scope creep looks like a rising ceiling the completed line can never catch.",
  whenToUse:
    "Reach for a burn-up over a burn-down when scope is not fixed — product work where stakeholders add stories mid-sprint, agency work where the client adds asks, any context where the honest answer to 'are we on track' requires also answering 'on track for what'.",
  example: {
    title: "Mike Cohn's argument for burn-up, Scrum community (2010s)",
    description:
      "Mike Cohn and the mid-2010s Scrum blogosphere pushed burn-up over burn-down on one specific charge: a burn-down hides scope creep. Add ten points on day six of a burn-down and the line's slope just shallows — the viewer has no way to see the ten new points without reading a caption. A burn-up makes that change visible as a visible step on the scope line. The example here shows the same 14-day sprint as the burn-down: the team closed 85 points, but scope rose from 80 to 95 via two stakeholder adds, and the burn-up makes both facts readable at a glance.",
  },
  elements: [
    {
      selector: "completed-line",
      label: "Completed line",
      explanation:
        "Cumulative points closed, one point plotted per day. The line only climbs or stays flat — a burn-up never falls. Slope between two days is that day's velocity; long flat runs are days where nothing closed.",
    },
    {
      selector: "scope-line",
      label: "Scope line",
      explanation:
        "Total points in the sprint, replotted each day. Its rises are the chart's whole reason to exist — a burn-down would have absorbed these into a shallower slope. Flat stretches mean no scope change; step-ups mean stakeholders added work.",
    },
    {
      selector: "scope-creep",
      label: "Scope-creep step",
      explanation:
        "The vertical jump on the scope line where new work was admitted to the sprint. A burn-up makes every such event visible as a discrete step; a burn-down absorbs it into the remaining-work line and erases the provenance. This is the single strongest argument for the burn-up.",
    },
    {
      selector: "starting-scope",
      label: "Starting scope",
      explanation:
        "The scope line's day-one value — the sprint's original commitment. In a well-run Scrum team this is the number everyone signed off on at planning; subsequent step-ups are the deviations from that agreement.",
    },
    {
      selector: "remaining-gap",
      label: "Remaining gap",
      explanation:
        "The vertical distance between the scope line and the completed line at any day. It is the remaining-work reading a burn-down gives you directly, but here you can see both terms that make it up: how much was committed and how much has been done.",
    },
    {
      selector: "x-axis",
      label: "Day axis",
      explanation:
        "The sprint timeline, one tick per working day. A two-week Scrum sprint is 10-14 ticks depending on weekend handling. The burn-up is almost always bounded by a single sprint; multi-sprint burn-ups exist but drift into release-burnup territory.",
    },
  ],
};
