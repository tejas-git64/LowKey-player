import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach } from "node:test";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import Home from "../../pages/Home/Home";
import ErrorFallback from "./ErrorFallback";

afterEach(() => {
  cleanup();
});

describe("ErrorFallback", () => {
  test("should render", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <ErrorFallback message="Unexpected error" />
        <Home />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId("error-fallback")).toBeInTheDocument();
  });
  test("reload button reloads the page", () => {
    const reloadMock = vi.fn();

    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(<ErrorFallback message="Unexpected error!" />);

    fireEvent.click(screen.getByRole("button", { name: /reload/i }));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
