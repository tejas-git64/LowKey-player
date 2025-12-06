import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Section from "./Section";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { PlaylistOfList } from "../../types/GlobalTypes";
import { mockedSectionData, mockedNullDataResult } from "../../mocks/mocks";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return { ...actual, useQuery: vi.fn() };
});

export class IntersectionObserverMock implements IntersectionObserver {
  callback: IntersectionObserverCallback;
  root: Element | null = null;
  rootMargin: string = "";
  scrollMargin: string = "";
  thresholds: ReadonlyArray<number> = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    if (options?.rootMargin) this.rootMargin = options.rootMargin;
    if (options?.threshold !== undefined) {
      this.thresholds = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold];
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    observerInstance = this;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn((): IntersectionObserverEntry[] => []);

  trigger(isIntersecting: boolean) {
    const entry: IntersectionObserverEntry = {
      isIntersecting,
      target: {} as Element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    };
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}
const mockedUseQuery = vi.mocked(useQuery);

let observerInstance: IntersectionObserverMock | null;
const genre = "edm";
const fadeOutNavigate = vi.fn();

beforeEach(() => {
  mockedUseQuery.mockReturnValue(
    mockedSectionData as UseQueryResult<PlaylistOfList[]>,
  );
  globalThis.IntersectionObserver = vi.fn((cb) => {
    observerInstance = new IntersectionObserverMock(cb);
    return observerInstance;
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Section", () => {
  test("should render the section title", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId(genre)).toBeInTheDocument();
  });
  test("should render playlists when intersecting and data is returned", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    act(() => {
      observerInstance?.trigger(true);
    });
    waitFor(() => {
      const item = screen.getByTestId("playlist-item");
      expect(item).toBeInTheDocument();
    });
  });
  test("should navigate to the correct playlist page on click", () => {
    vi.useFakeTimers();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/"]}>
          <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.runAllTimers();
    act(() => {
      observerInstance?.trigger(true);
    });
    const item = screen.getByTestId("playlist-item");
    fireEvent.click(item);
    expect(fadeOutNavigate).toHaveBeenCalledWith("/playlists/2312321");
  });

  describe("IntersectionObserver", () => {
    test("should not call queryFn before intersection", () => {
      const getPlaylist = vi.fn();
      mockedUseQuery.mockReturnValue(
        mockedNullDataResult as UseQueryResult<null>,
      );
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(getPlaylist).not.toHaveBeenCalled();
    });

    test("should call queryFn only when section becomes intersecting", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      act(() => {
        observerInstance?.trigger(true);
      });
      expect(mockedUseQuery).toHaveBeenCalled();
    });

    test("getPlaylist should fetch and process data correctly", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/"]}>
            <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      act(() => {
        observerInstance?.trigger(true);
      });
      const playlistItems = screen.getAllByTestId("playlist-item");
      expect(playlistItems.length).toBe(1);
      expect(playlistItems[0]).toHaveTextContent("Playlist 21");
    });

    test("should call disconnect on unmount", () => {
      const { unmount } = render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      unmount();
      expect(observerInstance?.disconnect).toHaveBeenCalled();
    });
  });
});
