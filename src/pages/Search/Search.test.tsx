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
  test,
  vi,
} from "vitest";
import Search from "./Search";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import { MemoryRouter } from "react-router-dom";
import { useBoundStore } from "../../store/store";
import { sampleSearchResults, sampleTrack } from "../../api/samples";
import { userEvent } from "@testing-library/user-event";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});
const mockedNavigate = vi.fn();
const originalFetch = global.fetch;
const { setSearch, setNowPlaying, setIsPlaying } = useBoundStore.getState();

beforeEach(() => {
  act(() => {
    setSearch(sampleSearchResults);
    setNowPlaying(null);
    setIsPlaying(false);
  });
});

afterEach(() => {
  act(() => {
    setSearch({
      topQuery: null,
      albums: null,
      artists: null,
      playlists: null,
      songs: null,
    });
  });
  vi.restoreAllMocks();
  global.fetch = originalFetch;
  cleanup();
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
      const topResult = screen.getByTestId("top-result") as HTMLLIElement;
      const topTitle = screen.getByTestId(
        "query-title",
      ) as HTMLParagraphElement;
      const queryImage = screen.getByAltText("query-img") as HTMLImageElement;
      expect(topResult.ariaLabel).toBe("Some query result");
      expect(topTitle.textContent).toBe("Some query result");
      expect(queryImage.src).toContain("artist%20url");
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
      const topResult = screen.getByTestId("top-result") as HTMLLIElement;
      const topTitle = screen.getByTestId(
        "query-title",
      ) as HTMLParagraphElement;
      const queryImage = screen.getByAltText("query-img") as HTMLImageElement;
      expect(topResult.ariaLabel).toBe("artist");
      expect(topTitle.textContent).toBe("Unknown title");
      expect(queryImage.src).not.toContain("artist%20url");
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
      fireEvent.click(topResult);
      expect(mockedNavigate).toHaveBeenCalledWith("/artists/568648");
    });
    describe("should navigate to that route onKeyDown", () => {
      test("using Enter key", async () => {
        // const user = userEvent.setup();
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const topResult = screen.getByTestId("top-result");
        expect(topResult).toBeInTheDocument();
        // topResult.focus();
        // await user.keyboard("{Enter}");
        fireEvent.keyDown(topResult, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });
        expect(mockedNavigate).toHaveBeenCalledWith("/artists/568648");
      });
      test("using Space key", async () => {
        // const user = userEvent.setup();
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const topResult = screen.getByTestId("top-result");
        expect(topResult).toBeInTheDocument();
        // topResult.focus();
        // await user.keyboard("{ }");
        fireEvent.keyDown(topResult, {
          key: " ",
          code: "Space",
          charCode: 32,
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
      user.keyboard("{s}");
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
      const songResult = screen.getByTestId("query-song") as HTMLLIElement;
      const songTitle = screen.getByTestId(
        "query-song-title",
      ) as HTMLParagraphElement;
      const songImage = screen.getByAltText(
        "query-song-img",
      ) as HTMLImageElement;
      expect(songResult.ariaLabel).toBe("Track1");
      expect(songTitle.textContent).toBe("Track1");
      expect(songImage.src).toContain("song%20image%20url");
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
      const songResult = screen.getByTestId("query-song") as HTMLLIElement;
      const songTitle = screen.getByTestId(
        "query-song-title",
      ) as HTMLParagraphElement;
      const songImage = screen.getByAltText(
        "query-song-img",
      ) as HTMLImageElement;
      expect(songResult.ariaLabel).toBe("song");
      expect(songTitle.textContent).toBe("Unknown song");
      expect(songImage.src).not.toContain("song%20image%20url");
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
      const songImage = screen.getByAltText(
        "query-song-img",
      ) as HTMLImageElement;
      fireEvent.error(songImage);
      expect(songImage.src).toContain(songfallback);
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
      fireEvent.click(querySong);
      const track = useBoundStore.getState().nowPlaying.track;
      if (track) expect(track.id).toBeDefined();
    });
    describe("should set the track onKeyDown", () => {
      test("using Enter key", () => {
        global.fetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [sampleTrack] }),
          }),
        ) as any;
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const querySong = screen.getByTestId("query-song");
        fireEvent.keyDown(querySong, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.track).toBeDefined();
          expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
        });
      });
      test("using Space key", () => {
        global.fetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [sampleTrack] }),
          }),
        ) as any;
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/search"]}>
              <Search />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const querySong = screen.getByTestId("query-song");
        fireEvent.keyDown(querySong, {
          key: " ",
          code: "Space",
          charCode: 32,
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
      user.keyboard("{s}");
      expect(useBoundStore.getState().nowPlaying.track).toBeNull();
    });
    test("should log error if the track is not found", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const querySong = screen.getByTestId("query-song");
      fireEvent.keyDown(querySong, {
        key: " ",
        code: "Space",
        charCode: 32,
      });
      await expect(global.fetch("")).rejects.toThrow("Network error");
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
      const playlistResult = screen.getByTestId(
        "query-playlist",
      ) as HTMLLIElement;
      const playlistTitle = screen.getByTestId(
        "query-playlist-title",
      ) as HTMLParagraphElement;
      const playlistImage = screen.getByAltText(
        "query-playlist-img",
      ) as HTMLImageElement;
      expect(playlistResult).toBeInTheDocument();
      expect(playlistTitle.textContent).toContain("Some title");
      expect(playlistImage.src).toContain("some%20url");
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
      const playlistTitle = screen.getByTestId(
        "query-playlist-title",
      ) as HTMLParagraphElement;
      const playlistImage = screen.getByAltText(
        "query-playlist-img",
      ) as HTMLImageElement;
      expect(playlistTitle.textContent).toContain("Unknown playlist");
      expect(playlistImage.src).toContain(fallback);
    });
    test("should contain fallback as playlist image onError ", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const playlistImage = screen.getByAltText(
        "query-playlist-img",
      ) as HTMLImageElement;
      fireEvent.error(playlistImage);
      expect(playlistImage.src).toContain(fallback);
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
      const artistResult = screen.getByTestId("query-artist") as HTMLLIElement;
      const artistTitle = screen.getByTestId(
        "query-artist-title",
      ) as HTMLParagraphElement;
      const artistImage = screen.getByAltText(
        "query-artist-img",
      ) as HTMLImageElement;
      expect(artistResult).toBeInTheDocument();
      expect(artistTitle.textContent).toContain("Encore");
      expect(artistImage.src).toContain("some%20url");
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
      const artistTitle = screen.getByTestId(
        "query-artist-title",
      ) as HTMLParagraphElement;
      const artistImage = screen.getByAltText(
        "query-artist-img",
      ) as HTMLImageElement;
      expect(artistTitle.textContent).toContain("Unknown Artist");
      expect(artistImage.src).toContain(artistfallback);
    });
    test("should contain fallback as artist image onError ", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const artistImage = screen.getByAltText(
        "query-artist-img",
      ) as HTMLImageElement;
      fireEvent.error(artistImage);
      expect(artistImage.src).toContain(artistfallback);
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
      const image = screen.getByAltText("query-album-img");
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
      const albumResult = screen.getByTestId("query-artist") as HTMLLIElement;
      const albumTitle = screen.getByTestId(
        "query-album-title",
      ) as HTMLParagraphElement;
      const albumImage = screen.getByAltText(
        "query-album-img",
      ) as HTMLImageElement;
      expect(albumResult).toBeInTheDocument();
      expect(albumTitle.textContent).toContain("Encore");
      expect(albumImage.src).toContain("some%20url");
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
      const albumTitle = screen.getByTestId(
        "query-album-title",
      ) as HTMLParagraphElement;
      const albumImage = screen.getByAltText(
        "query-album-img",
      ) as HTMLImageElement;
      expect(albumTitle.textContent).toContain("Unknown Album");
      expect(albumImage.src).toContain(fallback);
    });
    test("should contain fallback as album image onError ", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/search"]}>
            <Search />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const albumImage = screen.getByAltText(
        "query-album-img",
      ) as HTMLImageElement;
      fireEvent.error(albumImage);
      expect(albumImage.src).toContain(fallback);
    });
  });
});
