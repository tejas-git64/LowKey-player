import RouteNav from "../../components/RouteNav/RouteNav";
import Song from "../../components/Song/Song";
import { useBoundStore } from "../../store/store";
import { AlbumById, PlaylistById, TrackDetails } from "../../types/GlobalTypes";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import favoritesImg from "../../assets/images/favorites.webp";
import { useNavigate } from "react-router-dom";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import close from "../../assets/svgs/close.svg";
import { memo, startTransition, useEffect, useMemo, useRef } from "react";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";
import { animateScreen } from "../../helpers/animateScreen";
import useClearTimer from "../../hooks/useClearTimer";

export default function Favorites() {
  const albums = useBoundStore((state) => state.favorites.albums);
  const playlists = useBoundStore((state) => state.favorites.playlists);
  const songs = useBoundStore((state) => state.favorites.songs);
  const favEl = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    saveToLocalStorage("local-favorites", {
      albums,
      playlists,
      songs,
    });
  }, [albums, playlists, songs]);

  useClearTimer(timerRef);
  useEffect(() => {
    timerRef.current = animateScreen(favEl);
  }, []);

  return (
    <div
      data-testid="favorites-page"
      ref={favEl}
      className="home-fadeout h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth pb-20 duration-200 ease-in"
    >
      <div className="relative flex h-[210px] w-full items-end justify-between border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 px-4 pb-3 sm:h-fit sm:py-5">
        <div className="absolute right-2 top-2 h-auto w-auto">
          <RouteNav />
        </div>
        <div className="flex h-auto w-full flex-col items-start justify-start sm:flex-row sm:items-center">
          <img
            src={favoritesImg}
            alt="img"
            style={{
              boxShadow: "5px 5px 0px #000",
            }}
            fetchPriority="high"
            loading="eager"
            className="mr-4 h-[150px] w-[150px]"
          />
          <p className="mt-1 line-clamp-1 h-auto w-[80%] text-ellipsis text-left text-xl font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
            Favorites
          </p>
        </div>
        <FavoriteControls />
      </div>
      {albums.length === 0 && playlists.length === 0 && songs.length === 0 ? (
        <div
          data-testid="no-favorites"
          className="flex min-h-[70dvh] w-full items-center justify-center bg-neutral-900"
        >
          <p className="font-normal text-neutral-500">No favorites added</p>
        </div>
      ) : (
        <div className="h-auto min-h-[80dvh] w-full bg-neutral-900">
          {songs.length > 0 ? <FavoriteSongs /> : null}
          {albums.length > 0 ? <FavoriteAlbums /> : null}
          {playlists.length > 0 ? <FavoritePlaylists /> : null}
        </div>
      )}
    </div>
  );
}

const FavoriteControls = memo(() => {
  const favorites = useBoundStore((state) => state.favorites);
  const setFavoriteAlbum = useBoundStore((state) => state.setFavoriteAlbum);
  const setFavoritePlaylist = useBoundStore(
    (state) => state.setFavoritePlaylist,
  );
  const queueSongs = useBoundStore((state) => state.nowPlaying.queue?.songs);
  const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
  const id = useBoundStore((state) => state.nowPlaying.track?.id);
  const setQueue = useBoundStore((state) => state.setQueue);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const inQueue = useMemo(
    () => favorites.songs.some((song) => queueSongs?.includes(song)),
    [favorites.songs, queueSongs],
  );
  const isFavoritePlaying =
    isPlaying && favorites.songs?.some((song) => song.id === id);
  const shuffleStatus = isShuffling ? "fill-emerald-500" : "fill-white";

  const favoriteCollection = {
    id: "",
    name: "Favorites",
    image: false,
    songs: favorites.songs,
  };

  type LocalFavorites = {
    albums: AlbumById[];
    playlists: PlaylistById[];
    songs: TrackDetails[];
  };

  useEffect(() => {
    const localSaved = localStorage.getItem("local-favorites");
    if (localSaved !== null) {
      const { albums, playlists, songs }: LocalFavorites =
        JSON.parse(localSaved);
      for (const a of albums || []) {
        setFavoriteAlbum(a);
      }
      for (const p of playlists || []) {
        setFavoritePlaylist(p);
      }
      for (const s of songs || []) {
        setFavoriteSong(s);
      }
    }
  }, [setFavoriteAlbum, setFavoritePlaylist, setFavoriteSong]);

  return (
    <div
      data-testid="favorite-controls"
      className="mb-0 flex w-[120px] items-center justify-between sm:w-[105px]"
    >
      <button
        type="button"
        tabIndex={0}
        title="Shuffle button"
        aria-label={isShuffling ? "Disable shuffle" : "Enable shuffle"}
        onClick={() => setIsShuffling(!isShuffling)}
        className="border border-white bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 24 24"
          fill="none"
          className="h-10 w-10 bg-transparent sm:mt-0 sm:h-10 sm:w-10"
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
              data-testid="svg-color"
              className={`${isFavoritePlaying ? shuffleStatus : "fill-neutral-500"} ease duration-250 transition-colors`}
            />
          </g>
        </svg>
      </button>
      <button
        type="button"
        tabIndex={favorites.songs.length > 0 ? 0 : -1}
        title="Play button"
        aria-label={isFavoritePlaying ? "Pause favorites" : "Play favorites"}
        onClick={(e) =>
          handleCollectionPlayback(
            e,
            favoriteCollection,
            startTransition,
            isPlaying,
            inQueue,
            setQueue,
            setNowPlaying,
            setIsPlaying,
          )
        }
        className="flex-shrink-0 rounded-full bg-emerald-400 p-1 focus:outline-none focus:ring-4 focus:ring-black"
        disabled={favorites.songs.length === 0}
      >
        <img
          src={isFavoritePlaying ? pause : play}
          alt={isFavoritePlaying ? "Pause" : "Play"}
          className="h-8 w-8"
          aria-hidden="true"
        />
      </button>
    </div>
  );
});
FavoriteControls.displayName = "FavoriteControls";

