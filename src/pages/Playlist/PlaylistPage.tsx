import { memo, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistData } from "../../api/requests";
import { useBoundStore } from "../../store/store";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import addPlaylist from "../../assets/svgs/icons8-addplaylist-28.svg";
import addedToPlaylist from "../../assets/svgs/tick.svg";
import Song from "../../components/Song/Song";
import {
  LocalLibrary,
  PlaylistById,
  TrackDetails,
} from "../../types/GlobalTypes";
import { useQuery } from "@tanstack/react-query";
import ListLoading from "./Loading";
import RouteNav from "../../components/RouteNav/RouteNav";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

export default function PlaylistPage() {
  const { id } = useParams();
  const setPlaylist = useBoundStore((state) => state.setPlaylist);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);

  const { isPending } = useQuery({
    queryKey: ["playlistPage", id],
    queryFn: () => id && getPlaylistData(id),
    select: (data) => setPlaylist(data.data),
  });

  useEffect(() => {
    queue && setNowPlaying(queue.songs[0]);
  }, [queue?.id]);

  return (
    <>
      {!isPending ? (
        <div className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth pb-20">
          <div className="relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 p-3 sm:h-[223px] sm:px-4">
            <div className="absolute right-2 top-2 h-auto w-auto">
              <RouteNav />
            </div>
            <PlaylistInfo />
            <div className="flex h-auto w-full items-center justify-between sm:mt-2">
              <PlaylistCount />
              <PlaylistControls id={id || ""} />
            </div>
          </div>
          <PlaylistTracks />
        </div>
      ) : (
        <ListLoading />
      )}
    </>
  );
}

