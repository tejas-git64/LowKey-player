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
import Search from "./Search";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import fallback from "/fallbacks/playlist-fallback.webp";
import songfallback from "/fallbacks/song-fallback.webp";
import artistfallback from "/fallbacks/artist-fallback.png";
import { MemoryRouter } from "react-router-dom";
import { useBoundStore } from "../../store/store";
import { sampleSearchResults, sampleTrack } from "../../api/samples";
import { userEvent } from "@testing-library/user-event";
import { defaultSearchData } from "../../utils/utils";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Mock),
    useNavigate: () => mockedNavigate,
  };
});
const mockedNavigate = vi.fn();
const originalFetch = globalThis.fetch;
const store = useBoundStore;
const initialStoreState = store.getState();
const { setSearch, setNowPlaying } = useBoundStore.getState();
let setSearchMock: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  setSearchMock = vi.fn();
  act(() => {
    store.setState(initialStoreState, true);
    store.setState((state) => ({
      ...state,
      setSearch: setSearchMock,
      search: sampleSearchResults,
      nowPlaying: {
        track: null,
        isPlaying: false,
        isMobilePlayer: false,
        isFavorite: false,
        queue: null,
      },
      isPlaying: false,
    }));
  });
});

afterEach(() => {
  act(() => {
    store.setState((state) => ({
      ...state,
      search: defaultSearchData,
    }));
  });

  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
  cleanup();
  vi.clearAllTimers();
});

