import { describe, expect, it } from "vitest";
import {
  ALL_CHARTS,
  LIVE_CHARTS,
  PLACEHOLDER_CHARTS,
  getChartById,
} from "@/content/charts";
import { isLiveChart } from "@/content/chart-schema";

// Update this when a batch ships. The invariants below (unique ids,
// elements/example present, matches live-module count) catch the actual
// integration bugs; this constant just confirms the batch landed.
const EXPECTED_LIVE_COUNT = 286;

describe("chart catalog", () => {
  it("has the expected number of live charts", () => {
    expect(LIVE_CHARTS).toHaveLength(EXPECTED_LIVE_COUNT);
  });

  it("has no duplicate live-chart ids", () => {
    const ids = LIVE_CHARTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate ids", () => {
    const ids = ALL_CHARTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("catalog is complete — zero placeholders remain", () => {
    // Batch 14 closed the last 21 placeholders. All 286 catalog entries are
    // now live. Kept as a regression guard: if a new placeholder is added
    // (new CHARTS.md entry), this will fire and prompt either implementing
    // it live or re-introducing the sector-coverage spot-check.
    expect(PLACEHOLDER_CHARTS).toHaveLength(0);
  });

  it("requires live charts to have elements[] and an example", () => {
    for (const c of ALL_CHARTS) {
      if (isLiveChart(c)) {
        expect(c.elements.length).toBeGreaterThan(0);
        expect(c.example.title.length).toBeGreaterThan(0);
      }
    }
  });

  it("resolves charts by id", () => {
    expect(getChartById("line-chart")?.name).toBe("Line Chart");
    expect(getChartById("does-not-exist")).toBeUndefined();
  });
});
