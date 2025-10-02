import {
  memo,
  Suspense,
  useEffect,
  useRef,
  useMemo,
  startTransition,
} from "react";
import { useParams } from "react-router-dom";
import { getAlbumData } from "../../api/requests";
import Song from "../../components/Song/Song";
import { useBoundStore } from "../../store/store";
import {
  AlbumById,
  Image,
  LocalLibrary,
  TrackDetails,
} from "../../types/GlobalTypes";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import addAlbum from "../../assets/svgs/icons8-addplaylist-28.svg";
import addedToAlbum from "../../assets/svgs/tick.svg";
import ListLoading from "../Playlist/Loading";
import { useQuery } from "@tanstack/react-query";
import RouteNav from "../../components/RouteNav/RouteNav";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";
import { animateScreen } from "../../helpers/animateScreen";
import { cleanString } from "../../helpers/cleanString";

export default function AlbumPage() {
  const { id } = useParams();
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const albumEl = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["albumPage", id],
    queryFn: () => id && getAlbumData(id),
    enabled: !!id,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  function handleImageLoad() {
    animateScreen(albumEl);
  }

  useEffect(() => {
    if (queue && queue.songs) setNowPlaying(queue.songs[0]);
  }, [queue]);

  return (
    <Suspense fallback={<ListLoading />}>
      <div
        data-testid="album-page"
        ref={albumEl}
        className="home-fadeout h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth pb-20 duration-200 ease-in"
      >
        <div className="relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 p-3 sm:h-[223px] sm:px-4">
          <div className="absolute right-2 top-2 h-auto w-auto">
            <RouteNav />
          </div>
          <AlbumInfo
            images={data ? data.image : []}
            name={data ? data.name : "Unknown Album"}
            handleImageLoad={handleImageLoad}
          />
          <div className="flex h-auto w-full items-center justify-between sm:mt-2">
            <AlbumCount
              primaryArtists={data ? data.primaryArtists : "Unknown Artist"}
              songCount={data ? data.songCount : 0}
            />
            <AlbumControls album={data} />
          </div>
        </div>
        <AlbumTracks songs={data ? data.songs : []} />
      </div>
    </Suspense>
  );
}

const AlbumControls = memo(({ album }: { album: AlbumById }) => {
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const albums = useBoundStore((state) => state.favorites.albums);
  const libraryAlbums = useBoundStore((state) => state.library.albums);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setFavoriteAlbum = useBoundStore((state) => state.setFavoriteAlbum);
  const removeFavoriteAlbum = useBoundStore(
    (state) => state.removeFavoriteAlbum,
  );
  const setLibraryAlbum = useBoundStore((state) => state.setLibraryAlbum);
  const removeLibraryAlbum = useBoundStore((state) => state.removeLibraryAlbum);
  const setQueue = useBoundStore((state) => state.setQueue);
  const inQueue = queue?.id === album?.id;
  const isAdded = useMemo(() => {
    return libraryAlbums?.some((a) => a.id === album?.id);
  }, [libraryAlbums]);
  const isFavorite = useMemo(
    () => albums?.some((a: AlbumById) => a.id === album?.id),
    [albums],
  );
  const isAlbumPlaying = isPlaying && queue?.id === album?.id;

  const handleAlbum = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (isAdded) {
      album && removeLibraryAlbum(album.id);
    } else {
      album && setLibraryAlbum(album);
    }
  };

  const handleFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (album !== null) {
      if (isFavorite) {
        removeFavoriteAlbum(album.id);
      } else {
        setFavoriteAlbum(album);
      }
    }
  };

  useEffect(() => {
    const localSaves = localStorage.getItem("local-library");
    if (localSaves !== null) {
      const { albums }: LocalLibrary = JSON.parse(localSaves);
      albums?.forEach(setFavoriteAlbum);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage("local-favorites", {
      albums,
    });
    saveToLocalStorage("local-library", {
      libraryAlbums,
    });
  }, [albums, libraryAlbums]);

  return (
    <div
      data-testid="album-controls"
      className="mr-1 flex w-[170px] items-center justify-between sm:mr-0"
    >
      <button
        type="button"
        title="shuffle-button"
        tabIndex={0}
        aria-label={isShuffling ? "Disable shuffle" : "Enable shuffle"}
        onClick={() => setIsShuffling(!isShuffling)}
        className="-mr-1 border border-white bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 24 24"
          fill="none"
          className="h-8 w-8 bg-transparent"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
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
        data-testid="add-btn"
        type="button"
        tabIndex={0}
        aria-label={isAdded ? "Remove from Library" : "Add to Library"}
        onClick={handleAlbum}
        className="border border-white bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          data-testid="add-icon"
          src={isAdded ? addedToAlbum : addAlbum}
          alt={isAdded ? "Added to library" : "Add to library"}
          className="h-6 w-6"
          aria-hidden="true"
        />
      </button>
      <button
        data-testid="album-favorite-btn"
        type="button"
        tabIndex={0}
        aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        onClick={handleFavorite}
        className="border border-white bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          data-testid="favorite-icon"
          src={isFavorite ? favorited : favorite}
          alt={isFavorite ? "Favorited" : "Favorite"}
          className="h-7 w-7"
          aria-hidden="true"
        />
      </button>
      <button
        data-testid="album-playback"
        type="button"
        tabIndex={album ? 0 : -1}
        aria-label={isAlbumPlaying ? "Pause album" : "Play album"}
        onClick={(e) =>
          album &&
          handleCollectionPlayback(
            e,
            album,
            startTransition,
            isPlaying,
            inQueue,
            setQueue,
            setNowPlaying,
            setIsPlaying,
          )
        }
        className="rounded-full bg-emerald-400 p-1 focus:ring-4 focus:ring-black"
        disabled={!album}
      >
        <img
          data-testid="album-playback-icon"
          src={isAlbumPlaying ? pause : play}
          alt={isAlbumPlaying ? "Pause" : "Play"}
          className="h-7 w-7"
          aria-hidden="true"
        />
      </button>
    </div>
  );
});
AlbumControls.displayName = "AlbumControls";

