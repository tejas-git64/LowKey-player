import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TimelyFallback, Widgetfallback } from "./Loading";

describe("Loading component", () => {
  test("loading UI of widget should render", async () => {
    render(<Widgetfallback />);
    await waitFor(() => {
      expect(screen.getByTestId("widget-fallback")).toBeInTheDocument();
    });
  });

  test("loading UI of timely tracks should render", async () => {
    render(<TimelyFallback />);
    await waitFor(() => {
      expect(screen.getByTestId("timely-fallback")).toBeInTheDocument();
    });
  });
});
