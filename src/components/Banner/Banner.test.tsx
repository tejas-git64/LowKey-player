import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import Banner from "./Banner";
import { useBoundStore } from "../../store/store";
import { MemoryRouter } from "react-router-dom";

afterEach(() => {
  act(() => {
    useBoundStore.setState({
      notifications: false,
      recents: { activity: [], history: [] },
    });
  });
  cleanup();
});

describe("Banner", () => {
  test("should render", () => {
    render(
      <MemoryRouter>
        <Banner />
      </MemoryRouter>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("notifs")).toBeInTheDocument();
  });
  describe("NotificationButton", () => {
    test("should render", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      expect(screen.getByTestId("notifs")).toBeInTheDocument();
    });
    test("toggles notifications on button click", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      const button = screen.getByTestId("notifs").querySelector("button");
      const notifs = useBoundStore.getState().notifications;
      expect(button).toBeInTheDocument();
      expect(notifs).toBe(false);
      if (button) {
        fireEvent.click(button);
        expect(useBoundStore.getState().notifications).toBe(true);

        fireEvent.click(button);
        expect(useBoundStore.getState().notifications).toBe(false);
      }
    });
    test("should contain activity list", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(useBoundStore.getState().recents.activity.length).toBe(0);
    });
    test("activity list should be hidden when no notifications", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      expect(screen.getByRole("list")).toHaveClass("hidden");
    });
    test("activity list should be hidden on mouseLeave", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      expect(screen.getByRole("list")).toHaveClass("hidden");

      fireEvent.click(screen.getByTestId("notifs").querySelector("button")!);
      expect(screen.getByRole("list")).toHaveClass("absolute");

      fireEvent.mouseLeave(screen.getByRole("list"));
      expect(screen.getByRole("list")).toHaveClass("hidden");
    });
    test("activity list should be visible when notifications are on", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      const button = screen.getByTestId("notifs").querySelector("button");
      expect(screen.getByRole("list")).toHaveClass("hidden");

      if (button) {
        fireEvent.click(button);
        expect(useBoundStore.getState().notifications).toBe(true);
        expect(screen.getByRole("list")).not.toHaveClass("hidden");
      }
    });
    test("activity list should render activities", () => {
      render(
        <MemoryRouter>
          <Banner />
        </MemoryRouter>,
      );
      const recents = useBoundStore.getState().recents;
      const setActivity = useBoundStore.getState().setActivity;
      expect(recents.activity.length).toBe(0);

      act(() => {
        setActivity("Test activity 1");
        setActivity("Test activity 2");
        setActivity("Test activity 3");
      });

      waitFor(() => {
        expect(useBoundStore.getState().recents.activity.length).toBe(3);
        expect(screen.getAllByRole("list").length).toBe(3);
      });
    });
  });
});
