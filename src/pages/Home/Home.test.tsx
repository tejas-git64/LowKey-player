import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Home, { TimelyPlaylists, Widget } from "./Home";
import { sampleTrack } from "../../api/samples";
import { PlaylistById, PlaylistOfList } from "../../types/GlobalTypes";
import widgetfallback from "../../assets/fallbacks/widget-fallback.webp";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import fallbacktoday from "../../assets/fallbacks/timely/icons8-timely-today.webp";
import fallbackweekly from "../../assets/fallbacks/timely/icons8-timely-weekly.webp";
import fallbackmonthly from "../../assets/fallbacks/timely/icons8-timely-monthly.webp";
import fallbackyearly from "../../assets/fallbacks/timely/icons8-timely-yearly.webp";
import { IntersectionObserverMock } from "../../components/Section/Section.test";
import { useBoundStore } from "../../store/store";
import {
  mockedWidgetData,
  mockedTimelyData,
  obj,
  mockedSectionData,
  mockedNullDataResult,
} from "../../mocks/mocks.test";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});
const mockedUseQuery = vi.mocked(useQuery);

let observerInstance: IntersectionObserverMock | null;
const { setIsPlaying, setQueue } = useBoundStore.getState();
const fadeOutNavigate = vi.fn(() => {});

beforeEach(() => {
  vi.useFakeTimers();
  act(() => {
    observerInstance?.trigger(true);
    setIsPlaying(false);
    setQueue({
      id: "",
      name: "",
      image: [],
      songs: [],
    });
  });
  window.IntersectionObserver = vi.fn((cb) => {
    observerInstance = new IntersectionObserverMock(cb);
    return observerInstance;
  });
  mockedUseQuery.mockImplementation((options: any) => {
    const queryKey = options.queryKey[0];
    switch (queryKey) {
      case "widget":
        return mockedWidgetData as UseQueryResult<PlaylistById>;

      case "timely":
        return mockedTimelyData as UseQueryResult<typeof obj>;

      case "section":
        return mockedSectionData as UseQueryResult<PlaylistOfList[]>;

      default:
        return mockedSectionData as UseQueryResult<PlaylistOfList[]>;
    }
  });
});

