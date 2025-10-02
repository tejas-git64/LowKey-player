import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { lazy } from "react";

const Layout = lazy(() => import("./pages/Layout/Layout"));
const Intro = lazy(() => import("./pages/Intro/Intro"));
const Home = lazy(() => import("./pages/Home/Home"));
const Search = lazy(() => import("./pages/Search/Search"));
const PlaylistPage = lazy(() => import("./pages/Playlist/PlaylistPage"));
const Library = lazy(() => import("./pages/Library/Library"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));
const ArtistPage = lazy(() => import("./pages/Artist/ArtistPage"));
const UserPlaylistPage = lazy(
  () => import("./pages/UserPlaylist/UserPlaylist"),
);
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const AlbumPage = lazy(() => import("./pages/Album/AlbumPage"));

export const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Intro />} />
    <Route path="/*" element={<NotFound />} />
    <Route path="/home" element={<Home />} />
    <Route path="/search" element={<Search />} />
    <Route path="/albums/:id" element={<AlbumPage />} />
    <Route path="/playlists/:id" element={<PlaylistPage />} />
    <Route path="/userplaylists/:id" element={<UserPlaylistPage />} />
    <Route path="/library" element={<Library />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/artists/:id" element={<ArtistPage />} />
  </Route>,
);
const router = createBrowserRouter(routes);

export default function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