const PlaylistControls = memo(({ id }: { id: string }) => {
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const playlists = useBoundStore((state) => state.favorites.playlists);
  const libraryPlaylists = useBoundStore((state) => state.library.playlists);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const playlist = useBoundStore((state) => state.playlist);
  const setFavoritePlaylist = useBoundStore(
    (state) => state.setFavoritePlaylist,
  );
  const removeFavoritePlaylist = useBoundStore(
    (state) => state.removeFavoritePlaylist,
  );
  const setLibraryPlaylist = useBoundStore((state) => state.setLibraryPlaylist);
  const removeLibraryPlaylist = useBoundStore(
    (state) => state.removeLibraryPlaylist,
  );
  const setQueue = useBoundStore((state) => state.setQueue);
  const isAdded = useMemo(
    () => libraryPlaylists.some((playlist) => playlist?.id === id),
    [libraryPlaylists],
  );
  const isFavorite = useMemo(
    () => playlists.some((playlist: PlaylistById) => playlist?.id === id),
    [playlists],
  );
  const isPlaylistPlaying = isPlaying && queue?.id === id;

  const handlePlaylist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (isAdded) {
      id && removeLibraryPlaylist(id);
    } else {
      playlist && setLibraryPlaylist(playlist);
    }
  };

  const handleFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (playlist !== null) {
      if (isFavorite) {
        removeFavoritePlaylist(playlist.id);
      } else {
        setFavoritePlaylist(playlist);
      }
    }
  };

  useEffect(() => {
    const localSaves = localStorage.getItem("local-library");
    if (localSaves !== null) {
      const { playlists }: LocalLibrary = JSON.parse(localSaves);
      playlists?.forEach(setLibraryPlaylist);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage("local-favorites", {
      playlists,
    });
    saveToLocalStorage("local-library", {
      playlists: libraryPlaylists,
    });
  }, [playlists, libraryPlaylists]);

  return (
    <div className="mr-1 flex w-[170px] items-center justify-between sm:mr-0">
      <button
        type="button"
        title="shuffle-button"
        onClick={() => setIsShuffling(!isShuffling)}
        className="-mr-1 border border-white bg-transparent p-0"
      >
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 24 24"
          fill="none"
          className="-mt-[1px] h-8 w-8 bg-transparent sm:-mt-0.5 sm:h-9 sm:w-9"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M16.4697 9.46967C16.1768 9.76256 16.1768 10.2374 16.4697 10.5303C16.7626 10.8232 17.2374 10.8232 17.5303 10.5303L16.4697 9.46967ZM19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967C19.2374 7.17678 18.7626 7.17678 18.4697 7.46967L19.5303 8.53033ZM18.4697 8.53033C18.7626 8.82322 19.2374 8.82322 19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967L18.4697 8.53033ZM17.5303 5.46967C17.2374 5.17678 16.7626 5.17678 16.4697 5.46967C16.1768 5.76256 16.1768 6.23744 16.4697 6.53033L17.5303 5.46967ZM19 8.75C19.4142 8.75 19.75 8.41421 19.75 8C19.75 7.58579 19.4142 7.25 19 7.25V8.75ZM16.7 8L16.6993 8.75H16.7V8ZM12.518 10.252L13.1446 10.6642L13.1446 10.6642L12.518 10.252ZM10.7414 11.5878C10.5138 11.9338 10.6097 12.3989 10.9558 12.6266C11.3018 12.8542 11.7669 12.7583 11.9946 12.4122L10.7414 11.5878ZM11.9946 12.4122C12.2222 12.0662 12.1263 11.6011 11.7802 11.3734C11.4342 11.1458 10.9691 11.2417 10.7414 11.5878L11.9946 12.4122ZM10.218 13.748L9.59144 13.3358L9.59143 13.3358L10.218 13.748ZM6.041 16V16.75H6.04102L6.041 16ZM5 15.25C4.58579 15.25 4.25 15.5858 4.25 16C4.25 16.4142 4.58579 16.75 5 16.75V15.25ZM11.9946 11.5878C11.7669 11.2417 11.3018 11.1458 10.9558 11.3734C10.6097 11.6011 10.5138 12.0662 10.7414 12.4122L11.9946 11.5878ZM12.518 13.748L13.1446 13.3358L13.1446 13.3358L12.518 13.748ZM16.7 16V15.25H16.6993L16.7 16ZM19 16.75C19.4142 16.75 19.75 16.4142 19.75 16C19.75 15.5858 19.4142 15.25 19 15.25V16.75ZM10.7414 12.4122C10.9691 12.7583 11.4342 12.8542 11.7802 12.6266C12.1263 12.3989 12.2222 11.9338 11.9946 11.5878L10.7414 12.4122ZM10.218 10.252L9.59143 10.6642L9.59144 10.6642L10.218 10.252ZM6.041 8L6.04102 7.25H6.041V8ZM5 7.25C4.58579 7.25 4.25 7.58579 4.25 8C4.25 8.41421 4.58579 8.75 5 8.75V7.25ZM17.5303 13.4697C17.2374 13.1768 16.7626 13.1768 16.4697 13.4697C16.1768 13.7626 16.1768 14.2374 16.4697 14.5303L17.5303 13.4697ZM18.4697 16.5303C18.7626 16.8232 19.2374 16.8232 19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697L18.4697 16.5303ZM19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697C19.2374 15.1768 18.7626 15.1768 18.4697 15.4697L19.5303 16.5303ZM16.4697 17.4697C16.1768 17.7626 16.1768 18.2374 16.4697 18.5303C16.7626 18.8232 17.2374 18.8232 17.5303 18.5303L16.4697 17.4697ZM17.5303 10.5303L19.5303 8.53033L18.4697 7.46967L16.4697 9.46967L17.5303 10.5303ZM19.5303 7.46967L17.5303 5.46967L16.4697 6.53033L18.4697 8.53033L19.5303 7.46967ZM19 7.25H16.7V8.75H19V7.25ZM16.7007 7.25C14.7638 7.24812 12.956 8.22159 11.8914 9.8398L13.1446 10.6642C13.9314 9.46813 15.2676 8.74861 16.6993 8.75L16.7007 7.25ZM11.8914 9.83979L10.7414 11.5878L11.9946 12.4122L13.1446 10.6642L11.8914 9.83979ZM10.7414 11.5878L9.59144 13.3358L10.8446 14.1602L11.9946 12.4122L10.7414 11.5878ZM9.59143 13.3358C8.80541 14.5306 7.47115 15.25 6.04098 15.25L6.04102 16.75C7.97596 16.7499 9.78113 15.7767 10.8446 14.1602L9.59143 13.3358ZM6.041 15.25H5V16.75H6.041V15.25ZM10.7414 12.4122L11.8914 14.1602L13.1446 13.3358L11.9946 11.5878L10.7414 12.4122ZM11.8914 14.1602C12.956 15.7784 14.7638 16.7519 16.7007 16.75L16.6993 15.25C15.2676 15.2514 13.9314 14.5319 13.1446 13.3358L11.8914 14.1602ZM16.7 16.75H19V15.25H16.7V16.75ZM11.9946 11.5878L10.8446 9.83979L9.59144 10.6642L10.7414 12.4122L11.9946 11.5878ZM10.8446 9.8398C9.78113 8.2233 7.97596 7.25005 6.04102 7.25L6.04098 8.75C7.47115 8.75004 8.80541 9.46939 9.59143 10.6642L10.8446 9.8398ZM6.041 7.25H5V8.75H6.041V7.25ZM16.4697 14.5303L18.4697 16.5303L19.5303 15.4697L17.5303 13.4697L16.4697 14.5303ZM18.4697 15.4697L16.4697 17.4697L17.5303 18.5303L19.5303 16.5303L18.4697 15.4697Z"
              fill="currentColor"
              className={`${isShuffling ? "fill-emerald-500" : "fill-white"} ease duration-250 transition-colors`}
            />
          </g>
        </svg>
      </button>
      <button
        type="button"
        onClick={handlePlaylist}
        className="border border-white bg-transparent p-0"
      >
        <img
          src={isAdded ? addedToPlaylist : addPlaylist}
          alt="add-to-playlist"
          className="h-6 w-6"
        />
      </button>
      <button
        type="button"
        onClick={handleFavorite}
        className="border border-white bg-transparent p-0"
      >
        <img
          src={isFavorite ? favorited : favorite}
          alt="favorite"
          className="h-[28px] w-[28px]"
        />
      </button>
      <button
        type="button"
        onClick={(e) =>
          playlist &&
          handleCollectionPlayback(
            e,
            playlist,
            isPlaying,
            setQueue,
            setNowPlaying,
            setIsPlaying,
          )
        }
        className="rounded-full bg-emerald-400 p-1"
      >
        <img
          src={isPlaylistPlaying ? pause : play}
          alt="play"
          className="h-7 w-7"
        />
      </button>
    </div>
  );
});
PlaylistControls.displayName = "PlaylistControls";

