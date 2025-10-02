import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
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
import { samplePlaylist, sampleTrack } from "../../api/samples";
import { useBoundStore } from "../../store/store";
import PlaylistPage from "./PlaylistPage";
import {
  mockedPlaylistSuccessData,
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
let id = "12234";
const { setQueue, setIsPlaying } = useBoundStore.getState();

beforeEach(() => {
  vi.useFakeTimers();
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
  vi.useRealTimers();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe("PlaylistPage", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    expect(screen.getByTestId("playlist-page")).toBeInTheDocument();
  });
  test("should render route nav", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    expect(screen.getByTestId("route-nav")).toBeInTheDocument();
  });
  test("should set the current track of the queue", () => {
    act(() => {
      setQueue(samplePlaylist);
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const queue = useBoundStore.getState().nowPlaying.queue;

    expect(queue).toBeDefined();
    expect(queue?.songs).toBeDefined();

    expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
  });
});
describe("PlaylistCount", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    expect(screen.getByTestId("playlist-count")).toBeInTheDocument();
  });
});
describe("PlaylistInfo", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    expect(screen.getByTestId("playlist-info")).toBeInTheDocument();
  });
  test("getAlbumImage should return the image url", () => {
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const getAlbumImage = vi.fn();
    const image = screen.getByTestId("playlist-info-image");
    waitFor(() => {
      expect(samplePlaylist.image).toBeDefined();
      expect(image).toHaveAttribute("src", "image url");
    });

    expect(screen.getByTestId("playlist-page")).toHaveClass("home-fadeout");
    expect(screen.getByTestId("playlist-page")).not.toHaveClass("home-fadein");
    fireEvent.load(image);

    waitFor(() => {
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
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    waitFor(() => {
      expect(getAlbumImage).not.toReturn();
      expect(screen.getByAltText("img")).toHaveAttribute("src", fallback);
    });
  });
  test("should have it's image as fallback onError", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const image = screen.getByTestId("playlist-info-image") as HTMLImageElement;
    fireEvent.error(image);
    expect(image.src).toContain(fallback);
  });
});
describe("PlaylistControls", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    expect(screen.getByTestId("playlist-controls")).toBeInTheDocument();
  });
  test("isPlaylistPlaying should be true/false based on if queue id matches and isPlaying", () => {
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const isPlaylistPlaying = vi.fn();
    act(() => {
      setQueue(samplePlaylist);
      setIsPlaying(true);
    });
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    expect(useBoundStore.getState().nowPlaying.queue).toBeDefined();
    expect(mockedPlaylistSuccessData.data).toBeDefined();
    expect(isPlaylistPlaying).toBeTruthy();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    mockedUseQuery.mockReturnValue(
      mockedNullDataResult as UseQueryResult<null>,
    );

    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    expect(useBoundStore.getState().nowPlaying.queue).toBeDefined();
    expect(mockedNullDataResult.data).toBeNull();
    waitFor(() => {
      expect(isPlaylistPlaying).toBeFalsy();
    });
    setIsPlaying(false);
  });
  test("toggling isShuffling onClick should toggle aria label", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const shuffleButton = screen.getByTitle("shuffle-button");
    expect(shuffleButton).toHaveAttribute("aria-label", "Enable shuffle");

    fireEvent.click(shuffleButton);

    expect(screen.getByTitle("shuffle-button")).toHaveAttribute(
      "aria-label",
      "Disable shuffle",
    );
  });
  test("toggling add button should toggle aria-label and icon", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const addBtn = screen.getByTestId("add-btn");
    const addIcon = screen.getByTestId("add-icon") as HTMLImageElement;

    expect(addBtn.ariaLabel).toBe("Add to Library");
    expect(addIcon.src).toBe(addAlbum);
    expect(addIcon.alt).toBe("Add to library");

    fireEvent.click(addBtn);

    expect(addBtn.ariaLabel).toBe("Remove from Library");
    expect(addIcon.src).toBe(addedToAlbum);
    expect(addIcon.alt).toBe("Added to library");

    fireEvent.click(addBtn);

    expect(addBtn.ariaLabel).toBe("Add to Library");
    expect(addIcon.src).toBe(addAlbum);
    expect(addIcon.alt).toBe("Add to library");
  });
  test("toggling favorite button should toggle aria-label and icon", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const favoriteBtn = screen.getByTestId("playlist-favorite-btn");
    const favoriteIcon = screen.getByTestId(
      "favorite-icon",
    ) as HTMLImageElement;

    expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
    expect(favoriteIcon.src).toBe(favorite);
    expect(favoriteIcon.alt).toBe("Favorite");

    fireEvent.click(favoriteBtn);

    expect(favoriteBtn.ariaLabel).toBe("Remove from Favorites");
    expect(favoriteIcon.src).toBe(favorited);
    expect(favoriteIcon.alt).toBe("Favorited");

    fireEvent.click(favoriteBtn);

    expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
    expect(favoriteIcon.src).toBe(favorite);
    expect(favoriteIcon.alt).toBe("Favorite");
  });
  test("playback button should play/pause the album on click", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/playlists/${id}`]}>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const playbackBtn = screen.getByTestId("playlist-playback");
    const playbackIcon = screen.getByTestId(
      "playlist-playback-icon",
    ) as HTMLImageElement;

    expect(playbackBtn.tabIndex).toBe(0);
    expect(playbackBtn.ariaLabel).toBe("Play playlist");
    expect(playbackIcon.src).toBe(play);
    expect(playbackIcon.alt).toBe("Play");

    act(() => {
      fireEvent.click(playbackBtn);
    });

    waitFor(() => {
      expect(playbackBtn.tabIndex).toBe(-1);
      expect(playbackBtn.ariaLabel).toBe("Pause playlist");
      expect(playbackIcon.src).toBe(pause);
      expect(playbackIcon.alt).toBe("Pause");
    });
  });
});
