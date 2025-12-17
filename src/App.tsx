import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { preconnect } from "react-dom";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";

preconnect("https://lowkey-backend.vercel.app");

export const routes = [
  {
    path: "/",
    lazy: async () => {
      const { default: Layout } = await import("./pages/Layout/Layout");
      return {
        Component: Layout,
      };
    },
    HydrateFallback: () => <div className="h-full w-full bg-transparent" />,
    errorElement: <ErrorFallback message="Unexpected error :/" />,
    children: [
      {
        path: "/",
        lazy: async () => {
          const { default: Intro } = await import("./pages/Intro/Intro");
          return {
            Component: Intro,
          };
        },
      },
      {
        path: "/*",
        lazy: async () => {
          const { default: NotFound } =
            await import("./pages/NotFound/NotFound");
          return { Component: NotFound };
        },
      },
      {
        path: "/home",
        lazy: async () => {
          const { default: Home } = await import("./pages/Home/Home");
          return { Component: Home };
        },
      },
      {
        path: "/search",
        lazy: async () => {
          const { default: Search } = await import("./pages/Search/Search");
          return { Component: Search };
        },
      },
      {
        path: "/albums/:id",
        lazy: async () => {
          const { default: AlbumPage } =
            await import("./pages/Album/AlbumPage");
          return { Component: AlbumPage };
        },
        errorElement: <ErrorFallback message="Uh oh...could not fetch album" />,
      },
      {
        path: "/playlists/:id",
        lazy: async () => {
          const { default: PlaylistPage } =
            await import("./pages/Playlist/PlaylistPage");
          return { Component: PlaylistPage };
        },
        errorElement: (
          <ErrorFallback message="Uh oh...could not fetch playlist" />
        ),
      },
      {
        path: "/userplaylists/:id",
        lazy: async () => {
          const { default: UserPlaylistPage } =
            await import("./pages/UserPlaylist/UserPlaylist");
          return { Component: UserPlaylistPage };
        },
      },
      {
        path: "/artists/:id",
        lazy: async () => {
          const { default: Artists } =
            await import("./pages/Artist/ArtistPage");
          return { Component: Artists };
        },
        errorElement: (
          <ErrorFallback message="Uh oh...could not fetch artist details" />
        ),
      },
      {
        path: "/library",
        lazy: async () => {
          const { default: Library } = await import("./pages/Library/Library");
          return { Component: Library };
        },
      },
      {
        path: "/favorites",
        lazy: async () => {
          const { default: Favorites } =
            await import("./pages/Favorites/Favorites");
          return { Component: Favorites };
        },
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
