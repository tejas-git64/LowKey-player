import { Link } from "react-router-dom";
import home from "../../assets/svgs/icons8-home.svg";
import search from "../../assets/svgs/icons8-search.svg";
import libraryImg from "../../assets/svgs/icons8-library.svg";
import add from "../../assets/svgs/icons8-plus.svg";
import heart from "../../assets/svgs/icons8-heart.svg";
import online from "../../assets/icons8-online-28.png";
import offline from "../../assets/icons8-offline-28.png";
import { useEffect, useState } from "react";
import { useBoundStore } from "../../store/store";
import { AlbumById, PlaylistById, UserPlaylist } from "../../types/GlobalTypes";
import userplaylist from "../../assets/svgs/userplaylist.svg";

export default function Menu() {
  const [status, setStatus] = useState<boolean | null>(null);
  const albums = useBoundStore((state) => state.library.albums);
  const playlists = useBoundStore((state) => state.library.playlists);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const setCreationMenu = useBoundStore((state) => state.setCreationMenu);

  function showCreationMenu() {
    setRevealCreation(true);
    setCreationMenu(true);
  }

  useEffect(() => {
    const handleNetworkChange = () => setStatus(navigator.onLine);
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  return (
    <div
      id="menu"
      className="hidden h-full max-h-screen overflow-hidden border-l-2 border-black bg-neutral-950 sm:block sm:w-[60px] lg:w-72 xl:w-80 2xl:w-96"
    >
      <div className="flex h-auto w-full flex-col items-start justify-evenly overflow-hidden bg-neutral-800">
        <Link
          to={"/home"}
          className="flex w-full items-center justify-start p-3 hover:bg-neutral-600"
        >
          <img
            src={home}
            alt="menu-icon"
            className="mr-4 w-7 flex-shrink-0 xl:mr-6"
          />
          <p className="hidden text-base font-normal text-white sm:block">
            Home
          </p>
        </Link>
        <Link
          to={"/search"}
          className="flex w-full items-center justify-start p-3 hover:bg-neutral-600"
        >
          <img
            src={search}
            alt="menu-icon"
            className="ml-0.5 mr-5 w-[25px] xl:mr-6"
          />
          <p className="-mt-0.5 hidden text-base font-normal text-white sm:block">
            Search
          </p>
        </Link>
      </div>
      <div className="mt-[3px] flex h-[88.5%] w-full flex-col items-center justify-start overflow-hidden bg-neutral-800 lg:h-[88%]">
        <div className="h-[150px] w-full lg:h-[155px]">
          <Link
            to={"/library"}
            className="flex w-full items-center justify-start p-3 hover:bg-neutral-600"
          >
            <img
              src={libraryImg}
              alt="menu-icon"
              className="xl:mr-5.5 ml-0.5 mr-5 w-[23px] xl:w-6 2xl:mr-[26px]"
            />
            <p className="hidden text-base font-normal text-white sm:block">
              Library
            </p>
          </Link>
          <Link
            to={"/favorites"}
            className="flex w-full items-center justify-start p-3 pl-2.5 hover:bg-neutral-600"
          >
            <img
              src={heart}
              alt="menu-icon"
              className="ml-0.5 mr-4 w-[27px] xl:mr-6 xl:w-7"
            />
            <p className="-mt-1 hidden text-base font-normal text-white sm:block">
              Favorites
            </p>
          </Link>
          <div
            role="button"
            className="-mt-0.5 flex w-full items-center justify-start px-3 pl-2.5 hover:bg-neutral-600 lg:py-3"
            onClick={showCreationMenu}
          >
            <img
              src={add}
              alt="new-menu-icon"
              className="ml-1 mr-5 w-6 xl:mr-6"
            />
            <p className="-mt-0.5 hidden text-base font-normal text-white sm:block">
              New playlist
            </p>
          </div>
        </div>
        <div className="mt-2 flex h-auto w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden pb-6 lg:ml-0.5 2xl:ml-1">
          {albums.map((album: AlbumById) => (
            <Link
              to={`/albums/${album.id}`}
              key={album.id}
              className="flex h-[50px] w-full flex-shrink-0 items-center justify-start p-2 py-1 hover:bg-neutral-900"
            >
              <img
                src={album.image[0]?.url || ""}
                alt="menu-icon"
                onError={(e) => (e.currentTarget.src = userplaylist)}
                className="mr-4 h-[35px] w-[35px] rounded-md shadow-md shadow-black xl:mr-6"
              />
              <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
                {album.name}
              </p>
            </Link>
          ))}
          {playlists.map((playlist: PlaylistById) => (
            <Link
              to={`/playlists/${playlist.id}`}
              key={playlist.id}
              className="flex h-[50px] w-full flex-shrink-0 items-center justify-start p-2 py-1 hover:bg-neutral-900"
            >
              <img
                src={playlist.image[0]?.url || ""}
                alt="menu-icon"
                onError={(e) => (e.currentTarget.src = userplaylist)}
                className="mr-4 h-[35px] w-[35px] rounded-md shadow-md shadow-black xl:mr-6"
              />
              <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
                {playlist.name}
              </p>
            </Link>
          ))}
          {userPlaylists.map((playlist: UserPlaylist) => (
            <Link
              to={`/userplaylists/${playlist.id}`}
              key={playlist.id}
              className="flex h-[50px] w-full flex-shrink-0 items-center justify-start p-2 py-1 hover:bg-neutral-900"
            >
              <img
                src={userplaylist}
                alt="menu-icon"
                className="mr-4 h-[35px] w-[35px] rounded-md bg-emerald-500 shadow-md shadow-black xl:mr-6"
              />
              <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
                {playlist.name}
              </p>
            </Link>
          ))}
        </div>
        <div className="mb-16 flex w-full items-center justify-start p-3">
          <img
            src={status ? online : offline}
            alt="menu-icon"
            className="mr-4 h-[28px] w-[28px] xl:mr-6"
          />
          <p
            className={`hidden ${
              status ? "text-white" : "text-neutral-500"
            } text-sm sm:block`}
          >
            {status ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
