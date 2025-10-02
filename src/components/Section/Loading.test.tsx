import { expect, test } from "vitest";
import SectionLoading from "./Loading";
import { render, screen } from "@testing-library/react";

test("loading UI of section should render", () => {
  render(<SectionLoading />);
  expect(screen.getByTestId("section-fallback")).toBeInTheDocument();
});
