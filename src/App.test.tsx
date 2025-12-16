import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import App, { routes } from "./App";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  test("should render", async () => {
    render(<App />);
    await waitFor(() => {
      const app = screen.getByText("Lowkey Music");
      expect(app).toBeInTheDocument();
    });
  });
  test('renders intro page on "/"', async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      const intro = screen.getByText("Lowkey Music");
      expect(intro).toBeInTheDocument();
    });
  });
  test("renders home page on '/home", () => {
    vi.useFakeTimers();
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/home"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    waitFor(() => {
      const home = screen.getByTestId("home-page");
      expect(home).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  test("renders search page on '/search", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/search"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    const search = await screen.findByTestId("search-page");
    expect(search).toBeInTheDocument();
  });

  test("renders the not found page for unknown route", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/*"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    const notfound = await screen.findByTestId("notfound");
    expect(notfound).toBeInTheDocument();
  });

  test("renders the library for '/library'", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/library"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    const library = await screen.findByTestId("library-page");
    expect(library).toBeInTheDocument();
  });

  test("renders favorites page for '/favorites'", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/favorites"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    const favorites = await screen.findByTestId("favorites-page");
    expect(favorites).toBeInTheDocument();
  });

  test("renders album page for '/albums/:id'", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/albums/312321"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    waitFor(() => {
      const album = screen.getByTestId("album-page");
      expect(album).toBeInTheDocument();
    });
  });

  test("renders playlist page for '/playlists/:id'", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/playlists/23141"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    waitFor(() => {
      const playlist = screen.getByTestId("playlist-page");
      expect(playlist).toBeInTheDocument();
    });
  });

  test("renders artist page for '/artists/:id'", () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/artists/413121"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    waitFor(() => {
      const artist = screen.getByTestId("artist-page");
      expect(artist).toBeInTheDocument();
    });
  });

  test("renders user playlist page for '/userplaylists/:id'", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/userplaylists/21"],
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    );
    const userplaylist = await screen.findByTestId("userplaylist-page");
    expect(userplaylist).toBeInTheDocument();
  });
});
