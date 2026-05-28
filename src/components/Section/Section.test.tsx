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
import { IntersectionObserverMock } from "../../helpers/IntersectionObserverMock";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return { ...actual, useQuery: vi.fn() };
});
const mockedUseQuery = vi.mocked(useQuery);

let observerInstance: IntersectionObserverMock | null;
const genre = "edm";
const fadeOutNavigate = vi.fn();

beforeEach(() => {
  mockedUseQuery.mockReturnValue(
    mockedSectionData as UseQueryResult<PlaylistOfList[]>,
  );
  globalThis.IntersectionObserver = vi.fn(function (this: unknown, cb) {
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
  test("should render the section title", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Section genre={genre} fadeOutNavigate={fadeOutNavigate} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId(genre)).toBeInTheDocument();
  });
  test("should render playlists when intersecting and data is returned", async () => {
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
  test("should navigate to the correct playlist page on click", async () => {
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
    test("should not call queryFn before intersection", async () => {
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

    test("should call queryFn only when section becomes intersecting", async () => {
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

    test("getPlaylist should fetch and process data correctly", async () => {
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
      if (observerInstance)
        expect(observerInstance.disconnect).toHaveBeenCalled();
    });
  });
});

export { IntersectionObserverMock };
