import { Link } from "react-router-dom";
import home from "/svgs/icons8-home.svg";
import search from "/svgs/icons8-search.svg";
import libraryImg from "/svgs/icons8-library.svg";
import add from "/svgs/icons8-plus.svg";
import heart from "/svgs/icons8-heart.svg";
import online from "/icons/icons8-online-28.png";
import offline from "/icons/icons8-offline-28.png";
import { useEffect, useState } from "react";
import { useBoundStore } from "../../store/store";
import { AlbumById, PlaylistById, UserPlaylist } from "../../types/GlobalTypes";
import playlistfallback from "/fallbacks/playlist-fallback-min.webp";
import fallback from "/fallbacks/playlist-fallback.webp";

const Nav = () => {
  return (
    <nav
      role="navigation"
      className="hidden h-full max-h-screen overflow-hidden border-l-2 border-black bg-neutral-800 sm:block sm:w-20 lg:w-80 2xl:w-96"
    >
      <div className="relative mx-auto flex h-[88dvh] w-[95%] flex-col items-start justify-start overflow-hidden bg-neutral-800 px-1 pt-2">
        <Link
          to={"/home"}
          className="flex w-full items-center justify-start p-3 pl-4 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
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
          className="flex w-full items-center justify-start p-3 pl-4 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
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
        <Link
          to={"/library"}
          className="flex w-full items-center justify-start p-3 py-3.5 pl-4 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
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
          className="flex w-full items-center justify-start p-3 py-3.5 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
        >
          <img
            src={heart}
            alt="favorites-icon"
            className="ml-0.5 mr-7 w-[28px] flex-shrink-0 xl:mr-6 xl:w-7"
          />
          <p className="hidden text-base font-normal text-white sm:block">
            Favorites
          </p>
        </Link>
        <PlaylistCreationButton />
        <RecentPlaylistsOrAlbums />
        <OnlineStatus />
      </div>
    </nav>
  );
};
Nav.displayName = "Nav";
export default Nav;

const PlaylistCreationButton = () => {
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);

  return (
    <button
      className="flex w-full items-center justify-start p-3 py-3.5 pl-4 outline-none transition-colors hover:bg-neutral-600 focus-visible:bg-neutral-700"
      onClick={() => setRevealCreation(true)}
    >
      <img
        src={add}
        alt="create-icon"
        className="ml-0.5 mr-8 w-[21px] flex-shrink-0 invert xl:mr-7 xl:w-5"
      />
      <p className="-mt-0.5 hidden whitespace-nowrap text-base font-normal text-white sm:block">
        New playlist
      </p>
    </button>
  );
};

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleNetworkChange = () => setIsOnline(navigator.onLine);
    globalThis.addEventListener("online", handleNetworkChange);
    globalThis.addEventListener("offline", handleNetworkChange);
    return () => {
      globalThis.removeEventListener("online", handleNetworkChange);
      globalThis.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  return (
    <div className="absolute bottom-1 left-2 flex w-full items-center justify-start bg-inherit p-3">
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
  );
};

export function RecentPlaylistsOrAlbums() {
  const albums = useBoundStore((state) => state.library.albums);
  const playlists = useBoundStore((state) => state.library.playlists);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  return (
    <ul className="mx-auto mt-2 flex w-[95%] flex-col items-center justify-start overflow-y-auto overflow-x-hidden pb-14 pl-1">
      {albums.map((album: AlbumById) => (
        <Link
          tabIndex={0}
          to={`/albums/${album.id}`}
          key={album.id}
          role="listitem"
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
          role="listitem"
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
          role="listitem"
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
    </ul>
  );
}
