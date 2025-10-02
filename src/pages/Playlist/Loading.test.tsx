import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Loading from "./Loading";

describe("loading UI of PlaylistPage", () => {
  test("should render", () => {
    render(<Loading />);
    expect(screen.getByTestId("playlist-fallback")).toBeInTheDocument();
  });
});
