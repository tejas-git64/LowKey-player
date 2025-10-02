import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Layout from "./Layout";
import { MemoryRouter } from "react-router-dom";

describe("Layout", () => {
  test("should render", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
  test("should contain mobile specific class when path is not /", () => {
    render(
      <MemoryRouter initialEntries={["/home"]} initialIndex={0}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("layout-inner-container").classList).toContain(
      "sm:h-[95vh]",
    );
  });
  test("should contain mobile specific class when path is not /", () => {
    render(
      <MemoryRouter initialEntries={["/home"]} initialIndex={0}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("outlet-container").classList).toContain(
      "sm:h-[95vh]",
    );
  });
  test("mobile specific features must be hidden when path is /", () => {
    render(
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("mobile-features").classList).toContain("hidden");
  });
});
