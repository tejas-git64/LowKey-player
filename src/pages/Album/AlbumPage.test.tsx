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
import fallback from "/fallbacks/playlist-fallback.webp";
import favorite from "/svgs/icons8-heart.svg";
import favorited from "/svgs/icons8-favorited.svg";
import addAlbum from "/svgs/icons8-addplaylist-28.svg";
import addedToAlbum from "/svgs/tick.svg";
import play from "/svgs/play-icon.svg";
import pause from "/svgs/pause-icon.svg";
import AlbumPage from "./AlbumPage";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AlbumById } from "../../types/GlobalTypes";
import { sampleAlbum, sampleSongQueue } from "../../api/samples";
import { useBoundStore } from "../../store/store";
import {
  mockedAlbumSuccessData,
  mockedNullDataResult,
} from "../../mocks/mocks";
import { Suspense } from "react";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Mock),
    useQuery: vi.fn(),
  };
});
const mockedUseQuery = vi.mocked(useQuery);
let id = "1431";
const { setNowPlaying, setIsPlaying, setQueue } = useBoundStore.getState();

beforeEach(() => {
  mockedUseQuery.mockReturnValue(
    mockedAlbumSuccessData as UseQueryResult<AlbumById>,
  );
  act(() => {
    setNowPlaying(null);
    setIsPlaying(false);
  });
});

afterEach(() => {
  id = "1431";
  cleanup();
  vi.restoreAllMocks();
});

describe("AlbumPage", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId("album-page")).toBeInTheDocument();
  });
  test("should render route nav", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId("route-nav")).toBeInTheDocument();
  });
  test("should set the current track of the queue", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    act(() => {
      setQueue(sampleSongQueue);
    });
    await waitFor(() => {
      expect(useBoundStore.getState().nowPlaying.queue).toBe(sampleSongQueue);
    });
  });
});
describe("AlbumCount", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId("album-count")).toBeInTheDocument();
  });
});
describe("AlbumInfo", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId("album-info")).toBeInTheDocument();
  });
  test("getAlbumImage should return the image url", async () => {
    const getAlbumImage = vi.fn();
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const image = await screen.findByTestId("album-info-image");

    expect(sampleAlbum.image).toBeDefined();
    expect(image).toHaveAttribute("src", "image url");

    expect(await screen.findByTestId("album-page")).toHaveClass("home-fadeout");
    expect(await screen.findByTestId("album-page")).not.toHaveClass(
      "home-fadein",
    );
    fireEvent.load(image);
    await waitFor(() => {
      const albumPage = screen.getByTestId("album-page");
      expect(albumPage).not.toHaveClass("home-fadeout");
      expect(albumPage).toHaveClass("home-fadein");
    });

    mockedUseQuery.mockReturnValue(
      mockedNullDataResult as UseQueryResult<null>,
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(getAlbumImage).not.toReturn();
      expect(screen.getByAltText("Unknown Album")).not.toHaveAttribute("src");
    });
  });
  test("should have it's image as fallback onError", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const image = await screen.findByTestId("album-info-image");
    fireEvent.error(image);
    expect((image as HTMLImageElement).src).toContain(fallback);
  });
});
describe("AlbumControls", () => {
  test("should render", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId("album-controls")).toBeInTheDocument();
  });
  test("isAlbumPlaying should be true/false based on if queue id matches and isPlaying", async () => {
    const isAlbumPlaying = vi.fn();
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    act(() => {
      setQueue(sampleAlbum);
      setIsPlaying(true);
    });
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    expect(useBoundStore.getState().nowPlaying.queue).toBeDefined();
    expect(mockedAlbumSuccessData.data).toBeDefined();
    expect(isAlbumPlaying).toBeTruthy();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
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
      expect(isAlbumPlaying).toBeFalsy();
    });
    setIsPlaying(false);
  });
  test("toggling isShuffling onClick should toggle aria label", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const shuffleButton = screen.getByTitle("shuffle-button");
    expect(shuffleButton).toHaveAttribute("aria-label", "Enable shuffle");
    act(() => {
      fireEvent.click(shuffleButton);
    });

    expect(screen.getByTitle("shuffle-button")).toHaveAttribute(
      "aria-label",
      "Disable shuffle",
    );
  });
  test("toggling add button should toggle aria-label and icon", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const addBtn = await screen.findByTestId("add-btn");
    const addIcon = await screen.findByTestId("add-icon");

    expect(addBtn.ariaLabel).toBe("Add to Library");
    expect((addIcon as HTMLImageElement).src).toBe(addAlbum);
    expect((addIcon as HTMLImageElement).alt).toBe("Add to library");
    act(() => {
      fireEvent.click(addBtn);
    });

    expect(addBtn.ariaLabel).toBe("Remove from Library");
    expect((addIcon as HTMLImageElement).src).toBe(addedToAlbum);
    expect((addIcon as HTMLImageElement).alt).toBe("Added to library");
    act(() => {
      fireEvent.click(addBtn);
    });

    expect(addBtn.ariaLabel).toBe("Add to Library");
    expect((addIcon as HTMLImageElement).src).toBe(addAlbum);
    expect((addIcon as HTMLImageElement).alt).toBe("Add to library");
  });
  test("toggling favorite button should toggle aria-label and icon", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const favoriteBtn = await screen.findByTestId("album-favorite-btn");
    const favoriteIcon = await screen.findByTestId("favorite-icon");

    expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
    expect((favoriteIcon as HTMLImageElement).src).toBe(favorite);
    expect((favoriteIcon as HTMLImageElement).alt).toBe("Favorite");
    act(() => {
      fireEvent.click(favoriteBtn);
    });

    expect(favoriteBtn.ariaLabel).toBe("Remove from Favorites");
    expect((favoriteIcon as HTMLImageElement).src).toBe(favorited);
    expect((favoriteIcon as HTMLImageElement).alt).toBe("Favorited");
    act(() => {
      fireEvent.click(favoriteBtn);
    });

    expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
    expect((favoriteIcon as HTMLImageElement).src).toBe(favorite);
    expect((favoriteIcon as HTMLImageElement).alt).toBe("Favorite");
  });
  test("playback button should play/pause the album on click", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/albums/${id}`]}>
          <Suspense>
            <AlbumPage />
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const playbackBtn = await screen.findByTestId("album-playback");
    const playbackIcon = await screen.findByTestId("album-playback-icon");

    expect(playbackBtn.tabIndex).toBe(0);
    expect(playbackBtn.ariaLabel).toBe("Play album");
    expect((playbackIcon as HTMLImageElement).src).toBe(play);
    expect((playbackIcon as HTMLImageElement).alt).toBe("Play");

    act(() => {
      fireEvent.click(playbackBtn);
    });

    await waitFor(() => {
      expect(playbackBtn.ariaLabel).toBe("Pause album");
      expect((playbackIcon as HTMLImageElement).src).toBe(pause);
      expect((playbackIcon as HTMLImageElement).alt).toBe("Pause");
    });
  });
});
