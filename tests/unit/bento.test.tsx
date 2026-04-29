import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid } from "@/components/bento/Grid";
import { Tile } from "@/components/bento/Tile";

describe("bento primitives", () => {
  it("renders a grid with dense auto-flow", () => {
    const { container } = render(
      <Grid>
        <div>a</div>
        <div>b</div>
      </Grid>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.gridAutoFlow).toBe("dense");
    expect(root.className).toContain("grid-cols-2");
  });

  it("renders a Tile with the correct status + label", () => {
    render(
      <Grid>
        <Tile
          href="/charts/bar-chart"
          size="S"
          sectors={["general"]}
          title="Bar Chart"
          familyLabel="Comparison"
          eyebrow="01"
          status="live"
        >
          <span data-testid="thumb">thumb</span>
        </Tile>
      </Grid>,
    );
    const link = screen.getByRole("link", { name: /bar chart/i });
    expect(link.getAttribute("data-status")).toBe("live");
    expect(screen.getByText("Comparison")).toBeInTheDocument();
    expect(screen.getByTestId("thumb")).toBeInTheDocument();
  });

  it("marks planned tiles with a soon pill and aria hint", () => {
    render(
      <Grid>
        <Tile
          href="/charts/cladogram"
          size="M"
          sectors={["biology"]}
          title="Cladogram"
          status="planned"
        >
          <span>placeholder art</span>
        </Tile>
      </Grid>,
    );
    const link = screen.getByRole("link", {
      name: /cladogram — coming soon/i,
    });
    expect(link.getAttribute("data-status")).toBe("planned");
    expect(screen.getByText(/soon/i)).toBeInTheDocument();
  });

  it("falls back to a neutral surface for unknown-sector entries", () => {
    const { container } = render(
      <Tile
        href="/charts/example"
        size="S"
        sectors={[]}
        title="Example"
        status="planned"
      >
        <span>a</span>
      </Tile>,
    );
    const tile = container.firstElementChild as HTMLElement;
    expect(tile.getAttribute("style")).toContain("--color-surface-slate");
  });
});
