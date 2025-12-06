import { ComponentType, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PlaylistModal from "../../components/PlaylistModal/PlaylistModal";
import { useBoundStore } from "../../store/store";
import { LocalLibrary } from "../../types/GlobalTypes";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

type ModuleWithDefaultComponent = {
  default: ComponentType<unknown>;
};
const components = import.meta.glob<ModuleWithDefaultComponent>(
  "../../components/**/*.tsx",
);

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
      <ConditionalComponent
        filePath={"../../components/Banner/Banner.tsx"}
        viewPortSize={"all"}
      />
      <div
        data-testid="layout-inner-container"
        className={`relative flex h-full w-full flex-row items-start justify-start overflow-hidden ${
          path === "/" ? "sm:h-full" : "sm:h-[95vh]"
        }`}
      >
        <ConditionalComponent
          filePath={"../../components/Nav/Nav.tsx"}
          viewPortSize={"desktop"}
        />
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
            <PlaylistModal ref={containerRef} />
          </div>
          <div
            data-testid="mobile-features"
            className={`fixed bottom-0 left-0 ${
              path === "/" ? "hidden" : "sm:hidden"
            } flex h-auto w-screen flex-col items-center justify-end bg-gradient-to-t from-black via-[#000000dd] to-transparent pt-2`}
          >
            <ConditionalComponent
              filePath={"../../components/PlayingPill/PlayingPill.tsx"}
              viewPortSize={"mobile"}
            />
            <ConditionalComponent
              filePath={"../../components/MobileNav/MobileNav.tsx"}
              viewPortSize={"mobile"}
            />
          </div>
        </div>
        <ConditionalComponent
          filePath={"../../components/Recents/Recents.tsx"}
          viewPortSize={"desktop"}
        />
      </div>
      <ConditionalComponent
        filePath={"../../components/Nowplaying/NowPlaying.tsx"}
        viewPortSize={"all"}
      />
    </div>
  );
}

const ConditionalComponent = ({
  filePath,
  viewPortSize,
}: {
  filePath: string;
  viewPortSize: string;
}) => {
  const path = useLocation().pathname;
  const isMobile = useResponsiveLayout();
  const [Component, setComponent] = useState<ComponentType | null>(null);

  const getComponent = useCallback(() => {
    const component = components[filePath];
    if (path !== "/" && component) {
      if (
        viewPortSize === "all" ||
        (viewPortSize === "mobile" && isMobile) ||
        (viewPortSize === "desktop" && !isMobile)
      ) {
        component().then((mod) => {
          setComponent(() => mod.default);
        });
      }
    }
  }, [filePath, isMobile, path, viewPortSize]);

  useEffect(() => {
    getComponent();
  }, [getComponent]);

  if (Component) return <Component />;
  return null;
};
