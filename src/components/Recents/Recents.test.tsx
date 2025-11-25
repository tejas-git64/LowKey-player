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
import songfallback from "../../assets/fallbacks/song-fallback.webp";
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
  cleanup();
});

describe("Recents", () => {
  test("should render", () => {
    render(<Recents />);
    expect(screen.getByTestId("recents")).toBeInTheDocument();
  });
  describe("RecentComponent useEffect localStorage", () => {
    let mockSetHistory: ReturnType<typeof vi.fn>;
    let mockSetActivity: ReturnType<typeof vi.fn>;
    const store: Record<string, string> = {};

    beforeEach(() => {
      mockSetHistory = vi.fn();
      mockSetActivity = vi.fn();

      vi.spyOn(Storage.prototype, "getItem").mockImplementation(
        (key: string): string | null => {
          return store[key] || null;
        },
      );
    });

    test("calls setHistory and setActivity with values from localStorage", () => {
      const fakeData = JSON.stringify({
        history: [{ id: "h1" }, { id: "h2" }],
        activity: ["act1", "act2"],
      });
      render(<Recents />);
      (localStorage.getItem as Mock).mockReturnValue(fakeData);

      waitFor(() => {
        expect(localStorage.getItem).toHaveBeenCalledWith("last-recents");
        expect(mockSetHistory).toHaveBeenCalledTimes(2);
        expect(mockSetHistory).toHaveBeenCalledWith({ id: "h1" });
        expect(mockSetHistory).toHaveBeenCalledWith({ id: "h2" });

        expect(mockSetActivity).toHaveBeenCalledTimes(2);
        expect(mockSetActivity).toHaveBeenCalledWith("act1");
        expect(mockSetActivity).toHaveBeenCalledWith("act2");
      });
    });

    test("does not call setHistory or setActivity if localStorage is empty", () => {
      render(<Recents />);
      localStorage.getItem("last-recents");

      (localStorage.getItem as Mock).mockReturnValue(null);
      expect(mockSetHistory).not.toHaveBeenCalled();
      expect(mockSetActivity).not.toHaveBeenCalled();
    });
  });
  describe("RecentSong", () => {
    beforeEach(() => {
      act(() => {
        setHistory(sampleTrack);
      });
    });
    test("should render", () => {
      render(<Recents />);
      waitFor(() => {
        expect(useBoundStore.getState().recents.history.length).toBe(1);
        expect(screen.getByTestId("recent-songs").childElementCount).toBe(1);
      });
    });
    test("should have its image or songfallback", () => {
      render(<Recents />);
      waitFor(() => {
        expect(screen.getByAltText(`${sampleTrack.name}-img`)).toHaveAttribute(
          "src",
          sampleTrack.image[0].url,
        );
      });
    });
    test("should have its image as songfallback", () => {
      render(<Recents />);
      act(() => {
        useBoundStore
          .getState()
          .setHistory({ ...sampleTrack, name: "some track", image: [] });
      });
      waitFor(() => {
        expect(screen.getByAltText("some track-img")).toHaveAttribute(
          "src",
          songfallback,
        );
      });
    });
    test("should use songfallback as image on error", () => {
      render(<Recents />);
      const image = screen.getByAltText(`${sampleTrack.name}-img`);
      fireEvent.error(image);
      waitFor(() => {
        expect(screen.getByAltText(`${sampleTrack.name}-img`)).toHaveAttribute(
          "src",
          songfallback,
        );
      });
    });
    test("should have its name", () => {
      render(<Recents />);
      expect(screen.getByText(sampleTrack.name)).toBeInTheDocument();
    });
    test("should have its name as Unknown track", () => {
      setHistory({ ...sampleTrack, name: "" });
      render(<Recents />);
      expect(screen.getByText("Unknown track")).toBeInTheDocument();
    });
    test("should have its primary artist name if found", () => {
      render(<Recents />);
      expect(
        screen.getByText(sampleTrack.artists.primary[0].name),
      ).toBeInTheDocument();
    });
    test("should have its primary artist name as Unknown Artist if not found", () => {
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
    test("should render", () => {
      render(<Recents />);
      waitFor(() => {
        expect(useBoundStore.getState().recents.activity.length).toBe(1);
        expect(screen.getByTestId("recent-activity").childElementCount).toBe(1);
      });
    });
    test("should fade in with the delay based on it's index", () => {
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
    test("should have the activity name", () => {
      render(<Recents />);
      const message = `Added ${sampleTrack.name} to a playlist 'POP'`;
      act(() => {
        setActivity(message);
      });
      waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });
});
