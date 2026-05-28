import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import Favorites from "./Favorites";
import { useBoundStore } from "../../store/store";
const fallback = "/fallbacks/playlist-fallback.webp";
import {
  sampleAlbum,
  samplePlaylist,
  sampleSongQueue,
  sampleTrack,
} from "../../api/samples";

const {
  setIsPlaying,
  setIsShuffling,
  setFavoriteAlbum,
  setFavoritePlaylist,
  setFavoriteSong,
  setNowPlaying,
} = useBoundStore.getState();

afterEach(() => {
  act(() => {
    useBoundStore.getState().removeFavoriteAlbum(sampleAlbum.id);
    useBoundStore.getState().removeFavoritePlaylist(samplePlaylist.id);
    useBoundStore.getState().removeFavorite(sampleTrack.id);
    setIsPlaying(false);
    setIsShuffling(false);
  });
  cleanup();
});

describe("Favorites", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/favorites"]}>
          <Favorites />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("favorites-page")).toBeInTheDocument();
    });
  });
  test("should have no favorites initially", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/favorites"]}>
          <Favorites />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("no-favorites")).toBeInTheDocument();
  });
  describe("should render child components", () => {
    beforeEach(() => {
      act(() => {
        setFavoriteAlbum(sampleAlbum);
        setFavoritePlaylist(samplePlaylist);
        setFavoriteSong(sampleTrack);
      });
    });

    test("should render favorite albums", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        const favorites = screen.getByTestId("favorite-albums");
        expect(favorites).toBeInTheDocument();
      });
    });
    test("should render favorite playlists", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        const favorites = screen.getByTestId("favorite-playlists");
        expect(favorites).toBeInTheDocument();
      });
    });
    test("should render favorite songs", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        const favorites = screen.getByTestId("favorite-songs");
        expect(favorites).toBeInTheDocument();
      });
    });
  });
  describe("FavoriteControls", () => {
    test("should contain isFavoritePlaying and be true if playing and the track is present", async () => {
      const isFavoritePlaying = vi.fn();
      act(() => {
        setFavoriteSong(sampleTrack);
        setIsPlaying(true);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(isFavoritePlaying).toBeTruthy();
    });
    test("shuffle button should toggle its aria label", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const shuffleBtn = screen.getByTitle("Shuffle button");
      expect(shuffleBtn.ariaLabel).toBe("Enable shuffle");
      act(() => {
        fireEvent.click(shuffleBtn);
      });

      expect(shuffleBtn.ariaLabel).toBe("Disable shuffle");
    });
    describe("shuffle icon color", async () => {
      test("be emerald when isShuffling is true", async () => {
        act(() => {
          setFavoriteSong(sampleTrack);
          setNowPlaying(sampleTrack);
          setIsPlaying(true);
          setIsShuffling(true);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const shuffleIcon = screen.getByTestId("svg-color");

        expect(shuffleIcon).toHaveClass("fill-emerald-500");
      });
      test("isShuffling should not be the icon color", async () => {
        act(() => {
          setFavoriteSong(sampleTrack);
          setNowPlaying(sampleTrack);
          setIsPlaying(true);
          setIsShuffling(false);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        act(() => {
          setFavoriteSong(sampleTrack);
          setIsPlaying(true);
        });
        const shuffleIcon = screen.getByTestId("svg-color");

        expect(shuffleIcon).toHaveClass("fill-white");
      });
    });
    test("Play button should play the favorited songs", async () => {
      act(() => {
        setFavoriteSong(sampleTrack);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getByTitle("Play button");
      act(() => {
        fireEvent.click(playBtn);
      });
      expect(useBoundStore.getState().nowPlaying.track).toBe(sampleTrack);
    });
  });
  describe("FavoriteAlbum", () => {
    test("should render", () => {
      act(() => {
        setFavoriteAlbum(sampleAlbum);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const favoriteAlbum = screen.getByTestId("favorite-album");
      expect(favoriteAlbum).toBeInTheDocument();
    });
    test("should navigate to album page onClick", () => {
      act(() => {
        setFavoriteAlbum(sampleAlbum);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const favoriteAlbum = screen.getByTestId("favorite-album");
      act(() => {
        fireEvent.click(favoriteAlbum);
      });

      waitFor(() => {
        expect(screen.getByTestId("album-page")).toBeInTheDocument();
      });
    });
    describe("should have its image", () => {
      test("be of the album if present", async () => {
        act(() => {
          setFavoriteAlbum(sampleAlbum);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("album-image");
        expect((image as HTMLImageElement).src).toContain("image%20url");
      });
      test("be fallback if not present", async () => {
        act(() => {
          useBoundStore
            .getState()
            .setFavoriteAlbum({ ...sampleAlbum, image: [] });
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("album-image");
        expect((image as HTMLImageElement).src).toContain(fallback);
      });
      test("be fallback onError", async () => {
        act(() => {
          setFavoriteAlbum(sampleAlbum);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("album-image");
        fireEvent.error(image);
        expect((image as HTMLImageElement).src).toContain(fallback);
      });
    });
    test("should have its play button as Pause album id if the queue id matches and isPlaying", async () => {
      act(() => {
        setFavoriteAlbum(sampleAlbum);
        useBoundStore
          .getState()
          .setQueue({ ...sampleSongQueue, id: "58397429" });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getByTestId("album-play-btn");
      act(() => {
        fireEvent.click(playBtn);
      });
      expect(playBtn.ariaLabel).toBe("Pause album");
    });
    test("should remove album onClick", async () => {
      act(() => {
        setFavoriteAlbum(sampleAlbum);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getByTestId("album-remove-btn");
      act(() => {
        fireEvent.click(playBtn);
      });
      expect(useBoundStore.getState().favorites.albums).not.toContainEqual(
        sampleAlbum,
      );
    });
  });
  describe("FavoritePlaylist", () => {
    test("should render", () => {
      act(() => {
        setFavoritePlaylist(samplePlaylist);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const favoritePlaylist = screen.getByTestId("favorite-playlist");
      expect(favoritePlaylist).toBeInTheDocument();
    });
    test("should navigate to playlist page onClick", () => {
      act(() => {
        setFavoritePlaylist(samplePlaylist);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const favoritePlaylist = screen.getByTestId("favorite-playlist");
      act(() => {
        fireEvent.click(favoritePlaylist);
      });

      waitFor(() => {
        expect(screen.getByTestId("playlist-page")).toBeInTheDocument();
      });
    });
    describe("should have its image", () => {
      test("be of the playlist if present", async () => {
        act(() => {
          setFavoritePlaylist(samplePlaylist);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("playlist-image");
        await waitFor(() => {
          expect((image as HTMLImageElement).src).toContain("image%20url");
        });
      });
      test("be fallback if not present", async () => {
        act(() => {
          useBoundStore
            .getState()
            .setFavoritePlaylist({ ...samplePlaylist, image: [] });
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("playlist-image");
        expect((image as HTMLImageElement).src).toContain(fallback);
      });
      test("be fallback onError", async () => {
        act(() => {
          setFavoritePlaylist(samplePlaylist);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/favorites"]}>
              <Favorites />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("playlist-image");
        fireEvent.error(image);
        expect((image as HTMLImageElement).src).toContain(fallback);
      });
    });
    test("should have its play button as Pause album id if the queue id matches and isPlaying", async () => {
      act(() => {
        setFavoritePlaylist(samplePlaylist);
        useBoundStore
          .getState()
          .setQueue({ ...sampleSongQueue, id: "ae5fa1Ax" });
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getByTestId("playlist-play-btn");
      act(() => {
        fireEvent.click(playBtn);
      });
      expect(playBtn.ariaLabel).toBe("Pause playlist");
    });
    test("should remove album onClick", async () => {
      act(() => {
        setFavoritePlaylist(samplePlaylist);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/favorites"]}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getByTestId("playlist-remove-btn");
      act(() => {
        fireEvent.click(playBtn);
      });
      expect(useBoundStore.getState().favorites.playlists).not.toContainEqual(
        samplePlaylist,
      );
    });
  });
});
