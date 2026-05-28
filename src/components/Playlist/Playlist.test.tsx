import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterAll, afterEach, describe, expect, test, vi } from "vitest";
import Playlist from "./Playlist";
const fallback = "/fallbacks/playlist-fallback.webp";
import { samplePlaylistOfList } from "../../api/samples";

const fadeOutNavigate = vi.fn();
fadeOutNavigate.mockImplementation(() => {});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

afterAll(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

describe("Playlist", () => {
  test("should render", async () => {
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    expect(screen.getByTestId("playlist")).toBeInTheDocument();
  });
  test("should fadeout and navigate on click", async () => {
    vi.useFakeTimers();
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    const playlist = screen.getByTestId("playlist");
    fireEvent.click(playlist);
    vi.runAllTimersAsync();
    await waitFor(() => {
      expect(fadeOutNavigate).toHaveBeenCalledWith(
        `/playlists/${samplePlaylistOfList.id}`,
      );
    });
  });
  test("should contain image of size 150x150 if found", async () => {
    render(
      <Playlist
        {...{
          ...samplePlaylistOfList,
          image: [
            {
              quality: "150x150",
              url: "image url",
            },
          ],
        }}
        fadeOutNavigate={fadeOutNavigate}
      />,
    );
    expect(screen.getByAltText("Playlist 21")).toHaveAttribute(
      "src",
      "image url",
    );
  });
  test("should contain fallback image if no image", async () => {
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    expect(screen.getByAltText("Playlist 21")).toHaveAttribute("src", fallback);
  });
  test("image should be it's fallback onError", async () => {
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    fireEvent.error(screen.getByAltText("Playlist 21"));
    expect(screen.getByAltText("Playlist 21")).toHaveAttribute("src", fallback);
  });
  test("image should have transition applied on mount", async () => {
    vi.useFakeTimers();
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    expect(screen.getByAltText("Playlist 21")).toBeInTheDocument();
    expect(screen.getByAltText("Playlist 21")).toHaveClass("image-fadeout");
    expect(screen.getByAltText("Playlist 21")).not.toHaveClass("image-fadein");
    vi.advanceTimersByTime(samplePlaylistOfList.i * 50);

    expect(screen.getByAltText("Playlist 21")).toHaveClass("image-fadein");
    expect(screen.getByAltText("Playlist 21")).not.toHaveClass("image-fadeout");
  });
});
