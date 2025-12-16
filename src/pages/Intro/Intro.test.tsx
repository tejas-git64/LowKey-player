import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import Intro from "./Intro";
import { MemoryRouter, useLocation } from "react-router-dom";

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("Intro", () => {
  test("should render", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Intro />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("intro-page")).toBeInTheDocument();
  });
  test("card should render", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Intro />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("intro-card")).toBeInTheDocument();
  });
  test("'Check it out' button should render", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Intro />
      </MemoryRouter>,
    );
    expect(screen.getByText("Check it out")).toBeInTheDocument();
  });
  describe("fadeOutNavigate function", () => {
    test("applies fadeout transitions and navigates", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Intro />
        </MemoryRouter>,
      );
      const l = renderHook(() => useLocation(), {
        wrapper: MemoryRouter,
      });
      const path = l.result.current.pathname;
      const button = screen.getByText("Check it out");
      act(() => {
        button.click();
      });
      expect(button.classList).toContain("animate-intro-fadeout");
      expect(screen.getByTestId("intro-card").classList).toContain(
        "animate-card-fadeout",
      );
      expect(screen.getByAltText("background").classList).toContain(
        "animate-intro-fadeout",
      );
      vi.advanceTimersByTime(150);
      waitFor(() => {
        expect(path).toBe("/home");
      });
    });
  });
});
