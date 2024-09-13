import { Outlet, useLocation } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import Menu from "../../components/Menu/Menu";
import Recents from "../../components/Recents/Recents";
import PlayingPill from "../../components/PlayingPill/PlayingPill";
import MobileNav from "../../components/MobileNav/MobileNav";
import { useBoundStore } from "../../store/store";
import NowPlaying from "../../components/Nowplaying/NowPlaying";
import MobilePlayer from "../../components/MobilePlayer/MobilePlayer";
import Creation from "../../components/Creation/Creation";

export default function Layout() {
  const path = useLocation().pathname;
  const nowPlaying = useBoundStore((state) => state.nowPlaying);

  return (
    <div className="h-full w-full overflow-hidden bg-black">
      {path !== "/" && <Nav />}
      <div
        className={`relative flex h-full w-full flex-row items-start justify-start overflow-hidden ${
          path !== "/" ? "sm:h-[95vh]" : "sm:h-full"
        }`}
      >
        {path !== "/" && <Menu />}
        <div
          className={`h-full w-full overflow-x-hidden ${
            path !== "/" ? "sm:h-[95vh]" : "sm:h-full"
          }`}
        >
          <div className="h-full w-full bg-black">
            <Outlet />
          </div>
          <Creation />
          <div
            className={`fixed bottom-0 left-0 ${
              path === "/" ? "hidden" : "sm:hidden"
            } flex h-auto w-screen flex-col items-center justify-end bg-gradient-to-t from-black via-[#000000dd] to-transparent pt-2`}
          >
            {nowPlaying.track?.id !== "" && <PlayingPill />}
            {nowPlaying.track?.id !== "" && path !== "/" && <MobilePlayer />}
            <MobileNav />
          </div>
        </div>
        {path !== "/" && <Recents />}
        {path !== "/" && <NowPlaying />}
      </div>
    </div>
  );
}
