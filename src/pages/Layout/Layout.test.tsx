import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockInstance,
  test,
  vi,
} from "vitest";
import Layout from "./Layout";
import { MemoryRouter } from "react-router-dom";
import {
  sampleAlbum,
  sampleArtistInSong,
  samplePlaylist,
  sampleUserPlaylist,
} from "../../api/samples";
import { useBoundStore } from "../../store/store";

const getItemMock: MockInstance<(key: string) => string | null> = vi.spyOn(
  Storage.prototype,
  "getItem",
);

beforeEach(() => {
  getItemMock.mockReturnValue(
    JSON.stringify({
      albums: [sampleAlbum],
      followings: [sampleArtistInSong],
      playlists: [samplePlaylist],
      userPlaylists: [sampleUserPlaylist],
    }),
  );
  act(() => {
    useBoundStore.getState().removeFollowing(sampleArtistInSong.id);
    useBoundStore.getState().removeUserPlaylist(sampleUserPlaylist.id);
    useBoundStore.getState().removeLibraryPlaylist(samplePlaylist.id);
    useBoundStore.getState().removeLibraryAlbum(sampleAlbum.id);
  });
});

afterEach(() => {
  cleanup();
});

describe("Layout", () => {
  test("should render", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
  test("should set saves from localStorage if available", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(localStorage.getItem("local-library")).toBeDefined();
    waitFor(() => {
      expect(useBoundStore.getState().library.albums.length).toBeGreaterThan(0);
      expect(useBoundStore.getState().library.playlists.length).toBeGreaterThan(
        0,
      );
      expect(
        useBoundStore.getState().library.userPlaylists.length,
      ).toBeGreaterThan(0);
      expect(
        useBoundStore.getState().library.followings.length,
      ).toBeGreaterThan(0);
    });
  });
  test("should not set saves from localStorage if not available", async () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    getItemMock.mockReturnValue(null);
    await waitFor(() => {
      expect(localStorage.getItem("local-library")).toBeNull();
      expect(useBoundStore.getState().library.albums.length).toBe(0);
      expect(useBoundStore.getState().library.playlists.length).toBe(0);
      expect(useBoundStore.getState().library.userPlaylists.length).toBe(0);
      expect(useBoundStore.getState().library.followings.length).toBe(0);
    });
  });
  test("should contain mobile specific class when path is not /", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]} initialIndex={0}>
        <Layout />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("layout-inner-container")).toBeInTheDocument();
      expect(screen.getByTestId("layout-inner-container").classList).toContain(
        "sm:h-[95vh]",
      );
    });
  });
  test("should contain mobile specific class when path is not /", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]} initialIndex={0}>
        <Layout />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("outlet-container")).toBeInTheDocument();
      expect(screen.getByTestId("outlet-container").classList).toContain(
        "sm:h-[95vh]",
      );
    });
  });
  test("mobile specific features must be hidden when path is /", async () => {
    render(
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Layout />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("mobile-features")).toBeInTheDocument();
      expect(screen.getByTestId("mobile-features").classList).toContain(
        "hidden",
      );
    });
  });
});
