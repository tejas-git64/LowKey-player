import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import RouteNav from "./RouteNav";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Search from "../../pages/Search/Search";
import Library from "../../pages/Library/Library";

afterEach(() => {
  cleanup();
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

describe("RouteNav", () => {
  test("renders and shows initial path", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RouteNav />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("route-nav")).toBeInTheDocument();
    expect(screen.getByTestId("location-display").textContent).toBe("/");
  });

  test("previous button navigates back", async () => {
    render(
      <MemoryRouter initialEntries={["/search", "/library"]} initialIndex={1}>
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
    );
    const locationDisplay = await screen.findByTestId("location-display");
    expect(locationDisplay.textContent).toBe("/library");
    act(() => {
      fireEvent.click(screen.getByTestId("previous-route"));
    });
    await waitFor(() => {
      expect(locationDisplay.textContent).toBe("/search");
    });
  });

  test("next button navigates forward", async () => {
    render(
      <MemoryRouter initialEntries={["/search", "/library"]} initialIndex={0}>
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
    );
    const locationDisplay = await screen.findByTestId("location-display");
    expect(locationDisplay.textContent).toBe("/search");
    act(() => {
      fireEvent.click(screen.getByTestId("next-route"));
    });
    await waitFor(() => {
      expect(locationDisplay.textContent).toBe("/library");
    });
  });
});