const PlaylistInfo = memo(() => {
  const images = useBoundStore((state) => state.playlist?.image);
  const name = useBoundStore((state) => state.playlist?.name);

  const getPlaylistImage = () => {
    if (images) {
      const obj = images.find((img) => img.quality === "150x150");
      return obj?.url;
    }
    return fallback;
  };

  return (
    <div className="flex h-auto w-full flex-col items-start justify-start pt-1 sm:flex-row sm:items-center">
      <img
        src={getPlaylistImage()}
        alt="img"
        className="mr-4 h-[150px] w-[150px]"
        style={{
          boxShadow: "5px 5px 0px #000",
        }}
        fetchPriority="high"
        loading="eager"
        onError={(e) => (e.currentTarget.src = fallback)}
      />
      <p className="text-md mb-1 mt-2 line-clamp-1 h-auto w-[60%] text-ellipsis text-left text-xl font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
        {name}
      </p>
    </div>
  );
});
PlaylistInfo.displayName = "PlaylistAlbumInfo";

const PlaylistCount = memo(() => {
  const songCount = useBoundStore((state) => state.playlist?.songCount);
  const followerCount = useBoundStore((state) => state.playlist?.followerCount);

  return (
    <div className="flex h-full w-[50%] flex-col items-start justify-center sm:w-[320px] sm:justify-start">
      <p className="mr-2 text-sm text-neutral-400">{followerCount} Followers</p>
      <p className="text-sm text-neutral-400">{songCount} Tracks</p>
    </div>
  );
});
PlaylistCount.displayName = "PlaylistAlbumCount";

const PlaylistTracks = memo(() => {
  const songs = useBoundStore((state) => state.playlist?.songs);

  return (
    <ul className="flex h-auto min-h-[71.5dvh] w-full flex-col items-start justify-start bg-neutral-900 px-3 py-2 pb-28 sm:pb-20">
      {songs ? (
        songs.map((song: TrackDetails) => (
          <Song key={song.id} track={song} isWidgetSong={false} />
        ))
      ) : (
        <p className="m-auto text-xl text-neutral-500">No songs here...T_T</p>
      )}
    </ul>
  );
});
PlaylistTracks.displayName = "PlaylistTracks";