const FavoriteAlbums = memo(() => {
  const albums = useBoundStore((state) => state.favorites.albums);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);

  useEffect(() => {
    if (queue !== null) setNowPlaying(queue.songs[0]);
  }, [queue, setNowPlaying]);

  return (
    <div data-testid="favorite-albums" className="h-auto w-full">
      {albums && albums.length > 0 && (
        <>
          <h2 className="p-4 py-2 font-semibold text-white">Albums</h2>
          <div className="flex h-[200px] max-h-fit w-full list-none overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
            {albums.map((album: AlbumById, i) => (
              <FavoriteAlbum
                key={album.id}
                i={i}
                album={album}
                setNowPlaying={setNowPlaying}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
FavoriteAlbums.displayName = "FavoriteAlbums";

const FavoriteAlbum = ({
  album,
  i,
  setNowPlaying,
}: {
  album: AlbumById;
  i: number;
  setNowPlaying: (data: TrackDetails | null) => void;
}) => {
  const navigate = useNavigate();
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const removeFavoriteAlbum = useBoundStore(
    (state) => state.removeFavoriteAlbum,
  );
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setQueue = useBoundStore((state) => state.setQueue);
  const albumImgEl = useRef<HTMLImageElement>(null);
  const inQueue = useMemo(
    () => queue !== null && queue.name === album.name,
    [album.name, queue],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      albumImgEl.current?.classList.remove("image-fadeout");
      albumImgEl.current?.classList.add("image-fadein");
    }, i * 50);
    return () => {
      clearTimeout(timer);
    };
  }, [i]);

  return (
    <div
      tabIndex={0}
      key={album.id}
      data-testid="favorite-album"
      onClick={() => navigate(`/albums/${album.id}`)}
      role="link"
      className="group relative mr-4 flex h-[180px] w-[150px] flex-shrink-0 flex-col items-center bg-transparent outline-none"
      aria-label={`Go to album ${album.name}`}
    >
      <div className="h-[150px] w-[150px] overflow-hidden">
        <img
          ref={albumImgEl}
          src={album.image[1]?.url || fallback}
          alt="album-image"
          width={150}
          height={150}
          className="image-fadeout scale-105 shadow-xl shadow-neutral-950 transition-transform duration-200 ease-in group-hover:scale-100 group-focus:scale-100"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
      </div>
      <p className="mt-1 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400 transition-colors group-hover:text-white group-focus:text-white">
        {album.name}
      </p>
      <div className="absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent opacity-0 transition-all ease-in group-hover:opacity-100 group-focus:opacity-100">
        <button
          type="button"
          tabIndex={0}
          data-testid="album-play-btn"
          className="rounded-full bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={
            isPlaying && album.name === queue?.name
              ? "Pause album"
              : "Play album"
          }
          onClick={(e) => {
            e.stopPropagation();
            handleCollectionPlayback(
              e,
              album,
              startTransition,
              isPlaying,
              inQueue,
              setQueue,
              setNowPlaying,
              setIsPlaying,
            );
          }}
        >
          <img
            src={isPlaying && album.name === queue?.name ? pause : play}
            alt={isPlaying && album.name === queue?.name ? "Pause" : "Play"}
            className="h-12 w-12 p-2"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          tabIndex={0}
          data-testid="album-remove-btn"
          className="ml-2 h-auto w-auto rounded-full bg-white p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={`Remove album ${album.name} from favorites`}
          onClick={(e) => {
            e.stopPropagation();
            removeFavoriteAlbum(album.id);
          }}
        >
          <img src={close} alt="remove" className="h-6 w-6 rounded-full p-1" />
        </button>
      </div>
    </div>
  );
};

const FavoritePlaylists = memo(() => {
  const playlists = useBoundStore((state) => state.favorites.playlists);

  return (
    <div data-testid="favorite-playlists" className="h-auto w-full">
      {playlists && playlists.length > 0 && (
        <>
          <h2 className="p-4 py-2 font-semibold text-white">Playlists</h2>
          <div className="flex h-[200px] max-h-fit w-full list-none overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
            {playlists.map((playlist: PlaylistById, i) => (
              <FavoritePlaylist key={playlist.id} i={i} playlist={playlist} />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
FavoritePlaylists.displayName = "FavoritePlaylists";

const FavoritePlaylist = ({
  i,
  playlist,
}: {
  i: number;
  playlist: PlaylistById;
}) => {
  const navigate = useNavigate();
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setQueue = useBoundStore((state) => state.setQueue);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const inQueue = useMemo(
    () => queue !== null && queue.name === playlist.name,
    [playlist.name, queue],
  );
  const removeFavoritePlaylist = useBoundStore(
    (state) => state.removeFavoritePlaylist,
  );
  const playlistImgEl = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      playlistImgEl.current?.classList.remove("image-fadeout");
      playlistImgEl.current?.classList.add("image-fadein");
    }, i * 50);
    return () => {
      clearTimeout(timer);
    };
  }, [i]);

  return (
    <div
      key={playlist.id}
      tabIndex={0}
      onClick={() => navigate(`/albums/${playlist.id}`)}
      role="link"
      data-testid="favorite-playlist"
      className="group relative mr-4 flex h-[180px] w-[150px] flex-shrink-0 flex-col items-center bg-transparent outline-none"
      aria-label={`Go to playlist ${playlist.name}`}
    >
      <div className="h-[150px] w-[150px] overflow-hidden">
        <img
          src={playlist.image[1]?.url || fallback}
          alt="playlist-image"
          width={150}
          height={150}
          className="image-fadein h-full w-full scale-105 shadow-xl shadow-neutral-950 brightness-100 transition-all duration-200 ease-in group-hover:scale-100 group-hover:brightness-95 group-focus:scale-100 group-focus:brightness-75"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
      </div>
      <p className="mt-1 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400 transition-colors group-hover:text-white group-focus:text-white">
        {playlist.name}
      </p>
      <div className="absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent opacity-0 transition-all ease-in group-hover:opacity-100 group-focus:opacity-100">
        <button
          type="button"
          tabIndex={0}
          data-testid="playlist-play-btn"
          className="rounded-full bg-emerald-400 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={
            isPlaying && playlist.name === queue?.name
              ? "Pause playlist"
              : "Play playlist"
          }
          onClick={(e) => {
            e.stopPropagation();
            handleCollectionPlayback(
              e,
              playlist,
              startTransition,
              isPlaying,
              inQueue,
              setQueue,
              setNowPlaying,
              setIsPlaying,
            );
          }}
        >
          <img
            src={isPlaying && playlist.name === queue?.name ? pause : play}
            alt={isPlaying && playlist.name === queue?.name ? "Pause" : "Play"}
            className="h-8 w-8"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          tabIndex={0}
          data-testid="playlist-remove-btn"
          className="ml-2 rounded-full bg-white p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={`Remove playlist ${playlist.name} from favorites`}
          onClick={(e) => {
            e.stopPropagation();
            removeFavoritePlaylist(playlist.id);
          }}
        >
          <img
            src={close}
            alt="remove"
            className="h-[28px] w-[28px] rounded-full p-1.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

const FavoriteSongs = memo(() => {
  const songs = useBoundStore((state) => state.favorites.songs);

  return (
    <>
      {songs && songs.length > 0 && (
        <div data-testid="favorite-songs">
          <h2 className="p-4 py-2 font-semibold text-white">Songs</h2>
          <ul className="flex h-auto max-h-fit w-full flex-col items-start justify-start px-3 py-2">
            {songs.map((song: TrackDetails, i) => (
              <Song index={i} key={song.id} track={song} isWidgetSong={false} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
});
FavoriteSongs.displayName = "FavoriteSongs";
