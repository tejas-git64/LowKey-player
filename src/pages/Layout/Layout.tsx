import { Outlet, useLocation } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import Menu from "../../components/Menu/Menu";
import Recents from "../../components/Recents/Recents";
import PlayingPill from "../../components/PlayingPill/PlayingPill";
import MobileNav from "../../components/MobileNav/MobileNav";
import NowPlaying from "../../components/Nowplaying/NowPlaying";
import Creation from "../../components/PlaylistModal/PlaylistModal";
import { useRef } from "react";

export default function Layout() {
  const path = useLocation().pathname;
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative h-full w-full overflow-hidden 2xl:mx-auto 2xl:max-h-[1200px] 2xl:max-w-[1600px]">
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
          <div
            ref={containerRef}
            className="relative h-full w-full border-x-2 border-black bg-black"
          >
            <Outlet />
            <Creation ref={containerRef} />
          </div>
          <div
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
