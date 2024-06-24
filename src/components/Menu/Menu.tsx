import { Link } from "react-router-dom";
import home from "../../assets/icons8-home.svg";
import search from "../../assets/icons8-search.svg";
import libraryImg from "../../assets/icons8-library.svg";
import add from "../../assets/icons8-plus.svg";
import heart from "../../assets/icons8-heart.svg";
import online from "../../assets/icons8-online-28.png";
import offline from "../../assets/icons8-offline-28.png";
import { useEffect, useState } from "react";
import { useBoundStore } from "../../store/store";
import { AlbumById, PlaylistById, UserPlaylist } from "../../types/GlobalTypes";
import userplaylist from "../../assets/userplaylist.svg";

export default function Menu() {
  const [status, setStatus] = useState<boolean | null>(null);
  const { library, setRevealCreation, setCreationMenu } = useBoundStore();
  async function checkConnection() {
    try {
      const res = await fetch("https://www.bing.com"); //temporary ping checker
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  function showCreationMenu() {
    setRevealCreation(true);
    setCreationMenu(true);
  }

  useEffect(() => {
    setStatus(window.navigator.onLine);
    async function updateNetworkStatus() {
      const result = await checkConnection();
      setStatus(result);
    }
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  return (
    <div
      id="menu"
      className="hidden h-full max-h-screen overflow-hidden border-r-2 border-black bg-neutral-950 sm:block sm:w-[60px] lg:w-72 xl:w-80 2xl:w-96"
    >
      <div className="flex h-auto w-full flex-col items-start justify-evenly overflow-hidden rounded-l-lg border-l-[3px] border-neutral-950 bg-neutral-800">
        <Link
          to={"/home"}
          className="flex w-full items-center justify-start p-3 hover:bg-neutral-600"
        >
          <img src={home} alt="home" className="mr-4 w-auto xl:mr-6" />
          <p className="hidden text-white sm:block">Home</p>
        </Link>
        <Link
          to={"/search"}
          className="flex w-full items-center justify-start p-3 hover:bg-neutral-600"
        >
          <img src={search} alt="search" className="mr-4 w-auto xl:mr-6" />
          <p className="hidden text-white sm:block">Search</p>
        </Link>
      </div>
      <div className="mt-[3px] flex h-[88.5%] w-full flex-col items-center justify-start overflow-hidden rounded-l-lg border-l-[3px] border-neutral-950 bg-neutral-800 lg:h-[88%]">
        <div className="h-[150px] w-full lg:h-[155px]">
          <Link
            to={"/library"}
            className="flex w-full items-center justify-start p-3 hover:bg-neutral-600"
          >
            <img
              src={libraryImg}
              alt="library"
              className="mr-4 w-auto xl:mr-6"
            />
            <p className="hidden text-white sm:block">Library</p>
          </Link>
          <Link
            to={"/favorites"}
            className="flex w-full items-center justify-start p-3 pl-2.5 hover:bg-neutral-600"
          >
            <img src={heart} alt="favorites" className="mr-4 w-auto xl:mr-6" />
            <p className="hidden text-white sm:block">Favorites</p>
          </Link>
          <div
            role="button"
            className="flex w-full items-center justify-start p-3 py-0 pl-2.5 hover:bg-neutral-600 lg:py-3"
            onClick={showCreationMenu}
          >
            <img src={add} alt="new-playlist" className="mr-4 w-auto xl:mr-6" />
            <p className="hidden text-white sm:block">New Playlist</p>
          </div>
        </div>
        <div className="mt-2 flex h-auto w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden pb-6 lg:ml-0.5 2xl:ml-1">
          {library.albums?.map((album: AlbumById) => (
            <Link
              to={`/albums/${album.id}`}
              key={album.id}
              className="flex h-[50px] w-full flex-shrink-0 items-center justify-start p-2 py-1 hover:bg-neutral-900"
            >
              <img
                src={album.image[0]?.url || ""}
                alt="album"
                onError={(e) => (e.currentTarget.src = userplaylist)}
                className="mr-4 h-[35px] w-[35px] rounded-md shadow-md shadow-black xl:mr-6"
              />
              <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
                {album.name}
              </p>
            </Link>
          ))}
          {library.playlists?.map((playlist: PlaylistById) => (
            <Link
              to={`/playlists/${playlist.id}`}
              key={playlist.id}
              className="flex h-[50px] w-full flex-shrink-0 items-center justify-start p-2 py-1 hover:bg-neutral-900"
            >
              <img
                src={playlist.image[0]?.url || ""}
                alt="playlist"
                onError={(e) => (e.currentTarget.src = userplaylist)}
                className="mr-4 h-[35px] w-[35px] rounded-md shadow-md shadow-black xl:mr-6"
              />
              <p className="line-clamp-1 hidden text-ellipsis whitespace-nowrap text-sm text-neutral-200 sm:block">
                {playlist.name}
              </p>
            </Link>
          ))}
          {library.userPlaylists?.map((playlist: UserPlaylist) => (
            <Link
              to={`/userplaylists/${playlist.id}`}
              key={playlist.id}
              className="flex h-[50px] w-full flex-shrink-0 items-center justify-start p-2 py-1 hover:bg-neutral-900"
            >
              <img
                src={userplaylist}
                alt="userplaylist"
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
            alt="library"
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
