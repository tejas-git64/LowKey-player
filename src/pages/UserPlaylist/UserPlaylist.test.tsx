import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, useParams } from "react-router-dom";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockInstance,
  test,
  vi,
} from "vitest";
import UserPlaylistPage from "./UserPlaylist";
import { useBoundStore } from "../../store/store";
import { sampleTrack, sampleUserPlaylist } from "../../api/samples";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});
const setUserPlaylistMock = vi.fn();
const mockedUseParams = vi.mocked(useParams);
let getItemSpy: MockInstance<(key: string) => string | null>;
const {
  setUserPlaylist,
  removeUserPlaylist,
  setQueue,
  setIsShuffling,
  setIsPlaying,
} = useBoundStore.getState();

beforeEach(() => {
  getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  mockedUseParams.mockReturnValue({ id: "39" });
  act(() => {
    setUserPlaylist(sampleUserPlaylist);
    setQueue({ ...sampleUserPlaylist, id: "39" });
    setIsShuffling(false);
    setIsPlaying(false);
  });
});

afterEach(() => {
  act(() => {
    removeUserPlaylist(sampleUserPlaylist.id);
  });
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("UserPlaylist", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("userplaylist-page")).toBeInTheDocument();
  });
  test("should set the first track in the playlist", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
  });
  test("should not set the playlist from localStorage", () => {
    const sampleUserPlaylist = { id: 39, name: "My Test Playlist", songs: [] };
    const mockLibrary = {
      userPlaylists: [sampleUserPlaylist],
    };
    getItemSpy.mockReturnValue(JSON.stringify(mockLibrary));
    mockedUseParams.mockReturnValue({ id: "39" });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(setUserPlaylistMock).not.toHaveBeenCalledWith(sampleUserPlaylist);
  });

  test("should not call setUserPlaylist if localStorage data is invalid", () => {
    getItemSpy.mockReturnValue("this is not valid json");
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(setUserPlaylistMock).not.toHaveBeenCalled();
  });
  test("should not call setUserPlaylist if no matching playlist is found", () => {
    const mockLibrary = {
      userPlaylists: [{ id: 39, name: "My Test Playlist" }],
    };
    getItemSpy.mockReturnValue(JSON.stringify(mockLibrary));

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(setUserPlaylistMock).not.toHaveBeenCalled();
  });
  test("should not call setUserPlaylist if localStorage is empty", () => {
    getItemSpy.mockReturnValue(null);
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(setUserPlaylistMock).not.toHaveBeenCalled();
  });
  test("should render the playlist-container", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("playlist-container");
    expect(container).toBeInTheDocument();
  });
  test("should render the playlist-container", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/userplaylists/39"]}>
          <UserPlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const container = screen.getByTestId("playlist-container");
    expect(container).toBeInTheDocument();
  });
  describe("UserPlaylistControls", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/userplaylists/39"]}>
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const controls = screen.getByTestId("userplaylist-controls");
      expect(controls).toBeInTheDocument();
    });
    test("shuffle aria label should be 'Enable shuffle' if not shuffling", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/userplaylists/39"]}>
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const shuffleBtn = screen.getByTitle("Shuffle playlist");
      expect(shuffleBtn.ariaLabel).toBe("Enable shuffle");
    });
    test("shuffle aria label should be 'Disable shuffle' if shuffling", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/userplaylists/39"]}>
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const shuffleBtn = screen.getByTitle("Shuffle playlist");
      act(() => {
        fireEvent.click(shuffleBtn);
      });
      expect(shuffleBtn.ariaLabel).toBe("Disable shuffle");
    });
    test("shuffle icon color should be emerald if shuffling", () => {
      act(() => {
        setIsShuffling(true);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/userplaylists/39"]}>
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const shuffleIcon = screen.getByTestId("shuffle-icon");

      expect(shuffleIcon).toHaveClass("fill-emerald-500");
    });
    test("shuffle icon color should be white if not shuffling", () => {
      act(() => {
        setIsShuffling(false);
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/userplaylists/39"]}>
            <UserPlaylistPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const shuffleIcon = screen.getByTestId("shuffle-icon");
      expect(shuffleIcon).toHaveClass("fill-white");
    });
    describe("Play button", () => {
      test("should have title and aria label as 'Pause playlist' if isPlaying", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/userplaylists/39"]}>
              <UserPlaylistPage />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const playBtn = screen.getByTestId("play-btn");
        act(() => {
          fireEvent.click(playBtn);
        });
        expect(playBtn.title).toBe("Pause playlist");
        expect(playBtn.ariaLabel).toBe("Pause playlist");
      });
      test("should have title and aria label as 'Play playlist' if isPlaying", () => {
        act(() => {
          setIsPlaying(false);
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/userplaylists/39"]}>
              <UserPlaylistPage />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const playBtn = screen.getByTestId("play-btn");
        expect(playBtn.title).toBe("Play playlist");
        expect(playBtn.ariaLabel).toBe("Play playlist");
      });
      test("should have title and aria label as 'No songs to play' if isPlaying", () => {
        act(() => {
          removeUserPlaylist(39);
          setUserPlaylist({ ...sampleUserPlaylist, songs: [] });
        });
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/userplaylists/39"]}>
              <UserPlaylistPage />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const playBtn = screen.getByTestId("play-btn");
        expect(playBtn.title).toBe("No songs to play");
        expect(playBtn.ariaLabel).toBe("No songs to play");
      });
      test("should play the song onKeyDown if enter key is pressed", () => {
        const user = userEvent.setup();
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/userplaylists/39"]}>
              <UserPlaylistPage />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const playBtn = screen.getByTestId("play-btn");
        playBtn.focus();
        user.keyboard("{Enter}");
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.track).toEqual(
            sampleTrack,
          );
          expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
        });
      });
      test("should play the song onKeyDown if space key is pressed", () => {
        const user = userEvent.setup();
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={["/userplaylists/39"]}>
              <UserPlaylistPage />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const playBtn = screen.getByTestId("play-btn");
        playBtn.focus();
        user.keyboard("{ }");
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.track).toEqual(
            sampleTrack,
          );
          expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
        });
      });
    });
  });
});
