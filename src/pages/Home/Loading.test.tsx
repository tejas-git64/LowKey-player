import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { TimelyFallback, Widgetfallback } from "./Loading";

afterEach(() => {
  cleanup();
});

test("loading UI of widget should render", () => {
  render(<Widgetfallback />);
  expect(screen.getByTestId("widget-fallback")).toBeInTheDocument();
});

test("loading UI of timely tracks should render", () => {
  render(<TimelyFallback />);
  expect(screen.getByTestId("timely-fallback")).toBeInTheDocument();
});
