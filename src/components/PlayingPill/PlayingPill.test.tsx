import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import PlayingPill from "./PlayingPill";
import { useBoundStore } from "../../store/store";
import { sampleTrack } from "../../api/samples";
import Layout from "../../pages/Layout/Layout";
import play from "../../assets/svgs/play-icon.svg";
import tick from "../../assets/svgs/icons8-tick.svg";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import { MemoryRouter } from "react-router-dom";

const { setNowPlaying, setToUserPlaylist, setUserPlaylist } =
  useBoundStore.getState();

beforeEach(() => {
  act(() => {
    setNowPlaying(sampleTrack);
  });
});

afterEach(() => {
  act(() => {
    setNowPlaying(null);
  });
  cleanup();
});

function getPlaylist() {
  return useBoundStore.getState().library.userPlaylists.find((obj) => {
    return obj.songs.find((song) => {
      return song.id === sampleTrack.id;
    });
  });
}

describe("PlayingPill", () => {
  test("should contain track", () => {
    render(<PlayingPill />);
    const track = useBoundStore.getState().nowPlaying.track;
    expect(track).toBeDefined();
  });
  test("pill should contain track id", () => {
    render(<PlayingPill />);
    const track = useBoundStore.getState().nowPlaying.track;
    expect(track?.id).toBeDefined();
  });
  test("track should contain id", () => {
    render(<PlayingPill />);
    const track = useBoundStore.getState().nowPlaying.track;
    expect(track?.image).toBeDefined();
  });
  test("should contain class 'flex' if a track is currently present", () => {
    render(<PlayingPill />);
    expect(screen.getByTestId("playing-pill")).toBeDefined();
    expect(screen.getByTestId("playing-pill")).toHaveClass("flex");
  });
  test("should not render if no track is playing", () => {
    act(() => {
      setNowPlaying(null);
    });
    render(<PlayingPill />);
    expect(screen.queryByTestId("playing-pill")).not.toBeInTheDocument();
  });
  test("should contain class 'hidden' if a track is currently present", () => {
    act(() => {
      setNowPlaying({ ...sampleTrack, id: "" });
    });
    render(<PlayingPill />);
    expect(screen.getByTestId("playing-pill")).toBeDefined();
    expect(screen.getByTestId("playing-pill")).toHaveClass("hidden");
  });
  test("should find playlists that have desired track", () => {
    act(() => {
      setToUserPlaylist(sampleTrack, 12);
    });
    const playlist = getPlaylist();
    if (playlist) expect(playlist.id).toBe(12);
  });
  test("should contain track image", () => {
    render(<PlayingPill />);
    expect(screen.getByAltText("song-img")).toHaveAttribute("src", "image url");
  });
  test("should contain songfallback if no track image", () => {
    act(() => {
      setNowPlaying({ ...sampleTrack, image: [] });
    });
    render(<PlayingPill />);
    waitFor(() => {
      const image = screen.getByAltText("song-img");
      expect((image as HTMLImageElement).src).toContain(songfallback);
    });
  });
  test("should contain fallback image onError", () => {
    render(<PlayingPill />);
    fireEvent.error(screen.getByAltText("song-img"));
    expect(screen.getByAltText("song-img")).toHaveAttribute(
      "src",
      songfallback,
    );
  });
  test("should show track name if track is present", () => {
    render(<PlayingPill />);
    expect(screen.getByText(sampleTrack.name)).toBeInTheDocument();
  });
  test("should not show track name if track name is not present", () => {
    act(() => {
      setNowPlaying({ ...sampleTrack, name: "" });
    });
    render(<PlayingPill />);
    waitFor(() => {
      expect(screen.getByText(sampleTrack.name)).not.toBeInTheDocument();
    });
  });
  test("should show primary artist name", () => {
    render(<PlayingPill />);
    expect(sampleTrack.artists).toBeDefined();
    expect(screen.getByTestId("primary-artist-name").textContent).toBe(
      "Artist name",
    );
  });
  test("should not show primary artist name if not present", () => {
    act(() => {
      setNowPlaying({
        ...sampleTrack,
        artists: {
          ...sampleTrack.artists,
          primary: [],
        },
      });
    });
    render(<PlayingPill />);

    expect(screen.getByTestId("primary-artist-name").textContent).toBe("");
  });
  test("should set the track to be added to a playlist and show modal on button click", () => {
    render(<PlayingPill />);
    fireEvent.click(screen.getByTestId("add-to-playlist-btn"));
    expect(useBoundStore.getState().creationTrack).toBe(sampleTrack);
    expect(useBoundStore.getState().revealCreation).toBe(true);
  });
  test("should show add icon if the track is not added to a playlist", () => {
    render(<PlayingPill />);
    const image = screen.getByAltText("add-to-playlist");
    expect((image as HTMLImageElement).src).toContain(add);
  });
  test("should show tick icon if the song is added to a track", () => {
    act(() => {
      setUserPlaylist({
        id: 10,
        name: "Custom Playlist",
        songs: [],
      });
      setToUserPlaylist(sampleTrack, 10);
    });
    render(<PlayingPill />);
    const image = screen.getByAltText("add-to-playlist");
    expect((image as HTMLImageElement).src).toContain(tick);
  });
  test("should show play icon if not playing", () => {
    render(<PlayingPill />);
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
    expect(screen.getByAltText("play-icon")).toHaveAttribute("src", play);
  });
  test("should show pause icon if playing", () => {
    render(<PlayingPill />);
    fireEvent.click(screen.getByTestId("play-btn"));
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    expect(screen.getByAltText("play-icon")).toHaveAttribute("src", pause);
  });
  test("shows mobile player on clicking it", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("playing-pill"));
    waitFor(() => {
      expect(screen.getByTestId("now-playing")).toBeInTheDocument();
    });
  });
  test("should show relevant icons on calling toggleFavorite", () => {
    render(<PlayingPill />);
    expect(screen.getByAltText("favorite")).toHaveAttribute("src", favorite);

    fireEvent.click(screen.getByTestId("favorite-btn"));

    expect(screen.getByAltText("favorite")).toHaveAttribute("src", favorited);
  });
});
