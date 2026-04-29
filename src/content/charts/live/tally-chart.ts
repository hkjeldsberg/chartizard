import type { LiveChart } from "@/content/chart-schema";

export const tallyChart: LiveChart = {
  id: "tally-chart",
  name: "Tally Chart",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Counts by hand: vertical strokes grouped in fives, with a diagonal fifth crossing the first four.",
  whenToUse:
    "Reach for a tally when observations arrive one at a time and the recorder cannot pause to compute — field ornithology, wildlife surveys, polling-station counts, manual traffic studies. The five-group is the chart's reason to exist: it replaces counting with pattern-matching, so the eye can read 23 without adding twenty-three ones.",
  howToRead:
    "Each vertical stroke is one observation. Four strokes clustered together, crossed by a diagonal fifth, form a group of five — the unit of fast reading. Count the full groups, multiply by five, then add any loose trailing marks. Rows are categories; the longest row is the mode.",
  example: {
    title: "Audubon Christmas Bird Count, since 1900",
    description:
      "Each December, volunteers across the Americas spend a day tallying every bird they see within a 15-mile circle, recording counts in field notebooks as five-bar groups. The protocol has run continuously for over a century, producing one of the longest-running citizen-science datasets in biology. The tally's honesty is its strength: a handwritten ledger of groups-of-five survives a dead battery and a drowned laptop, and the diagonal stroke is unambiguous even in a shaky hand.",
  },
  elements: [
    {
      selector: "tally-mark",
      label: "Tally mark",
      explanation:
        "A single vertical stroke is one observation. The stroke is the atom of the chart: every other mark on the page is a shorthand for more of these.",
    },
    {
      selector: "five-group",
      label: "Five-group",
      explanation:
        "Four vertical strokes crossed by a diagonal fifth. The convention exists because humans can recognise groups of up to four at a glance (subitising); above four, we have to count. Grouping in fives turns counting into multiplication.",
    },
    {
      selector: "modal-row",
      label: "Modal row",
      explanation:
        "The category with the most marks — the mode. Rank rows from most to fewest so the reader's eye lands on the winner first; ordering is editorial, not dictated by the tally itself.",
    },
    {
      selector: "leftover-marks",
      label: "Leftover marks",
      explanation:
        "The one-to-four ungrouped strokes after the last full five-group carry the remainder. A tally of 23 is four groups of five plus three loose marks, not five groups of four or any other scheme — the leftover is always less than five.",
    },
    {
      selector: "category-labels",
      label: "Category labels",
      explanation:
        "Names on the left tell the reader what is being counted in each row. Without them a tally sheet is just a field of strokes; the chart is the label-plus-stroke pair, not the strokes alone.",
    },
    {
      selector: "row-total",
      label: "Row total",
      explanation:
        "The numeric sum written at the end of each row. Tallies are accumulated live; totals are transcribed later. Publishing both the marks and the number lets a reader audit the transcription without re-running the field trip.",
    },
  ],
};
