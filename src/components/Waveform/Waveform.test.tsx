import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from "vitest";
import Waveform from "./Waveform";
import { sampleSongQueue } from "../../api/samples";
import WaveSurfer from "wavesurfer.js";
import { useBoundStore } from "../../store/store";

const obj = {
  isReplay: false,
  playCountRef: { current: 0 },
  audioUrl: "http://audio.com/track.mp3",
  duration: 180,
  volume: 0.5,
  songIndex: 0,
  queueLength: 1,
  id: "13941",
  isMobileWidth: false,
  continuePlayback: () => {},
};
const wavesurferOptions = {
  waveColor: "#666666",
  cursorColor: "#10B981",
  progressColor: "#10B981",
  interact: true,
  fillParent: true,
  dragToSeek: true,
  autoScroll: true,
  normalize: true,
};
const mockOn = vi.fn();
const mockLoad = vi.fn();
const mockPlay = vi.fn();
const mockPause = vi.fn();
const mockDestroy = vi.fn();
const mockGetCurrentTime = vi.fn();
const mockUn = vi.fn();
const mockUnAll = vi.fn();
const mockSetVolume = vi.fn();
const mockSeekTo = vi.fn();

const handlers: Record<string, (() => unknown)[]> = {};
export const instance = {
  on: (event: string, cb: () => unknown) => {
    handlers[event] = handlers[event] || [];
    handlers[event].push(cb);
    mockOn(event, cb);
  },
  un: (event: string, cb: () => unknown) => {
    mockUn(event, cb);
    handlers[event] = (handlers[event] || []).filter((fn) => fn !== cb);
  },
  load: (url: string) => mockLoad(url),
  play: () => mockPlay(),
  pause: () => mockPause(),
  destroy: () => mockDestroy(),
  getCurrentTime: () => mockGetCurrentTime(),
  unAll: () => mockUnAll(),
  setVolume: (v: number) => mockSetVolume(v),
  seekTo: (v: number) => mockSeekTo(v),
};

vi.mock("wavesurfer.js", () => ({
  default: {
    create: vi.fn(() => instance),
  },
}));

