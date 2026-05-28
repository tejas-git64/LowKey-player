import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from "vitest";
const songfallback = "/fallbacks/song-fallback.webp";
import { useBoundStore } from "../../store/store";
import { sampleTrack } from "../../api/samples";
import Recents from "./Recents";

const { setHistory, setActivity } = useBoundStore.getState();

beforeEach(() => {
  act(() => {
    setHistory(sampleTrack);
  });
});

afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});

describe("Recents", () => {
  test("should render", async () => {
    render(<Recents />);
    expect(screen.getByTestId("recents")).toBeInTheDocument();
  });
  describe("RecentComponent useEffect localStorage", () => {
    const mockSetHistory = vi.fn();
    const mockSetActivity = vi.fn();
    const store: Record<string, string> = {};

    beforeEach(() => {
      mockSetHistory.mockClear();
      mockSetActivity.mockClear();

      const state = useBoundStore.getState();
      vi.spyOn(state, "setHistory").mockImplementation(mockSetHistory);
      vi.spyOn(state, "setActivity").mockImplementation(mockSetActivity);

      vi.spyOn(Storage.prototype, "getItem").mockImplementation(
        (key: string): string | null => store[key] || null,
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test("calls setHistory and setActivity with values from localStorage", async () => {
      const fakeData = JSON.stringify({
        history: [{ id: "h1" }, { id: "h2" }],
        activity: [{ message: "act1" }, { message: "act2" }],
      });
      (localStorage.getItem as Mock).mockReturnValue(fakeData);

      render(<Recents />);

      await waitFor(() => {
        expect(localStorage.getItem).toHaveBeenCalledWith("last-recents");
        expect(mockSetHistory).toHaveBeenCalledTimes(2);
        expect(mockSetHistory).toHaveBeenCalledWith({ id: "h1" });
        expect(mockSetHistory).toHaveBeenCalledWith({ id: "h2" });

        expect(mockSetActivity).toHaveBeenCalledTimes(2);
        expect(mockSetActivity).toHaveBeenCalledWith("act1");
        expect(mockSetActivity).toHaveBeenCalledWith("act2");
      });
    });

    test("does not call setHistory or setActivity if localStorage is empty", async () => {
      (localStorage.getItem as Mock).mockReturnValue(null);
      render(<Recents />);

      await waitFor(() => {
        expect(mockSetHistory).not.toHaveBeenCalled();
        expect(mockSetActivity).not.toHaveBeenCalled();
      });
    });
  });
  describe("RecentSong", () => {
    beforeEach(() => {
      act(() => {
        setHistory(sampleTrack);
      });
    });
    test("should render", async () => {
      render(<Recents />);
      await waitFor(() => {
        expect(useBoundStore.getState().recents.history.length).toBe(1);
        expect(screen.getByTestId("recent-songs").childElementCount).toBe(1);
      });
    });
    test("should have its image or songfallback", async () => {
      act(() => {
        useBoundStore.getState().setHistory(sampleTrack);
      });
      render(<Recents />);
      await waitFor(() => {
        expect(screen.getByAltText(`${sampleTrack.name}`)).toHaveAttribute(
          "src",
          sampleTrack.image[0].url,
        );
      });
    });
    test("should have its image as songfallback", async () => {
      render(<Recents />);
      act(() => {
        useBoundStore
          .getState()
          .setHistory({ ...sampleTrack, name: "some track", image: [] });
      });
      await waitFor(() => {
        expect(screen.getByAltText("some track")).toHaveAttribute(
          "src",
          songfallback,
        );
      });
    });
    test("should use songfallback as image on error", async () => {
      render(<Recents />);
      const image = screen.getByAltText(sampleTrack.name);
      fireEvent.error(image);
      await waitFor(() => {
        expect(screen.getByAltText(`${sampleTrack.name}`)).toHaveAttribute(
          "src",
          songfallback,
        );
      });
    });
    test("should have its name", async () => {
      render(<Recents />);
      expect(screen.getByText(sampleTrack.name)).toBeInTheDocument();
    });
    test("should have its name as Unknown track", async () => {
      setHistory({ ...sampleTrack, name: "" });
      render(<Recents />);
      expect(screen.getByText("Unknown track")).toBeInTheDocument();
    });
    test("should have its primary artist name if found", async () => {
      render(<Recents />);
      expect(
        screen.getByText(sampleTrack.artists.primary[0].name),
      ).toBeInTheDocument();
    });
    test("should have its primary artist name as Unknown Artist if not found", async () => {
      act(() => {
        setHistory({
          ...sampleTrack,
          artists: { ...sampleTrack.artists, primary: [] },
        });
      });
      render(<Recents />);
      expect(screen.getByText("Unknown Artist")).toBeInTheDocument();
    });
  });
  describe("Activity", () => {
    test("should render", async () => {
      act(() => {
        useBoundStore.getState().setActivity("new activity");
      });
      render(<Recents />);
      await waitFor(() => {
        expect(useBoundStore.getState().recents.activity.length).toBe(2);
        expect(screen.getByTestId("recent-activity").childElementCount).toBe(2);
      });
    });
    test("should fade in with the delay based on it's index", async () => {
      vi.useFakeTimers();
      act(() => {
        useBoundStore
          .getState()
          .setActivity(`Added ${sampleTrack.name} to a playlist`);
      });
      render(<Recents />);
      const index = useBoundStore.getState().recents.activity.length;
      vi.advanceTimersByTime(index * 50);

      expect(screen.getByTestId("recent-song")).not.toHaveClass("song-fadeout");
      expect(screen.getByTestId("recent-song")).toHaveClass("song-fadein");
      vi.useRealTimers();
    });
    test("should have the activity name", async () => {
      render(<Recents />);
      const message = `Added ${sampleTrack.name} to a playlist 'POP'`;
      act(() => {
        setActivity(message);
      });
      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });
});