describe("Search", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/search"]}>
          <Search />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("search-page")).toBeInTheDocument();
  });
  test("should render search results", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/search"]}>
          <Search />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("results-container")).toBeInTheDocument();
  });
  test("should render search fallback", () => {
    act(() => {
      setSearch(defaultSearchData);
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/search"]}>
          <Search />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("search-fallback")).toBeInTheDocument();
  });
  describe("TopQuery", () => {
    test("should render top query results", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const topQuery = screen.getByTestId("top-queries");
      const topQueryResults = screen.getByTestId("top-query-results");
      expect(topQuery).toBeInTheDocument();
      expect(topQueryResults.childElementCount).toBe(1);
    });
    test("should contain the top query's image, title and aria-label as title if available", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const topResult = screen.getByTestId("top-result");
      const topTitle = screen.getByTestId("query-title");
      const queryImage = screen.getByAltText("Some query result");
      expect(topResult.ariaLabel).toBe("Some query result");
      expect(topTitle.textContent).toBe("Some query result");
      expect((queryImage as HTMLImageElement).src).toContain("artist%20url");
    });
    test("should not contain the top query's image, title and aria-label as title if not available", () => {
      act(() => {
        setSearch({
          ...sampleSearchResults,
          topQuery: {
            results: [
              {
                ...sampleSearchResults.topQuery.results[0],
                title: "",
                image: [],
              },
            ],
            position: 0,
          },
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const topResult = screen.getByTestId("top-result");
      const topTitle = screen.getByTestId("query-title");
      const queryImage = screen.getByAltText("Unknown title");
      expect(topResult.ariaLabel).toBe("artist");
      expect(topTitle.textContent).toBe("Unknown title");
      expect((queryImage as HTMLImageElement).src).not.toContain(
        "artist%20url",
      );
    });
    test("should navigate to that route on clicking the top query result", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const topResult = screen.getByTestId("top-result");
      expect(topResult).toBeInTheDocument();
      act(() => {
        fireEvent.click(topResult);
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/artists/568648");
    });
    describe("should navigate to that route onKeyDown", () => {
      test("using Enter key", async () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const topResult = screen.getByTestId("top-result");
        expect(topResult).toBeInTheDocument();
        act(() => {
          fireEvent.keyDown(topResult, {
            key: "Enter",
            code: "Enter",
            charCode: 13,
          });
        });
        expect(mockedNavigate).toHaveBeenCalledWith("/artists/568648");
      });
      test("using Space key", async () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const topResult = screen.getByTestId("top-result");
        expect(topResult).toBeInTheDocument();
        act(() => {
          fireEvent.keyDown(topResult, {
            key: " ",
            code: "Space",
            charCode: 32,
          });
        });
        expect(mockedNavigate).toHaveBeenCalledWith("/artists/568648");
      });
    });
    test("should not navigate to that route onKeyDown using other keys", () => {
      const user = userEvent.setup();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const topResult = screen.getByTestId("top-result");
      expect(topResult).toBeInTheDocument();
      topResult.focus();
      act(() => {
        user.keyboard("{s}");
      });
      expect(mockedNavigate).not.toHaveBeenCalledWith("/artists/568648");
    });
  });
  describe("QuerySongs", () => {
    afterEach(() => {
      setNowPlaying(null);
    });
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("query-songs")).toBeInTheDocument();
    });
    test("should contain the top query's image, title and aria-label as title if available", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const songResult = screen.getByTestId("query-song");
      const songTitle = screen.getByTestId("query-song-title");
      const songImage = screen.getByAltText("Track1");
      expect(songResult.ariaLabel).toBe("Track1");
      expect(songTitle.textContent).toBe("Track1");
      expect((songImage as HTMLImageElement).src).toContain(
        "song%20image%20url",
      );
    });
    test("should not contain the top query's image, title and aria-label as title if not available", () => {
      act(() => {
        setSearch({
          ...sampleSearchResults,
          songs: {
            results: [
              {
                ...sampleSearchResults.songs.results[0],
                title: "",
                image: [],
              },
            ],
            position: 0,
          },
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const songResult = screen.getByTestId("query-song");
      const songTitle = screen.getByTestId("query-song-title");
      const songImage = screen.getByAltText("Unknown song");
      expect(songResult.ariaLabel).toBe("song");
      expect(songTitle.textContent).toBe("Unknown song");
      expect((songImage as HTMLImageElement).src).not.toContain(
        "song%20image%20url",
      );
    });
    test("should contain songfallback as the top query's image onError", () => {
      act(() => {
        setSearch({
          ...sampleSearchResults,
          songs: {
            results: [
              {
                ...sampleSearchResults.songs.results[0],
                image: [],
              },
            ],
            position: 0,
          },
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const songImage = screen.getByAltText("Track1");
      fireEvent.error(songImage);
      expect((songImage as HTMLImageElement).src).toContain(songfallback);
    });
    test("should set the track on clicking the song result", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const querySong = screen.getByTestId("query-song");
      act(() => {
        fireEvent.click(querySong);
      });
      const track = useBoundStore.getState().nowPlaying.track;
      if (track) expect(track.id).toBeDefined();
    });
    describe("should set the track onKeyDown", () => {
      test("using Enter key", () => {
        globalThis.fetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [sampleTrack] }),
          }),
        ) as Mock;
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const querySong = screen.getByTestId("query-song");
        act(() => {
          fireEvent.keyDown(querySong, {
            key: "Enter",
            code: "Enter",
            charCode: 13,
          });
        });
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.track).toBeDefined();
          expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
        });
      });
      test("using Space key", () => {
        globalThis.fetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [sampleTrack] }),
          }),
        ) as Mock;
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const querySong = screen.getByTestId("query-song");
        act(() => {
          fireEvent.keyDown(querySong, {
            key: " ",
            code: "Space",
            charCode: 32,
          });
        });
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.track).toBeDefined();
          expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
        });
      });
    });
    test("should not set the track onKeyDown using other keys", () => {
      const user = userEvent.setup();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const querySong = screen.getByTestId("query-song");
      querySong.focus();
      act(() => {
        user.keyboard("{s}");
      });
      expect(useBoundStore.getState().nowPlaying.track).toBeNull();
    });
    test("should log error if the track is not found", async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.reject(new Error("Network error")),
      );
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const querySong = screen.getByTestId("query-song");
      act(() => {
        fireEvent.keyDown(querySong, {
          key: " ",
          code: "Space",
          charCode: 32,
        });
      });
      await expect(globalThis.fetch("")).rejects.toThrow("Network error");
    });
  });
  describe("QueryPlaylists", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("query-playlists")).toBeInTheDocument();
    });
    test("should not render if not available", async () => {
      act(() => {
        setSearch({
          topQuery: null,
          albums: null,
          artists: null,
          playlists: null,
          songs: null,
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playlists = screen.queryByTestId("query-playlists");
      expect(playlists).not.toBeInTheDocument();
    });
    test("should contain the playlist image and title if available", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playlistResult = screen.getByTestId("query-playlist");
      const playlistTitle = screen.getByTestId("query-playlist-title");
      const playlistImage = screen.getByAltText("Some title");
      expect(playlistResult).toBeInTheDocument();
      expect(playlistTitle.textContent).toContain("Some title");
      expect((playlistImage as HTMLImageElement).src).toContain("some%20url");
    });
    test("should not contain fallback as playlist image and 'Unknown playlist' as title if not available", () => {
      act(() => {
        setSearch({
          ...sampleSearchResults,
          playlists: {
            results: [
              {
                ...sampleSearchResults.playlists.results[0],
                title: "",
                image: [],
              },
            ],
            position: 1,
          },
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playlistTitle = screen.getByTestId("query-playlist-title");
      const playlistImage = screen.getByAltText("Unknown playlist");
      expect(playlistTitle.textContent).toContain("Unknown playlist");
      expect((playlistImage as HTMLImageElement).src).toContain(fallback);
    });
    test("should contain fallback as playlist image onError ", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const playlistImage = screen.getByAltText("Some title");
      fireEvent.error(playlistImage);
      expect((playlistImage as HTMLImageElement).src).toContain(fallback);
    });
  });
  describe("QueryArtists", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("query-artists")).toBeInTheDocument();
    });
    test("should contain the artist's image and title if available", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const artistResult = screen.getByTestId("query-artist");
      const artistTitle = screen.getByTestId("query-artist-title");
      const artistImage = screen.getAllByAltText("Encore")[0];
      expect(artistResult).toBeInTheDocument();
      expect(artistTitle.textContent).toContain("Encore");
      expect((artistImage as HTMLImageElement).src).toContain("some%20url");
    });
    test("should not contain fallback as image and 'Unknown Artist' if not available", () => {
      act(() => {
        setSearch({
          ...sampleSearchResults,
          artists: {
            results: [
              {
                ...sampleSearchResults.artists.results[0],
                title: "",
                image: [],
              },
            ],
            position: 1,
          },
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const artistTitle = screen.getByTestId("query-artist-title");
      const artistImage = screen.getByAltText("Unknown Artist");
      expect(artistTitle.textContent).toContain("Unknown Artist");
      expect((artistImage as HTMLImageElement).src).toContain(artistfallback);
    });
    test("should contain fallback as artist image onError ", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const artistImage = screen.getAllByAltText("Encore")[0];
      fireEvent.error(artistImage);
      waitFor(() => {
        expect((artistImage as HTMLImageElement).src).toContain(artistfallback);
      });
    });
  });
  describe("QueryAlbums", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("query-albums")).toBeInTheDocument();
    });
    test("should add fadeIn animation for image of each album", () => {
      vi.useFakeTimers();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const image = screen.getAllByAltText("Encore")[0];
      expect(image).toHaveClass("image-fadeout");
      vi.runAllTimers();
      expect(image).toHaveClass("image-fadein");
      vi.useRealTimers();
    });
    test("should contain the album's image and title if available", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const albumResult = screen.getByTestId("query-artist");
      const albumTitle = screen.getByTestId("query-album-title");
      const albumImage = screen.getAllByAltText("Encore")[0];
      expect(albumResult).toBeInTheDocument();
      expect(albumTitle.textContent).toContain("Encore");
      expect((albumImage as HTMLImageElement).src).toContain("some%20url");
    });
    test("should not contain fallback as image and 'Unknown Album' if not available", () => {
      act(() => {
        setSearch({
          ...sampleSearchResults,
          albums: {
            results: [
              {
                ...sampleSearchResults.albums.results[0],
                title: "",
                image: [],
              },
            ],
            position: 1,
          },
        });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const albumTitle = screen.getByTestId("query-album-title");
      const albumImage = screen.getByAltText("Unknown Album");
      expect(albumTitle.textContent).toContain("Unknown Album");
      expect((albumImage as HTMLImageElement).src).toContain(fallback);
    });
    test("should contain fallback as album image onError ", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const albumImage = screen.getAllByAltText("Encore")[0];
      fireEvent.error(albumImage);
      expect((albumImage as HTMLImageElement).src).toContain(fallback);
    });
  });
});
