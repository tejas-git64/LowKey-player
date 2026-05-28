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
const artistfallback = "/fallbacks/artist-fallback.png";
import Library from "./Library";
import { useBoundStore } from "../../store/store";
import {
  sampleAlbum,
  sampleArtistInSong,
  samplePlaylist,
  samplePlaylistOfList,
  sampleTrack,
  sampleUserPlaylist,
} from "../../api/samples";
import ArtistPage from "../Artist/ArtistPage";
import UserPlaylistPage from "../UserPlaylist/UserPlaylist";
import { PlaylistOfList } from "../../types/GlobalTypes";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return { ...actual, useQuery: vi.fn() };
});
const mockedUseQuery = vi.mocked(useQuery);

const {
  setUserPlaylist,
  setLibraryAlbum,
  setLibraryPlaylist,
  setFollowing,
  removeUserPlaylist,
  removeLibraryAlbum,
  removeLibraryPlaylist,
  removeFollowing,
} = useBoundStore.getState();

beforeEach(() => {
  act(() => {
    setUserPlaylist(sampleUserPlaylist);
    setLibraryAlbum(sampleAlbum);
    setLibraryPlaylist(samplePlaylist);
    setFollowing(sampleArtistInSong);
  });
});

afterEach(() => {
  act(() => {
    removeUserPlaylist(sampleUserPlaylist.id);
    removeLibraryAlbum(sampleAlbum.id);
    removeLibraryPlaylist(samplePlaylist.id);
    removeFollowing(sampleArtistInSong.id);
  });
  cleanup();
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

describe("Library", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("library-page")).toBeInTheDocument();
    });
  });
  test("should create new playlist onClick", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const playlistBtn = screen.getByTestId("playlist-btn");
    act(() => {
      fireEvent.click(playlistBtn);
    });
    expect(useBoundStore.getState().revealCreation).toBe(true);
  });
  test("should render the library container", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("library-container");
    expect(container).toBeInTheDocument();
  });
  test("should render the custom playlists", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("customplaylist-container");
    expect(container).toBeInTheDocument();
  });
  test("should render playlists", async () => {
    mockedUseQuery.mockReturnValue([
      samplePlaylistOfList,
    ] as unknown as UseQueryResult<PlaylistOfList[]>);
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("playlists-container");
    expect(container).toBeInTheDocument();
  });
  test("should render albums", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("albums-container");
    expect(container).toBeInTheDocument();
  });
  test("should render followings", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("followings-container");
    expect(container).toBeInTheDocument();
  });
  test("should render empty message if none of them are present", async () => {
    act(() => {
      removeUserPlaylist(sampleUserPlaylist.id);
      removeLibraryAlbum(sampleAlbum.id);
      removeLibraryPlaylist(samplePlaylist.id);
      removeFollowing(sampleArtistInSong.id);
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/library"]}>
          <Library />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      const container = screen.getByTestId("empty-message");
      expect(container).toBeInTheDocument();
    });
  });
  describe("Following", () => {
    test("should render", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const following = screen.getByTestId("following");
      expect(following).toBeInTheDocument();
    });
    test("should have image and name on having following data", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const followingImage = screen.getByAltText("sample song");
      expect((followingImage as HTMLImageElement).src).toContain("image%20url");
      expect(screen.getByText("sample song")).toBeInTheDocument();
    });
    test("should have artistfallback and name as 'Unknown Artist' on not having following data", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      act(() => {
        removeFollowing(sampleArtistInSong.id);
        setFollowing({ ...sampleArtistInSong, name: "", image: [] });
      });

      const followingImage = screen.getByAltText("Unknown Artist");
      expect((followingImage as HTMLImageElement).src).toContain(
        artistfallback,
      );
      expect(screen.getByText("Unknown Artist")).toBeInTheDocument();
    });
    test("should navigate to the artist onClick", async () => {
      vi.useFakeTimers();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
            <ArtistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const following = screen.getByTestId("following");
      act(() => {
        fireEvent.click(following);
      });
      vi.advanceTimersByTime(150);

      const artistPage = screen.getByTestId("artist-page");
      expect(artistPage).toBeInTheDocument();

      vi.useRealTimers();
    });
  });
  describe("CustomPlaylist", () => {
    test("should render", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        const playlist = screen.getByTestId("userplaylist");
        expect(playlist).toBeInTheDocument();
      });
    });
    test("should playback track of the playlist onClick", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playlistBtn = screen.getAllByTestId("hover-playlist-btn")[0];
      act(() => {
        fireEvent.click(playlistBtn);
      });
      expect(useBoundStore.getState().nowPlaying.track).toBe(sampleTrack);
    });
    test("should remove custom playlist onClick", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const removeBtn = screen.getByTestId("menu-close-btn");
      act(() => {
        fireEvent.click(removeBtn);
      });
      expect(useBoundStore.getState().library.userPlaylists).not.toContainEqual(
        sampleUserPlaylist,
      );
    });
  });
  describe("LibraryAlbums", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const album = screen.getByTestId("album-container");
      expect(album).toBeInTheDocument();
    });
    test("should navigate to album-page onClick", () => {
      vi.useFakeTimers();
      const fadeOutNavigate = vi.fn();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const container = screen.getByTestId("album-container");
      fireEvent.click(container);

      vi.advanceTimersByTime(150);
      waitFor(() => {
        expect(fadeOutNavigate).toHaveBeenCalledWith(
          `/albums/${sampleAlbum.id}`,
        );
      });
      vi.useRealTimers();
    });
    test("should play the album onClick", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getByTestId("album-play-btn");
      act(() => {
        fireEvent.click(playBtn);
      });

      expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
    });
    test("should remove album onClick", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const removeBtn = screen.getByTestId("album-remove-btn");
      act(() => {
        fireEvent.click(removeBtn);
      });
      expect(useBoundStore.getState().library.userPlaylists).not.toContainEqual(
        sampleAlbum,
      );
    });
  });
  describe("LibraryPlaylists", () => {
    test("should render", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playlist = screen.getByTestId("playlist-container");
      expect(playlist).toBeInTheDocument();
    });
    test("should navigate to playlist-page onClick", () => {
      vi.useFakeTimers();
      const fadeOutNavigate = vi.fn();
      mockedUseQuery.mockReturnValue([
        samplePlaylistOfList,
      ] as unknown as UseQueryResult<PlaylistOfList[]>);
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const container = screen.getByTestId("playlist-container");
      fireEvent.click(container);
      vi.advanceTimersByTime(150);
      waitFor(() => {
        expect(fadeOutNavigate).toHaveBeenCalledWith(
          `/playlists/${sampleAlbum.id}`,
        );
      });
      vi.useRealTimers();
    });
    test("should play the playlist onClick", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const playBtn = screen.getAllByTestId("hover-playlist-btn")[0];
      act(() => {
        fireEvent.click(playBtn);
      });

      expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
    });
    test("should remove playlist onClick", async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/library"]}>
            <Library />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const removeBtn = screen.getByTestId("playlist-remove-btn");
      act(() => {
        fireEvent.click(removeBtn);
      });
      expect(useBoundStore.getState().library.playlists).not.toContainEqual(
        samplePlaylist,
      );
    });
  });
});
