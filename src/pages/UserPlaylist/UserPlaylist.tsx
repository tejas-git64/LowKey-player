import RouteNav from "../../components/RouteNav/RouteNav";
import playlistfallback from "../../assets/fallbacks/playlist-fallback.webp";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import { useBoundStore } from "../../store/store";
import { useParams } from "react-router-dom";
import {
  LocalLibrary,
  TrackDetails,
  UserPlaylist,
} from "../../types/GlobalTypes";
import Song from "../../components/Song/Song";
import { memo, useEffect, useMemo } from "react";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";

export default function UserPlaylistPage() {
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const setUserPlaylist = useBoundStore((state) => state.setUserPlaylist);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const { id } = useParams();
  const playlist: UserPlaylist | undefined = useMemo(
    () =>
      userPlaylists.find(
        (playlist: UserPlaylist) => playlist.id === Number(id),
      ),
    [userPlaylists],
  );

  useEffect(() => {
    queue && setNowPlaying(queue.songs[0]);
  }, [queue?.id]);

  useEffect(() => {
    const localSaves = localStorage.getItem("local-library");
    if (localSaves !== null) {
      const { userPlaylists }: LocalLibrary = JSON.parse(localSaves);
      const playlist =
        userPlaylists?.find(
          (playlist: UserPlaylist) => playlist.id === Number(id),
        ) ?? null;
      if (playlist !== null) setUserPlaylist(playlist);
    }
  }, []);

  return (
    <>
      <div className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth">
        <div className="relative flex h-[210px] w-full items-end justify-between border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 px-4 py-3 sm:h-fit sm:pb-6 sm:pt-4">
          <div className="absolute right-2 top-2 h-auto w-auto">
            <RouteNav />
          </div>
          {playlist?.name && <UserPlaylistInfo name={playlist.name} />}
          {playlist && <UserPlaylistControls {...playlist} />}
        </div>
        <div className="mx-auto h-auto min-h-[80dvh] w-full bg-neutral-900">
          {playlist?.songs?.length ? (
            <ul className="flex h-auto max-h-fit w-full flex-col items-start justify-start bg-transparent px-4 pb-28 pt-4 sm:pb-20">
              {playlist?.songs.map((song: TrackDetails) => (
                <Song key={song.id} track={song} isWidgetSong={false} />
              ))}
            </ul>
          ) : (
            <p className="m-auto w-full py-40 text-center text-xl text-neutral-400">
              No songs here...T_T
            </p>
          )}
        </div>
      </div>
    </>
  );
}

const UserPlaylistInfo = memo(({ name }: { name: string }) => {
  return (
    <div className="flex h-auto w-full flex-col items-start justify-start sm:flex-row sm:items-center">
      <img
        src={playlistfallback}
        alt="img"
        style={{
          boxShadow: "5px 5px 0px #000",
        }}
        loading="eager"
        fetchPriority="high"
        className="mr-4 mt-1 h-[150px] w-[150px]"
      />
      <p className="mt-1 line-clamp-1 h-auto w-[80%] text-ellipsis text-left text-xl font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
        {name || "Unknown"}
      </p>
    </div>
  );
});
UserPlaylistInfo.displayName = "UserPlaylistInfo";