beforeEach(() => {
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    load: vi.fn(),
  }));
  vi.spyOn(window, "addEventListener");
  vi.spyOn(window, "removeEventListener");
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("Waveform", () => {
  test("should render", () => {
    render(<Waveform {...obj} />);
    expect(screen.getByTestId("waveform-container")).toBeInTheDocument();
  });
  test("should create a desktop/tablet specific wavesurfer instance if isMobileWidth", () => {
    render(<Waveform {...obj} />);
    expect(WaveSurfer.create).toHaveBeenCalled();
    expect(WaveSurfer.create).toHaveBeenCalledWith({
      ...wavesurferOptions,
      container: expect.any(HTMLDivElement),
      barHeight: 2,
      barWidth: 2,
      height: 10,
      width: 400,
    });
  });
  test("should create a mobile specific wavesurfer instance if not isMobileWidth", () => {
    render(<Waveform {...{ ...obj, isMobileWidth: true }} />);
    expect(WaveSurfer.create).toHaveBeenCalled();
    expect(WaveSurfer.create).toHaveBeenCalledWith({
      ...wavesurferOptions,
      container: expect.any(HTMLDivElement),
      barHeight: 8,
      barWidth: 3,
      height: 50,
      width: 350,
    });
  });
  test("loads a new track (http -> https) and attaches 'ready' handler", async () => {
    render(<Waveform {...obj} />);

    expect(mockLoad).toHaveBeenCalledWith("https://audio.com/track.mp3");
    expect(mockOn).toHaveBeenCalledWith("ready", expect.any(Function));

    const readyHandlers = handlers["ready"] || [];
    expect(readyHandlers.length).toBeGreaterThan(0);
    act(() => {
      readyHandlers[0]();
    });

    expect(mockSeekTo).not.toHaveBeenCalled();
  });
  test("should use previous time on a re-render of the same track", () => {
    mockGetCurrentTime.mockReturnValue(30);
    const { rerender } = render(<Waveform {...obj} />);
    expect(WaveSurfer.create).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalledWith("ready", expect.any(Function));

    rerender(<Waveform {...{ ...obj, duration: 200 }} />);

    const readyHandlers = handlers["ready"] || [];
    const latest = readyHandlers[readyHandlers.length - 1];
    expect(latest).toBeDefined();

    act(() => {
      latest();
    });
    expect(mockSeekTo).toHaveBeenCalled();
  });
  describe("handleReady", () => {
    test("should seek to stored localStorage time on ready if same url", () => {
      const stored = {
        url: "https://audio.com/track.mp3",
        time: 42,
        duration: 120,
      };
      localStorage.setItem("last-waveform", JSON.stringify(stored));

      render(<Waveform {...obj} />);

      const readyHandler = mockOn.mock.calls.find((c) => c[0] === "ready")?.[1];
      act(() => readyHandler());
      waitFor(() => {
        expect(mockSeekTo).toHaveBeenCalledWith(
          expect.closeTo(stored.time / stored.duration, 2),
        );
      });
    });
    test("should resume at lastTimeRef if same track", () => {
      mockGetCurrentTime.mockReturnValue(30);

      const { rerender } = render(<Waveform {...obj} />);
      rerender(<Waveform {...obj} />);

      const readyHandler = mockOn.mock.calls
        .filter((c) => c[0] === "ready")
        .pop()?.[1];
      act(() => readyHandler());
      waitFor(() => {
        expect(mockSeekTo).toHaveBeenCalledWith(
          expect.closeTo(30 / obj.duration, 2),
        );
      });
    });
    test("should update currentTime on timeupdate", () => {
      mockGetCurrentTime.mockReturnValue(15);

      render(<Waveform {...obj} />);

      const timeUpdateHandler = mockOn.mock.calls.find(
        (c) => c[0] === "timeupdate",
      )?.[1];
      act(() => {
        timeUpdateHandler();
      });
      expect(screen.getByText("00:15")).toBeInTheDocument();
    });
    test("should play or pause depending on isPlaying", () => {
      act(() => {
        useBoundStore.getState().setIsPlaying(true);
      });
      const { rerender } = render(<Waveform {...obj} />);
      let readyHandler = mockOn.mock.calls.find((c) => c[0] === "ready")?.[1];
      act(() => {
        readyHandler();
      });
      expect(mockPlay).toHaveBeenCalled();
      act(() => {
        useBoundStore.getState().setIsPlaying(false);
      });
      rerender(<Waveform {...obj} />);
      readyHandler = mockOn.mock.calls.find((c) => c[0] === "ready")?.[1];
      act(() => {
        readyHandler();
      });
      expect(mockPause).toHaveBeenCalled();
    });
  });
  test("should save current state to localStorage on beforeunload", () => {
    mockGetCurrentTime.mockReturnValue(33);

    render(<Waveform {...obj} />);

    const unloadHandler = (window.addEventListener as Mock).mock.calls.find(
      (c) => c[0] === "beforeunload",
    )?.[1];

    act(() => {
      unloadHandler();
    });
    waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "last-waveform",
        expect.stringContaining('"time":33'),
      );
    });
  });
  test("should remove window event listeners on unmount", () => {
    const { unmount } = render(<Waveform {...obj} />);
    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });
  test("should pause if isPlaying is false", () => {
    render(<Waveform {...obj} />);
    expect(mockPause).toHaveBeenCalled();
  });
  test("should play if isPlaying is true", () => {
    act(() => {
      useBoundStore.getState().setIsPlaying(true);
    });
    render(<Waveform {...obj} />);
    expect(mockPlay).toHaveBeenCalled();
  });
  describe("Waveform finish event effect", () => {
    test("attaches and detaches finish handler", () => {
      const { unmount } = render(<Waveform {...obj} />);
      expect(mockOn).toHaveBeenCalledWith("finish", expect.any(Function));
      unmount();

      expect(screen.queryByTestId("waveform")).not.toBeInTheDocument();
      expect(mockUn).not.toHaveBeenCalledWith("finish", expect.any(Function));
    });
    test("replays track once if isReplay=true", () => {
      const replayObj = {
        ...obj,
        isReplay: true,
        playCountRef: { current: 0 },
        continuePlayback: vi.fn(),
      };
      render(<Waveform {...replayObj} />);

      const finishCall = mockOn.mock.calls.find((c) => c[0] === "finish");

      if (!finishCall) {
        throw new Error("WaveSurfer 'finish' event was not attached");
      }

      const finishHandler = finishCall[1];

      act(() => finishHandler());
      expect(replayObj.playCountRef.current).toBe(1);
      expect(mockSeekTo).toHaveBeenCalledWith(0);
      expect(mockPlay).toHaveBeenCalled();
      expect(replayObj.continuePlayback).not.toHaveBeenCalled();

      act(() => finishHandler());
      expect(replayObj.playCountRef.current).toBe(0);
      expect(replayObj.continuePlayback).toHaveBeenCalled();
    });

    test("advances queue if not replaying", () => {
      const setQueue = vi.fn();
      const continuePlayback = vi.fn();
      render(<Waveform {...obj} />);

      const finishCall = mockOn.mock.calls.find((c) => c[0] === "finish");
      if (!finishCall)
        throw new Error("WaveSurfer 'finish' event was not attached");

      const finishHandler = finishCall[1];
      act(() => finishHandler());
      waitFor(() => {
        expect(setQueue).toHaveBeenCalledWith(sampleSongQueue);
        expect(continuePlayback).toHaveBeenCalled();
      });
    });

    test("stops playback if last song and not replaying", () => {
      render(<Waveform {...obj} />);

      const finishCall = mockOn.mock.calls.find((c) => c[0] === "finish");
      if (!finishCall)
        throw new Error("WaveSurfer 'finish' event was not attached");

      const finishHandler = finishCall[1];
      act(() => finishHandler());

      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
    });
  });
  describe("secondsToHMS", () => {
    test("should convert seconds to HMS if available", () => {
      render(<Waveform {...obj} />);
      const seconds = screen.getByTestId("duration");
      expect(seconds.textContent).toBe("03:00");
    });
    test("should convert seconds to HMS if available", () => {
      render(<Waveform {...{ ...obj, duration: 0 }} />);
      const seconds = screen.getByTestId("duration");
      expect(seconds.textContent).toBe("--:--");
    });
  });
});
