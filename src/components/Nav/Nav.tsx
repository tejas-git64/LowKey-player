import { Link } from "react-router-dom";
import home from "../../assets/svgs/icons8-home.svg";
import search from "../../assets/svgs/icons8-search.svg";
import libraryImg from "../../assets/svgs/icons8-library.svg";
import add from "../../assets/svgs/icons8-plus.svg";
import heart from "../../assets/svgs/icons8-heart.svg";
import online from "../../assets/icons8-online-28.png";
import offline from "../../assets/icons8-offline-28.png";
import { memo, useEffect, useState } from "react";
import { useBoundStore } from "../../store/store";
import { AlbumById, PlaylistById, UserPlaylist } from "../../types/GlobalTypes";
import playlistfallback from "../../assets/fallbacks/playlist-fallback-min.webp";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";

const Nav = memo(() => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);

  useEffect(() => {
    const handleNetworkChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  return (
    <nav
      role="navigation"
      className="hidden h-full max-h-screen overflow-hidden border-l-2 border-black bg-neutral-800 sm:block sm:w-20 lg:w-80 2xl:w-96"
    >
      <div className="mx-auto flex h-auto w-[95%] flex-col items-start justify-evenly overflow-hidden bg-neutral-800 px-1 pt-2">
        <Link
          to={"/home"}
          className="flex w-full items-center justify-start p-3 pl-3.5 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
        >
          <img
            src={home}
            alt="home-icon"
            className="mr-7 w-7 flex-shrink-0 xl:mr-[22px]"
          />
          <p className="hidden text-base font-normal text-white sm:block">
            Home
          </p>
        </Link>
        <Link
          to={"/search"}
          className="flex w-full items-center justify-start p-3 pl-3.5 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
        >
          <img
            src={search}
            alt="search-icon"
            className="mr-7 w-7 flex-shrink-0 xl:mr-[22px]"
          />
          <p className="-mt-0.5 hidden text-base font-normal text-white sm:block">
            Search
          </p>
        </Link>
      </div>
      <div className="relative mt-[2px] flex h-[88.5%] w-full flex-col items-center justify-start overflow-hidden bg-neutral-800 px-1 lg:h-[88%]">
        <div className="mx-auto h-[150px] w-[95%] px-1 lg:h-[155px]">
          <Link
            to={"/library"}
            className="flex w-full items-center justify-start p-3 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
          >
            <img
              src={libraryImg}
              alt="library-icon"
              className="ml-0.5 mr-[30px] w-[22px] flex-shrink-0 xl:mr-[27px] 2xl:mr-[26px]"
            />
            <p className="hidden text-base font-normal text-white sm:block">
              Library
            </p>
          </Link>
          <Link
            to={"/favorites"}
            className="flex w-full items-center justify-start p-3 pl-2.5 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
          >
            <img
              src={heart}
              alt="favorites-icon"
              className="ml-0.5 mr-7 w-[26px] flex-shrink-0 xl:mr-6 xl:w-7"
            />
            <p className="-mt-1 hidden text-base font-normal text-white sm:block">
              Favorites
            </p>
          </Link>
          <div
            role="button"
            tabIndex={0}
            className="-mt-0.5 flex w-full items-center justify-start px-3 pl-2.5 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700 lg:py-3"
            onClick={() => setRevealCreation(true)}
          >
            <img
              src={add}
              alt="create-icon"
              className="mx-1 mr-[29px] w-[23px] flex-shrink-0 invert xl:mr-[26px]"
            />
            <p className="-mt-0.5 hidden text-base font-normal text-white sm:block">
              New playlist
            </p>
          </div>
        </div>
        <RecentPlaylistsOrAlbums />
        <div className="absolute bottom-[80px] left-2 flex w-full items-center justify-start bg-inherit p-3">
          <img
            src={isOnline ? online : offline}
            alt="menu-icon"
            className="mr-6 h-7 w-7 xl:mr-6"
          />
          <p
            data-testid="network-status"
            className={`hidden ${
              isOnline ? "text-white" : "text-red-600"
            } text-sm sm:block`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </nav>
  );
});
export default Nav;
Nav.displayName = "Nav";

const RecentPlaylistsOrAlbums = memo(() => {
  const albums = useBoundStore((state) => state.library.albums);
  const playlists = useBoundStore((state) => state.library.playlists);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  return (
    <div
      role="list"
      className="h-content mx-auto mt-2 flex w-[95%] flex-col items-center justify-center overflow-y-auto overflow-x-hidden pb-2 pl-1"
    >
      {albums.map((album: AlbumById) => (
        <Link
          tabIndex={0}
          to={`/albums/${album.id}`}
          key={album.id}
          data-testid="album-listitem"
          className="mb-2 flex h-[50px] w-full items-center justify-start outline-none transition-colors hover:bg-neutral-700 focus-visible:bg-neutral-700"
        >
          <img
            src={album.image[0]?.url || playlistfallback}
            alt="album-menu-icon"
            width={50}
            height={50}
            onError={(e) => (e.currentTarget.src = playlistfallback)}
            className="mr-4 aspect-square h-[50px] w-[50px] flex-shrink-0 rounded-sm shadow-md shadow-black"
          />
          <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
            {album.name}
          </p>
        </Link>
      ))}
      {playlists.map((playlist: PlaylistById) => (
        <Link
          tabIndex={0}
          to={`/playlists/${playlist.id}`}
          key={playlist.id}
          data-testid="playlist-listitem"
          className="mb-2 flex h-[50px] w-full items-center justify-start outline-none transition-colors hover:bg-neutral-700 focus-visible:bg-neutral-700"
        >
          <img
            src={playlist.image[0]?.url || fallback}
            alt="playlist-menu-icon"
            width={50}
            height={50}
            onError={(e) => (e.currentTarget.src = playlistfallback)}
            className="mr-4 aspect-square h-[50px] w-[50px] flex-shrink-0 rounded-sm shadow-md shadow-black"
          />
          <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
            {playlist.name}
          </p>
        </Link>
      ))}
      {userPlaylists.map((playlist: UserPlaylist) => (
        <Link
          tabIndex={0}
          to={`/userplaylists/${playlist.id}`}
          key={playlist.id}
          data-testid="userplaylist-listitem"
          className="mb-2 flex h-[50px] w-full items-center justify-start outline-none transition-colors hover:bg-neutral-700 focus-visible:bg-neutral-700"
        >
          <img
            src={playlistfallback}
            width={50}
            height={50}
            alt="userplaylist-menu-icon"
            className="mr-4 h-[50px] w-[50px] flex-shrink-0 rounded-sm bg-emerald-500 shadow-md shadow-black"
          />
          <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
            {playlist.name}
          </p>
        </Link>
      ))}
    </div>
  );
});