const AlbumInfo = memo(
  ({
    images,
    name,
    handleImageLoad,
  }: {
    images: Image[];
    name: string;
    handleImageLoad: () => void;
  }) => {
    const imgEl = useRef<HTMLImageElement>(null);
    const titleEl = useRef<HTMLParagraphElement>(null);
    const getAlbumImage = () => {
      if (images) {
        const obj = images.find((img) => img.quality === "150x150");
        if (obj) return obj.url;
      }
    };

    useEffect(() => {
      imgEl.current?.classList.remove("image-fadeout");
      titleEl.current?.classList.remove("song-fadeout");
      imgEl.current?.classList.add("image-fadein");
      titleEl.current?.classList.add("song-fadein");
    }, []);

    return (
      <div
        data-testid="album-info"
        className="flex h-auto w-full flex-col items-start justify-start pt-1 sm:flex-row sm:items-center"
      >
        <img
          ref={imgEl}
          src={getAlbumImage()}
          alt="img"
          data-testid="album-info-image"
          className="image-fadeout mr-4 h-[150px] w-[150px]"
          style={{
            boxShadow: "5px 5px 0px #000",
          }}
          fetchPriority="high"
          loading="eager"
          onLoad={handleImageLoad}
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p
          ref={titleEl}
          className="song-fadeout mb-1 mt-2 line-clamp-1 h-auto w-[60%] text-ellipsis text-left text-base font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold"
        >
          {cleanString(name)}
        </p>
      </div>
    );
  },
);
AlbumInfo.displayName = "AlbumInfo";

const AlbumCount = memo(
  ({
    songCount,
    primaryArtists,
  }: {
    songCount: string;
    primaryArtists: string;
  }) => {
    return (
      <div
        data-testid="album-count"
        className="flex h-full w-[50%] flex-col items-start justify-center sm:w-[320px] sm:justify-start"
      >
        {Number(songCount) > 0 && (
          <p className="text-sm text-neutral-400">{songCount} Tracks</p>
        )}
        {Number(primaryArtists) > 0 && (
          <p className="mr-2 text-sm text-neutral-400">{primaryArtists}</p>
        )}
      </div>
    );
  },
);
AlbumCount.displayName = "AlbumCount";

const AlbumTracks = memo(({ songs }: { songs: TrackDetails[] }) => {
  return (
    <ul className="flex h-auto min-h-[71.5dvh] w-full flex-col items-start justify-start bg-neutral-900 p-3 pb-28 sm:p-4 sm:pb-20">
      {songs ? (
        songs.map((song: TrackDetails, i) => (
          <Song index={i} key={song.id} track={song} isWidgetSong={false} />
        ))
      ) : (
        <p className="m-auto text-xl text-neutral-500">No songs here...T_T</p>
      )}
    </ul>
  );
});
AlbumTracks.displayName = "AlbumTracks";
