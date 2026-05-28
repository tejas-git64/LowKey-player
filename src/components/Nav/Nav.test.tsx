import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import Nav from "./Nav";
const playlistfallback = "/fallbacks/playlist-fallback-min.webp";
const fallback = "/fallbacks/playlist-fallback.webp";
const online = "/icons/icons8-online-28.png";
const offline = "/icons/icons8-offline-28.png";
import { MemoryRouter } from "react-router-dom";
import { useBoundStore } from "../../store/store";
import { sampleAlbum, samplePlaylist, sampleTrack } from "../../api/samples";

afterEach(() => {
  cleanup();
});

const { setLibraryAlbum, setLibraryPlaylist, setUserPlaylist } =
  useBoundStore.getState();

describe("Nav", () => {
  test("should render", async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("should render RecentPlaylistsOrAlbums", async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test("should bring up the playlist creation modal on clicking new playlist", async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );
    const createDiv = screen.getByRole("button");
    expect(createDiv).toBeInTheDocument();
    act(() => {
      createDiv.click();
    });
    expect(useBoundStore.getState().revealCreation).toBe(true);
  });

  describe("should apply icons based on network status", () => {
    test("should apply online icon when online", async () => {
      render(
        <MemoryRouter>
          <Nav />
        </MemoryRouter>,
      );
      const image = screen.getByAltText("menu-icon");
      expect(image).toBeInTheDocument();
      Object.defineProperty(globalThis.navigator, "onLine", {
        configurable: true,
        get: () => true,
      });
      act(() => {
        globalThis.dispatchEvent(new Event("online"));
      });
      expect(image).toHaveAttribute("src", online);
    });

    test("should apply offline icon when offline", async () => {
      render(
        <MemoryRouter>
          <Nav />
        </MemoryRouter>,
      );
      const image = screen.getByAltText("menu-icon");
      Object.defineProperty(globalThis.navigator, "onLine", {
        configurable: true,
        get: () => false,
      });
      act(() => {
        globalThis.dispatchEvent(new Event("offline"));
      });
      expect(image).toHaveAttribute("src", offline);
    });
  });

  describe("should react to network changes", () => {
    test("should show online status when online", async () => {
      render(
        <MemoryRouter>
          <Nav />
        </MemoryRouter>,
      );
      Object.defineProperty(globalThis.navigator, "onLine", {
        configurable: true,
        get: () => true,
      });
      act(() => {
        globalThis.dispatchEvent(new Event("online"));
      });
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    test("should show offline status when offline", async () => {
      render(
        <MemoryRouter>
          <Nav />
        </MemoryRouter>,
      );
      Object.defineProperty(globalThis.navigator, "onLine", {
        configurable: true,
        get: () => false,
      });
      act(() => {
        globalThis.dispatchEvent(new Event("offline"));
      });

      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });
  describe("RecentPlaylistsOrAlbums", () => {
    test("should render", async () => {
      render(
        <MemoryRouter>
          <Nav />
        </MemoryRouter>,
      );
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
    describe("Recent Albums", () => {
      afterEach(() => {
        act(() => {
          useBoundStore.getState().removeLibraryAlbum(sampleAlbum.id);
        });
      });
      test("should render", async () => {
        act(() => {
          setLibraryAlbum(sampleAlbum);
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const list = screen.getByRole("list");
        expect(screen.getByTestId("album-listitem")).toBeInTheDocument();
        expect(list.childElementCount).toBe(1);
      });
      test("should contain the image url of the album", async () => {
        act(() => {
          setLibraryAlbum(sampleAlbum);
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("album-menu-icon");
        expect((image as HTMLImageElement).src).toContain("image%20url");
      });
      test("should contain playlistfallback as src if there is no image", async () => {
        act(() => {
          useBoundStore
            .getState()
            .setLibraryAlbum({ ...sampleAlbum, image: [] });
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("album-menu-icon");
        expect((image as HTMLImageElement).src).toContain(playlistfallback);
      });
      test("should have its image revert to playlistfallback onError", async () => {
        act(() => {
          setLibraryAlbum(sampleAlbum);
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("album-menu-icon");
        expect((image as HTMLImageElement).src).toContain("image%20url");
        fireEvent.error(image);
        expect((image as HTMLImageElement).src).toContain(playlistfallback);
      });
    });
    describe("Recent Playlists", () => {
      afterEach(() => {
        act(() => {
          useBoundStore.getState().removeLibraryPlaylist(samplePlaylist.id);
        });
      });
      test("should render", async () => {
        act(() => {
          setLibraryPlaylist(samplePlaylist);
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const list = screen.getByRole("list");
        expect(screen.getByTestId("playlist-listitem")).toBeInTheDocument();
        expect(list.childElementCount).toBe(1);
      });
      test("should contain the image url of the album", async () => {
        act(() => {
          setLibraryPlaylist(samplePlaylist);
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("playlist-menu-icon");
        expect((image as HTMLImageElement).src).toContain("image%20url");
      });
      test("should contain fallback as src if there is no image", async () => {
        act(() => {
          useBoundStore
            .getState()
            .setLibraryPlaylist({ ...samplePlaylist, image: [] });
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("playlist-menu-icon");
        expect((image as HTMLImageElement).src).toContain(fallback);
      });
      test("should have its image revert to playlistfallback onError", async () => {
        act(() => {
          setLibraryPlaylist(samplePlaylist);
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("playlist-menu-icon");
        expect((image as HTMLImageElement).src).toContain("image%20url");

        fireEvent.error(image);

        expect((image as HTMLImageElement).src).toContain(playlistfallback);
      });
    });
    describe("Recent UserPlaylists", () => {
      afterEach(() => {
        act(() => {
          useBoundStore.getState().removeUserPlaylist(12);
        });
      });
      test("should render", async () => {
        act(() => {
          setUserPlaylist({
            id: 12,
            name: "Userplaylist",
            songs: [sampleTrack],
          });
        });
        render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const list = screen.getByRole("list");
        expect(screen.getByTestId("userplaylist-listitem")).toBeInTheDocument();
        expect(list.childElementCount).toBe(1);
      });
      test("should contain playlistfallback as the image url for the userplaylist", async () => {
        act(() => {
          setUserPlaylist({
            id: 12,
            name: "Userplaylist",
            songs: [sampleTrack],
          });
        });
        const { unmount } = render(
          <MemoryRouter>
            <Nav />
          </MemoryRouter>,
        );
        const image = screen.getByAltText("userplaylist-menu-icon");
        expect((image as HTMLImageElement).src).toContain(playlistfallback);
        unmount();
      });
    });
  });
});
