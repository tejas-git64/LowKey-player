import { Outlet, useLocation } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import Nav from "../../components/Nav/Nav";
import Recents from "../../components/Recents/Recents";
import PlayingPill from "../../components/PlayingPill/PlayingPill";
import MobileNav from "../../components/MobileNav/MobileNav";
import NowPlaying from "../../components/Nowplaying/NowPlaying";
import Creation from "../../components/PlaylistModal/PlaylistModal";
import { useEffect, useRef } from "react";
import { useBoundStore } from "../../store/store";
import { LocalLibrary } from "../../types/GlobalTypes";

export default function Layout() {
  const path = useLocation().pathname;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setUserPlaylist = useBoundStore((state) => state.setUserPlaylist);
  const setLibraryPlaylist = useBoundStore((state) => state.setLibraryPlaylist);
  const setLibraryAlbum = useBoundStore((state) => state.setLibraryAlbum);
  const setFollowing = useBoundStore((state) => state.setFollowing);

  useEffect(() => {
    const localSaves = localStorage.getItem("local-library");
    if (localSaves !== null) {
      const {
        albums: lastAlbums,
        followings: lastFollowings,
        playlists: lastPlaylists,
        userPlaylists: lastUserPlaylists,
      }: LocalLibrary = JSON.parse(localSaves);
      for (const l of lastAlbums || []) {
        setLibraryAlbum(l);
      }
      for (const l of lastUserPlaylists || []) {
        setUserPlaylist(l);
      }
      for (const l of lastPlaylists || []) {
        setLibraryPlaylist(l);
      }
      for (const l of lastFollowings || []) {
        setFollowing(l);
      }
    }
  }, [setFollowing, setLibraryAlbum, setLibraryPlaylist, setUserPlaylist]);

  return (
    <div
      data-testid="layout"
      className="relative h-full w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 2xl:mx-auto 2xl:max-h-[1200px] 2xl:max-w-[1600px]"
    >
      {path !== "/" && <Banner />}
      <div
        data-testid="layout-inner-container"
        className={`relative flex h-full w-full flex-row items-start justify-start overflow-hidden ${
          path === "/" ? "sm:h-full" : "sm:h-[95vh]"
        }`}
      >
        {path !== "/" && <Nav />}
        <div
          data-testid="outlet-container"
          className={`h-full w-full overflow-x-hidden ${
            path === "/" ? "sm:h-full" : "sm:h-[95vh]"
          }`}
        >
          <div
            ref={containerRef}
            className="relative h-full w-full border-x-2 border-black"
          >
            <Outlet />
            <Creation ref={containerRef} />
          </div>
          <div
            data-testid="mobile-features"
            className={`fixed bottom-0 left-0 ${
              path === "/" ? "hidden" : "sm:hidden"
            } flex h-auto w-screen flex-col items-center justify-end bg-gradient-to-t from-black via-[#000000dd] to-transparent pt-2`}
          >
            <PlayingPill />
            <MobileNav />
          </div>
        </div>
        {path !== "/" && <Recents />}
      </div>
      {path !== "/" && <NowPlaying />}
    </div>
  );
}