afterEach(() => {
  act(() => {
    useBoundStore.getState().changeGreeting("");
  });
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Home", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/home"]}>
          <Home />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.runAllTimers();
    const home = screen.getByTestId("home-page");
    expect(home).not.toHaveClass("home-fadeout");
    expect(home).toHaveClass("home-fadein");
    expect(home).toBeInTheDocument();
  });
  test("should render widget", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/home"]}>
          <Home />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.runAllTimers();
    const widget = screen.getByTestId("widget");
    expect(widget).toBeInTheDocument();
  });
  test("should render timely playlists", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/home"]}>
          <Home />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.runAllTimers();
    const timely = screen.getByTestId("timely-playlists");
    expect(timely).toBeInTheDocument();
  });
  describe("greeting", () => {
    test('should be "Good morning" at 9 AM', () => {
      vi.setSystemTime(new Date("2025-01-01T09:00:00"));
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <Home />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(useBoundStore.getState().greeting).toBe("Good morning");
    });
    test('should be "Good afternoon" at 2 PM', () => {
      vi.setSystemTime(new Date("2025-01-01T14:00:00"));
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <Home />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(useBoundStore.getState().greeting).toBe("Good afternoon");
    });
    test('should be "Good evening" at 5 PM', () => {
      vi.setSystemTime(new Date("2025-01-01T17:00:00"));
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <Home />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(useBoundStore.getState().greeting).toBe("Good evening");
    });
    test('should be "Good evening" at 8 PM', () => {
      vi.setSystemTime(new Date("2025-01-01T20:00:00"));
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <Home />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(useBoundStore.getState().greeting).toBe("Good night");
    });
    test('should be "Jump back in"', () => {
      vi.setSystemTime(new Date(""));
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <Home />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(useBoundStore.getState().greeting).toBe("Jump back in");
    });
  });
  describe("Widget", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <Widget fadeOutNavigate={fadeOutNavigate} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      vi.runAllTimers();
      const timely = screen.getByTestId("widget");
      expect(timely).toBeInTheDocument();
    });
    describe("image", () => {
      test("should render", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const image = screen.getByTestId("widget-image");
        expect(image).toBeInTheDocument();
      });
      test("should play playlist onClick", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const image = screen.getByTestId("widget-image");
        fireEvent.click(image);
        expect(fadeOutNavigate).toHaveBeenCalledWith("/playlists/ae5fa1Ax");
      });
      test("should play playlist onClick", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const widget = screen.getByTestId("widget");
        const image = screen.getByTestId("widget-image");

        expect(widget).toHaveClass("song-fadeout");
        expect(image).toHaveClass("widget-banner-fadeout");

        fireEvent.load(image);

        expect(widget).toHaveClass("song-fadein");
        expect(image).toHaveClass("widget-banner-fadein");
      });
      test("should contain widgetfallback as image onError", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const image = screen.getByTestId("widget-image") as HTMLImageElement;
        fireEvent.error(image);
        expect(image.src).toContain(widgetfallback);
      });
    });
    describe("play button", () => {
      test("should have tabIndex as 0 on having data", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const widgetBtn = screen.getByTestId("widget-btn");
        expect(widgetBtn.tabIndex).toBe(0);
      });
      test("should have tabIndex as -1 on not having data", () => {
        mockedUseQuery.mockReturnValue(
          mockedNullDataResult as UseQueryResult<null>,
        );
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const widgetBtn = screen.getByTestId("widget-btn");
        expect(widgetBtn.tabIndex).toBe(-1);
      });
      test("should set playlist as queue & playback onClick", () => {
        const obj = {
          id: "ae5fa1Ax",
          name: "Playlist 13",
          image: [
            {
              quality: "50x50",
              url: "image url",
            },
          ],
          songs: [sampleTrack],
        };
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const widgetBtn = screen.getByTestId("widget-btn");
        fireEvent.click(widgetBtn);
        expect(useBoundStore.getState().nowPlaying.queue).toEqual(obj);
        expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
        expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
      });
      test("should toggle playlist playback onClick if already set", () => {
        act(() => {
          setIsPlaying(true);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const widgetBtn = screen.getByTestId("widget-btn");
        fireEvent.click(widgetBtn);
        expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
      });
      test("should set playlist as queue & playback onClick", () => {
        const obj = {
          id: "",
          name: "",
          image: [],
          songs: [],
        };
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const widgetBtn = screen.getByTestId("widget-btn");
        fireEvent.click(widgetBtn);
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.queue).toEqual(obj);
          expect(useBoundStore.getState().nowPlaying.track).toEqual(
            sampleTrack,
          );
          expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
        });
      });
      test("should have icon as play if isPlaying is false", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const image = screen.getByAltText("play") as HTMLImageElement;
        expect(image.src).toContain(play);
      });
      test("should have icon as pause if isPlaying is true", () => {
        act(() => {
          setIsPlaying(true);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <Widget fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const image = screen.getByAltText("play") as HTMLImageElement;
        expect(image.src).toContain(pause);
      });
    });
  });
  describe("TimelyPlaylists", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/home"]}>
            <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      vi.runAllTimers();
      const timely = screen.getByTestId("timely-playlists");
      expect(timely).toBeInTheDocument();
    });
    describe("Today playlist", () => {
      test("should navigate to playlist onClick", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const timely = screen.getByTestId("today-playlist");
        fireEvent.click(timely);
        expect(fadeOutNavigate).toHaveBeenCalledWith("/playlists/ae5fa1Ax");
      });
      describe("should have image", () => {
        test("call handleImageLoad onLoad", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const today = screen.getByTestId(
            "today-playlist-image",
          ) as HTMLImageElement;
          fireEvent.load(today);
          expect(screen.getByTestId("timely-playlists")).toHaveClass(
            "song-fadeout",
          );
        });
        test("of the playlist if avalable", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const today = screen.getByTestId(
            "today-playlist-image",
          ) as HTMLImageElement;
          expect(today.src).toContain("image%20url");
        });
        test("as fallbacktoday if not available", () => {
          mockedUseQuery.mockReturnValue(
            mockedNullDataResult as UseQueryResult<null>,
          );
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const today = screen.getByTestId(
            "today-playlist-image",
          ) as HTMLImageElement;
          expect(today.src).toContain(fallbacktoday);
        });
        test("as fallbackyearly onError", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const today = screen.getByTestId(
            "today-playlist-image",
          ) as HTMLImageElement;
          fireEvent.error(today);
          expect(today.src).toContain(fallbacktoday);
        });
      });
    });
    describe("Weekly playlist", () => {
      test("should navigate to playlist onClick", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const timely = screen.getByTestId("weekly-playlist");
        fireEvent.click(timely);
        expect(fadeOutNavigate).toHaveBeenCalledWith("/playlists/ae5fa1Ax");
      });
      describe("should have image", () => {
        test("call handleImageLoad onLoad", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const weekly = screen.getByTestId(
            "weekly-playlist-image",
          ) as HTMLImageElement;
          fireEvent.load(weekly);
          expect(screen.getByTestId("timely-playlists")).toHaveClass(
            "song-fadeout",
          );
        });
        test("of the playlist if avalable", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const weekly = screen.getByTestId(
            "weekly-playlist-image",
          ) as HTMLImageElement;
          expect(weekly.src).toContain("image%20url");
        });
        test("as fallbackweekly if not available", () => {
          mockedUseQuery.mockReturnValue(
            mockedNullDataResult as UseQueryResult<null>,
          );
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const weekly = screen.getByTestId(
            "weekly-playlist-image",
          ) as HTMLImageElement;
          expect(weekly.src).toContain(fallbackweekly);
        });
        test("as fallbackweekly onError", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const weekly = screen.getByTestId(
            "weekly-playlist-image",
          ) as HTMLImageElement;
          fireEvent.error(weekly);
          expect(weekly.src).toContain(fallbackweekly);
        });
      });
    });
    describe("Monthly playlist", () => {
      test("should navigate to playlist onClick", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const timely = screen.getByTestId("monthly-playlist");
        fireEvent.click(timely);
        expect(fadeOutNavigate).toHaveBeenCalledWith("/playlists/ae5fa1Ax");
      });
      describe("should have image", () => {
        test("call handleImageLoad onLoad", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const monthly = screen.getByTestId(
            "monthly-playlist-image",
          ) as HTMLImageElement;
          fireEvent.load(monthly);
          expect(screen.getByTestId("timely-playlists")).toHaveClass(
            "song-fadeout",
          );
        });
        test("of the playlist if avalable", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const monthly = screen.getByTestId(
            "monthly-playlist-image",
          ) as HTMLImageElement;
          expect(monthly.src).toContain("image%20url");
        });
        test("as fallbackmonthly if not available", () => {
          mockedUseQuery.mockReturnValue(
            mockedNullDataResult as UseQueryResult<null>,
          );
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const monthly = screen.getByTestId(
            "monthly-playlist-image",
          ) as HTMLImageElement;
          expect(monthly.src).toContain(fallbackmonthly);
        });
        test("as fallbackmonthly onError", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const monthly = screen.getByTestId(
            "monthly-playlist-image",
          ) as HTMLImageElement;
          fireEvent.error(monthly);
          expect(monthly.src).toContain(fallbackmonthly);
        });
      });
    });
    describe("Yearly playlist", () => {
      test("should navigate to playlist onClick", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/home"]}>
              <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.runAllTimers();
        const timely = screen.getByTestId("yearly-playlist");
        fireEvent.click(timely);
        expect(fadeOutNavigate).toHaveBeenCalledWith("/playlists/ae5fa1Ax");
      });
      describe("should have image", () => {
        test("call handleImageLoad onLoad", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const yearly = screen.getByTestId(
            "yearly-playlist-image",
          ) as HTMLImageElement;
          fireEvent.load(yearly);
          expect(screen.getByTestId("timely-playlists")).toHaveClass(
            "song-fadeout",
          );
        });
        test("of the playlist if avalable", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const yearly = screen.getByTestId(
            "yearly-playlist-image",
          ) as HTMLImageElement;
          expect(yearly.src).toContain("image%20url");
        });
        test("as fallbackyearly if not available", () => {
          mockedUseQuery.mockReturnValue(
            mockedNullDataResult as UseQueryResult<null>,
          );
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const yearly = screen.getByTestId(
            "yearly-playlist-image",
          ) as HTMLImageElement;
          expect(yearly.src).toContain(fallbackyearly);
        });
        test("as fallbackyearly onError", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={["/home"]}>
                <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          vi.runAllTimers();
          const yearly = screen.getByTestId(
            "yearly-playlist-image",
          ) as HTMLImageElement;
          fireEvent.error(yearly);
          expect(yearly.src).toContain(fallbackyearly);
        });
      });
    });
  });
});
