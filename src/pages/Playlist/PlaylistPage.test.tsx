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
const fallback = "/fallbacks/playlist-fallback.webp";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import addAlbum from "../../assets/svgs/icons8-addplaylist-28.svg";
import addedToAlbum from "../../assets/svgs/tick.svg";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { PlaylistById } from "../../types/GlobalTypes";
import { samplePlaylist } from "../../api/samples";
import { useBoundStore } from "../../store/store";
import PlaylistPage from "./PlaylistPage";
import {
  mockedPlaylistSuccessData,
  mockedNullDataResult,
} from "../../mocks/mocks";
import { Suspense } from "react";
import ListLoading from "./Loading";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Mock),
    useQuery: vi.fn(),
  };
});
const mockedUseQuery = vi.mocked(useQuery);
let id = "12234";
const { setQueue, setIsPlaying } = useBoundStore.getState();

beforeEach(() => {
  act(() => {
    setIsPlaying(false);
  });
  mockedUseQuery.mockReturnValue(
    mockedPlaylistSuccessData as UseQueryResult<PlaylistById>,
  );
});

afterEach(() => {
  id = "12234";
  cleanup();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe("PlaylistPage", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const playlistPage = await screen.findByTestId("playlist-page");
    expect(playlistPage).toBeInTheDocument();
  });
  test("should render route nav", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("route-nav")).toBeInTheDocument();
  });
});
describe("PlaylistCount", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("playlist-count")).toBeInTheDocument();
  });
});
describe("PlaylistInfo", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("playlist-info")).toBeInTheDocument();
  });
  test("getAlbumImage should return the image url", async () => {
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const getAlbumImage = vi.fn();
    const image = screen.getByTestId("playlist-info-image");
    await waitFor(() => {
      expect(samplePlaylist.image).toBeDefined();
      expect(image).toHaveAttribute("src", "image url");
    });

    expect(screen.getByTestId("playlist-page")).toHaveClass("home-fadeout");
    expect(screen.getByTestId("playlist-page")).not.toHaveClass("home-fadein");
    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.getByTestId("playlist-page")).not.toHaveClass(
        "home-fadeout",
      );
      expect(screen.getByTestId("playlist-page")).toHaveClass("home-fadein");
    });

    mockedUseQuery.mockReturnValue(
      mockedNullDataResult as UseQueryResult<null>,
    );
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(getAlbumImage).not.toReturn();
      expect(screen.getByAltText("img")).toHaveAttribute("src", fallback);
    });
  });
  test("should have it's image as fallback onError", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const image = screen.getByTestId("playlist-info-image");
    fireEvent.error(image);
    expect((image as HTMLImageElement).src).toContain(fallback);
  });
});
describe("PlaylistControls", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("playlist-controls")).toBeInTheDocument();
    });
  });
  test("isPlaylistPlaying should be true/false based on if queue id matches and isPlaying", async () => {
    function isPlaylistPlaying() {
      const nowPlaying = useBoundStore.getState().nowPlaying;
      return nowPlaying.isPlaying && nowPlaying.queue?.id === id;
    }
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    act(() => { 
      setQueue({ ...samplePlaylist, id });
      setIsPlaying(true);
    });
    await waitFor(() => {
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
      expect(useBoundStore.getState().nowPlaying.queue?.id).toBe(id);
      expect(isPlaylistPlaying()).toBe(true);
    });

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    mockedUseQuery.mockReturnValue(
      mockedNullDataResult as UseQueryResult<null>, 
    );

    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    expect(useBoundStore.getState().nowPlaying.queue).toBeDefined();
    expect(mockedNullDataResult.data).toBeNull();
    waitFor(() => {
      expect(isPlaylistPlaying).toBeFalsy();
    });
  });
  test("toggling isShuffling onClick should toggle aria label", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const shuffleButton = screen.getByTitle("shuffle-button");
    expect(shuffleButton).toHaveAttribute("aria-label", "Enable shuffle");

    fireEvent.click(shuffleButton);

    expect(screen.getByTitle("shuffle-button")).toHaveAttribute(
      "aria-label",
      "Disable shuffle",
    );
  });
  test("toggling add button should toggle aria-label and icon", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const addBtn = screen.getByTestId("add-btn");
    const addIcon = screen.getByTestId("add-icon");

    expect(addBtn.ariaLabel).toBe("Add to Library");
    expect((addIcon as HTMLImageElement).src).toBe(addAlbum);
    expect((addIcon as HTMLImageElement).alt).toBe("Add to library");

    fireEvent.click(addBtn);

    expect(addBtn.ariaLabel).toBe("Remove from Library");
    expect((addIcon as HTMLImageElement).src).toBe(addedToAlbum);
    expect((addIcon as HTMLImageElement).alt).toBe("Added to library");

    fireEvent.click(addBtn);

    expect(addBtn.ariaLabel).toBe("Add to Library");
    expect((addIcon as HTMLImageElement).src).toBe(addAlbum);
    expect((addIcon as HTMLImageElement).alt).toBe("Add to library");
  });
  test("toggling favorite button should toggle aria-label and icon", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const favoriteBtn = screen.getByTestId("playlist-favorite-btn");
    const favoriteIcon = screen.getByTestId("favorite-icon");

    expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
    expect((favoriteIcon as HTMLImageElement).src).toBe(favorite);
    expect((favoriteIcon as HTMLImageElement).alt).toBe("Favorite");

    fireEvent.click(favoriteBtn);

    expect(favoriteBtn.ariaLabel).toBe("Remove from Favorites");
    expect((favoriteIcon as HTMLImageElement).src).toBe(favorited);
    expect((favoriteIcon as HTMLImageElement).alt).toBe("Favorited");

    fireEvent.click(favoriteBtn);

    expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
    expect((favoriteIcon as HTMLImageElement).src).toBe(favorite);
    expect((favoriteIcon as HTMLImageElement).alt).toBe("Favorite");
  });
  test("playback button should play/pause the album on click", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <Suspense fallback={<ListLoading />}>
            <PlaylistPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const playbackBtn = await screen.findByTestId("playlist-playback");
    const playbackIcon = await screen.findByTestId("playlist-playback-icon");

    expect(playbackBtn.ariaLabel).toBe("Play playlist");
    expect((playbackIcon as HTMLImageElement).src).toBe(play);
    expect((playbackIcon as HTMLImageElement).alt).toBe("Play");

    act(() => {
      fireEvent.click(playbackBtn);
    });

    await waitFor(() => {
      expect(playbackBtn.ariaLabel).toBe("Pause playlist");
      expect((playbackIcon as HTMLImageElement).src).toBe(pause);
      expect((playbackIcon as HTMLImageElement).alt).toBe("Pause");
    });
  });
});
