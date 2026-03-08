import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Loading from "./Loading";

describe("loading UI of PlaylistPage", () => {
  test("should render", async () => {
    render(<Loading />);
    await waitFor(() => {
      expect(screen.getByTestId("playlist-fallback")).toBeInTheDocument();
    });
  });
});
