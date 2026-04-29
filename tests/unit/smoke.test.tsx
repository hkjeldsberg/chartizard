import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/Hero";

describe("Hero", () => {
  it("renders the main headline", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        name: /every chart ever invented/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows the charts / live / fields counts", () => {
    render(<Hero />);
    expect(screen.getByText("Charts")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Fields")).toBeInTheDocument();
  });
});
