import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterAll, afterEach, describe, expect, test, vi } from "vitest";
import Playlist from "./Playlist";
import fallback from "/fallbacks/playlist-fallback.webp";
import { samplePlaylistOfList } from "../../api/samples";
import { MemoryRouter, useLocation } from "react-router-dom";

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
  test("should render", () => {
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    expect(screen.getByTestId("playlist")).toBeInTheDocument();
  });
  test("should fadeout and navigate on click", () => {
    vi.useFakeTimers();
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    const { result } = renderHook(() => useLocation(), {
      wrapper: MemoryRouter,
    });
    const path = result.current.pathname;
    act(() => {
      fireEvent.click(screen.getByTestId("playlist"));
    });
    vi.advanceTimersByTime(150);
    waitFor(() => {
      expect(path).toBe(`/playlists/${samplePlaylistOfList.id}`);
    });
  });
  test("should contain image of size 150x150 if found", () => {
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
    expect(screen.getByAltText("user-profile")).toHaveAttribute(
      "src",
      "image url",
    );
  });
  test("should contain fallback image if no image", () => {
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    expect(screen.getByAltText("user-profile")).toHaveAttribute(
      "src",
      fallback,
    );
  });
  test("image should be it's fallback onError", () => {
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    fireEvent.error(screen.getByAltText("user-profile"));
    expect(screen.getByAltText("user-profile")).toHaveAttribute(
      "src",
      fallback,
    );
  });
  test("image should have transition applied on mount", () => {
    vi.useFakeTimers();
    render(
      <Playlist {...samplePlaylistOfList} fadeOutNavigate={fadeOutNavigate} />,
    );
    expect(screen.getByAltText("user-profile")).toBeInTheDocument();
    expect(screen.getByAltText("user-profile")).toHaveClass("image-fadeout");
    expect(screen.getByAltText("user-profile")).not.toHaveClass("image-fadein");
    vi.advanceTimersByTime(samplePlaylistOfList.i * 50);

    expect(screen.getByAltText("user-profile")).toHaveClass("image-fadein");
    expect(screen.getByAltText("user-profile")).not.toHaveClass(
      "image-fadeout",
    );
  });
});
