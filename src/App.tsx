import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import Intro from "./pages/Intro/Intro";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Search from "./pages/Search/Search";
import AlbumPage from "./pages/Album/AlbumPage";
import PlaylistPage from "./pages/Playlist/PlaylistPage";
import Library from "./pages/Library/Library";
import Favorites from "./pages/Favorites/Favorites";
import ArtistPage from "./pages/Artist/ArtistPage";
import UserPlaylistPage from "./pages/UserPlaylist/UserPlaylist";
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Intro />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="albums/:id" element={<AlbumPage />} />
        <Route path="playlists/:id" element={<PlaylistPage />} />
        <Route path="userplaylists/:id" element={<UserPlaylistPage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/artists/:id" element={<ArtistPage />} />
      </Route>,
    ),
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
