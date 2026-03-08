import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import {
  ArtistAlbumFallback,
  ArtistInfoFallback,
  ArtistSongsFallback,
} from "./Loading";

afterEach(() => {
  cleanup();
});

describe("loading UI of ArtistPage", () => {
  test("should render info fallback", () => {
    render(<ArtistInfoFallback />);
    expect(screen.getByTestId("artist-fallback")).toBeInTheDocument();
  });

  test("should render album fallback", () => {
    render(<ArtistAlbumFallback />);
    expect(screen.getByTestId("artist-album-fallback")).toBeInTheDocument();
  });

  test("should render album fallback", async () => {
    render(<ArtistSongsFallback />);
    await waitFor(() => {
      expect(screen.getByTestId("artist-songs-fallback")).toBeInTheDocument();
    });
  });
});
