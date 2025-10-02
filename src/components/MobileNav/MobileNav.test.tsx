import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import MobileNav from "./MobileNav";
import { MemoryRouter } from "react-router-dom";

afterEach(() => {
  cleanup();
});

describe("MobileNav", () => {
  test("should render", () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
  test("should contain navigation links", () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
  });
});
