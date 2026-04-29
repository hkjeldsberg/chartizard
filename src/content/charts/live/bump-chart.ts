import type { LiveChart } from "@/content/chart-schema";

export const bumpChart: LiveChart = {
  id: "bump-chart",
  name: "Bump Chart",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal", "categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Tracks rank, not magnitude — every line sits at an ordinal position and crossings are overtakes.",
  whenToUse:
    "Reach for a bump chart when the question is who overtook whom. Rank is ordinal, so the exact distance between #1 and #2 is intentionally discarded — the chart keeps only the order. Use a parallel-coordinates plot instead when the underlying values matter; use a bump chart when only the standings do.",
  howToRead:
    "Lines start at each series' week-one rank on the left and end at its final rank on the right, curving between weekly snapshots. Every column is a complete permutation of the ranks — no ties. Crossings are the story: a line that rises and a line that falls swap positions, and that swap is an overtake. The top row is always #1; following a single line is the same as watching one competitor's standings over time.",
  example: {
    title: "Billboard Hot 100 top-8, a 12-week window",
    description:
      "Across twelve weeks, Anti-Hero holds #1 at the start and slides steadily to #8 by the final week. Flowers climbs into #1 in week three, gets displaced by Seven and then Cruel Summer in the middle of the run, and reclaims the top spot from week ten onward. The crossings carry the narrative: a parallel-coordinates chart of chart positions would be less readable because the actual stream numbers vary by orders of magnitude, whereas the rank view puts every contender on the same eight-step ladder.",
  },
  elements: [
    {
      selector: "winner-line",
      label: "Winner trajectory",
      explanation:
        "One song's complete path across the twelve weeks, highlighted so the reader can trace a single story without losing it in the bundle. A bump chart without at least one highlighted line is a thicket; pick the series whose arc you want the viewer to walk.",
    },
    {
      selector: "crossing",
      label: "Crossing",
      explanation:
        "Where two lines swap vertical position, the ranks flipped between those two weeks — an overtake. Crossings are the chart's reason for existing. If your data never has one, a ranked bar chart of final positions is a better choice.",
    },
    {
      selector: "top-rank-row",
      label: "Top-rank row",
      explanation:
        "The #1 row is where the prize lives. Drawn solid rather than dashed so the eye snaps to it first; every other row is a station on the way to or from the top. Labelling the #1 row explicitly is worth the ink because readers default to reading low numbers as worse.",
    },
    {
      selector: "week-axis",
      label: "Week axis",
      explanation:
        "Ordinal time steps, left to right. Weeks are treated as evenly-spaced snapshots rather than a continuous time scale — a bump chart does not interpolate what happened between surveys, it just connects the observations with a smooth curve for legibility.",
    },
    {
      selector: "rank-axis",
      label: "Rank axis",
      explanation:
        "Position 1 at the top, position 8 at the bottom. The axis encodes order, not magnitude — the gap between rank 1 and rank 2 is drawn the same as the gap between rank 7 and rank 8 because the chart is about standings, not stream counts. Do not add a second scale here.",
    },
    {
      selector: "start-column",
      label: "Starting column",
      explanation:
        "The week-one column is a snapshot of the initial leaderboard, and every line's story begins here. Readers often compare the start column against the end column directly, so keep both columns uncluttered; the interior weeks carry the motion.",
    },
  ],
};
