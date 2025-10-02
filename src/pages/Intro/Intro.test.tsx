import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import Intro from "./Intro";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";

afterEach(() => {
  cleanup();
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
  test("fadeOutNavigate function applies fadeout transitions and navigates", () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Intro />
      </MemoryRouter>,
    );
    const { result } = renderHook(() => useNavigate(), {
      wrapper: MemoryRouter,
    });
    const l = renderHook(() => useLocation(), {
      wrapper: MemoryRouter,
    });
    const navigate = result.current;
    const path = l.result.current.pathname;
    const button = screen.getByText("Check it out");
    button.click();
    expect(button.classList.contains("intro-fadeout")).toBe(true);
    expect(
      screen.getByTestId("intro-card").classList.contains("card-fadeout"),
    ).toBe(true);
    expect(
      screen
        .getByAltText("background-image")
        .classList.contains("intro-fadeout"),
    ).toBe(true);
    vi.advanceTimersByTime(150);
    act(() => {
      navigate("/home");
    });
    waitFor(() => {
      expect(path).toBe("/home");
    });
    vi.useRealTimers();
  });
  test("loadImage function applies fadein transitions", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Intro />
      </MemoryRouter>,
    );
    const image = screen.getByAltText("background-image");
    const card = screen.getByTestId("intro-card");
    const button = screen.getByText("Check it out");
    fireEvent.load(image);
    expect(image.classList.contains("intro-fadein")).toBe(true);
    expect(card.classList.contains("card-fadein")).toBe(true);
    expect(button.classList.contains("intro-fadein")).toBe(true);
  });
});