const UserPlaylistControls = memo(({ id, songs, name }: UserPlaylist) => {
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const queueId = useBoundStore((state) => state.nowPlaying.queue?.id);
  const isPlayable = songs && songs.length > 0;

  const handleKeyDown = () => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCollectionPlayback(
        e,
        {
          id: String(id),
          image: songs[0].image || false,
          name: name,
          songs: songs,
        },
        isPlaying,
        setQueue,
        setNowPlaying,
        setIsPlaying,
      );
    }
  };

  return (
    <div className="flex w-[100px] items-center justify-between">
      <button
        type="button"
        title="Shuffle playlist"
        aria-label={isShuffling ? "Disable shuffle" : "Enable shuffle"}
        aria-pressed={isShuffling}
        tabIndex={0}
        onClick={() => setIsShuffling(!isShuffling)}
        className="-mr-1 bg-transparent p-0 outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 24 24"
          fill="none"
          className="-mt-[1px] h-8 w-8 bg-transparent sm:-mt-0.5 sm:h-9 sm:w-9"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M16.4697 9.46967C16.1768 9.76256 16.1768 10.2374 16.4697 10.5303C16.7626 10.8232 17.2374 10.8232 17.5303 10.5303L16.4697 9.46967ZM19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967C19.2374 7.17678 18.7626 7.17678 18.4697 7.46967L19.5303 8.53033ZM18.4697 8.53033C18.7626 8.82322 19.2374 8.82322 19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967L18.4697 8.53033ZM17.5303 5.46967C17.2374 5.17678 16.7626 5.17678 16.4697 5.46967C16.1768 5.76256 16.1768 6.23744 16.4697 6.53033L17.5303 5.46967ZM19 8.75C19.4142 8.75 19.75 8.41421 19.75 8C19.75 7.58579 19.4142 7.25 19 7.25V8.75ZM16.7 8L16.6993 8.75H16.7V8ZM12.518 10.252L13.1446 10.6642L13.1446 10.6642L12.518 10.252ZM10.7414 11.5878C10.5138 11.9338 10.6097 12.3989 10.9558 12.6266C11.3018 12.8542 11.7669 12.7583 11.9946 12.4122L10.7414 11.5878ZM11.9946 12.4122C12.2222 12.0662 12.1263 11.6011 11.7802 11.3734C11.4342 11.1458 10.9691 11.2417 10.7414 11.5878L11.9946 12.4122ZM10.218 13.748L9.59144 13.3358L9.59143 13.3358L10.218 13.748ZM6.041 16V16.75H6.04102L6.041 16ZM5 15.25C4.58579 15.25 4.25 15.5858 4.25 16C4.25 16.4142 4.58579 16.75 5 16.75V15.25ZM11.9946 11.5878C11.7669 11.2417 11.3018 11.1458 10.9558 11.3734C10.6097 11.6011 10.5138 12.0662 10.7414 12.4122L11.9946 11.5878ZM12.518 13.748L13.1446 13.3358L13.1446 13.3358L12.518 13.748ZM16.7 16V15.25H16.6993L16.7 16ZM19 16.75C19.4142 16.75 19.75 16.4142 19.75 16C19.75 15.5858 19.4142 15.25 19 15.25V16.75ZM10.7414 12.4122C10.9691 12.7583 11.4342 12.8542 11.7802 12.6266C12.1263 12.3989 12.2222 11.9338 11.9946 11.5878L10.7414 12.4122ZM10.218 10.252L9.59143 10.6642L9.59144 10.6642L10.218 10.252ZM6.041 8L6.04102 7.25H6.041V8ZM5 7.25C4.58579 7.25 4.25 7.58579 4.25 8C4.25 8.41421 4.58579 8.75 5 8.75V7.25ZM17.5303 13.4697C17.2374 13.7626 16.7626 13.7626 16.4697 13.4697C16.1768 13.1768 16.1768 12.702 16.4697 12.4091L17.5303 13.4697ZM18.4697 16.5303C18.7626 16.8232 19.2374 16.8232 19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697L18.4697 16.5303ZM19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697C19.2374 15.1768 18.7626 15.1768 18.4697 15.4697L19.5303 16.5303ZM16.4697 17.4697C16.1768 17.7626 16.1768 18.2374 16.4697 18.5303C16.7626 18.8232 17.2374 18.8232 17.5303 18.5303L16.4697 17.4697ZM17.5303 10.5303L19.5303 8.53033L18.4697 7.46967L16.4697 9.46967L17.5303 10.5303ZM19.5303 7.46967L17.5303 5.46967L16.4697 6.53033L18.4697 8.53033L19.5303 7.46967ZM19 7.25H16.7V8.75H19V7.25ZM16.7007 7.25C14.7638 7.24812 12.956 8.22159 11.8914 9.8398L13.1446 10.6642C13.9314 9.46813 15.2676 8.74861 16.6993 8.75L16.7007 7.25ZM11.8914 9.83979L10.7414 11.5878L11.9946 12.4122L13.1446 10.6642L11.8914 9.83979ZM10.7414 11.5878L9.59144 13.3358L10.8446 14.1602L11.9946 12.4122L10.7414 11.5878ZM9.59143 13.3358C8.80541 14.5306 7.47115 15.25 6.04098 15.25L6.04102 16.75C7.97596 16.7499 9.78113 15.7767 10.8446 14.1602L9.59143 13.3358ZM6.041 15.25H5V16.75H6.041V15.25ZM10.7414 12.4122L11.8914 14.1602L13.1446 13.3358L11.9946 11.5878L10.7414 12.4122ZM11.8914 14.1602C12.956 15.7784 14.7638 16.7519 16.7007 16.75L16.6993 15.25C15.2676 15.2514 13.9314 14.5319 13.1446 13.3358L11.8914 14.1602ZM16.7 16.75H19V15.25H16.7V16.75ZM11.9946 11.5878L10.8446 9.83979L9.59144 10.6642L10.7414 12.4122L11.9946 11.5878ZM10.8446 9.8398C9.78113 8.2233 7.97596 7.25005 6.04102 7.25L6.04098 8.75C7.47115 8.75004 8.80541 9.46939 9.59143 10.6642L10.8446 9.8398ZM6.041 7.25H5V8.75H6.041V7.25ZM16.4697 14.5303L18.4697 16.5303L19.5303 15.4697L17.5303 13.4697L16.4697 14.5303ZM18.4697 15.4697L16.4697 17.4697L17.5303 18.5303L19.5303 16.5303L18.4697 15.4697Z"
              fill="currentColor"
              className={`${isShuffling ? "fill-emerald-500" : "fill-white"} ease duration-250 transition-colors`}
            />
          </g>
        </svg>
      </button>
      <button
        type="button"
        title={
          isPlayable
            ? id === Number(queueId) && isPlaying
              ? "Pause playlist"
              : "Play playlist"
            : "No songs to play"
        }
        aria-label={
          isPlayable
            ? id === Number(queueId) && isPlaying
              ? "Pause playlist"
              : "Play playlist"
            : "No songs to play"
        }
        tabIndex={isPlayable ? 0 : -1}
        disabled={!isPlayable}
        onClick={
          isPlayable
            ? (e) =>
                handleCollectionPlayback(
                  e,
                  {
                    id: String(id),
                    image: songs[0].image || false,
                    name: name,
                    songs: songs,
                  },
                  isPlaying,
                  setQueue,
                  setNowPlaying,
                  setIsPlaying,
                )
            : undefined
        }
        onKeyDown={handleKeyDown}
        className="rounded-full bg-emerald-400 p-1 outline-none focus:ring-4 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        <img
          src={id === Number(queueId) && isPlaying ? pause : play}
          alt={
            isPlayable
              ? id === Number(queueId) && isPlaying
                ? "Pause"
                : "Play"
              : "Unavailable"
          }
          className="h-8 w-8"
          aria-hidden="true"
        />
      </button>
    </div>
  );
});
UserPlaylistControls.displayName = "UserPlaylistControls";
