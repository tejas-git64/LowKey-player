import { memo, useEffect, useRef, useMemo, startTransition } from "react";
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
import favorite from "/svgs/icons8-heart.svg";
import favorited from "/svgs/icons8-favorited.svg";
import fallback from "/fallbacks/playlist-fallback.webp";
import play from "/svgs/play-icon.svg";
import pause from "/svgs/pause-icon.svg";
import addAlbum from "/svgs/icons8-addplaylist-28.svg";
import addedToAlbum from "/svgs/tick.svg";
import ListLoading from "../Playlist/Loading";
import { useQuery } from "@tanstack/react-query";
import RouteNav from "../../components/RouteNav/RouteNav";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";
import { animateScreen } from "../../helpers/animateScreen";
import { cleanString } from "../../helpers/cleanString";
import ShuffleButton from "../../components/ShuffleButton/ShuffleButton";
import useClearTimer from "../../hooks/useClearTimer";
import { preconnect, preload } from "react-dom";

preconnect("https://lowkeymusic-v2.netlify.app");

export default function AlbumPage() {
  const { id } = useParams();
  const albumEl = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["albumPage", id],
    queryFn: () => id && getAlbumData(id),
    enabled: !!id,
    throwOnError: true,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  function handleImageLoad() {
    timerRef.current = animateScreen(albumEl);
  }

  useClearTimer(timerRef);

  return (
    <div
      data-testid="album-page"
      ref={albumEl}
      className="home-fadeout relative h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth pb-20 duration-100 ease-in-out"
    >
      <div
        className={`absolute h-full w-full ${isLoading ? "visible opacity-100" : "invisible opacity-0 duration-100"} ${data ? "invisible delay-100" : "visible"} z-10 transition-opacity ease-in-out`}
      >
        <ListLoading />
      </div>
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
  );
}

const AlbumControls = memo(({ album }: { album: AlbumById }) => {
  const albums = useBoundStore((state) => state.favorites.albums);
  const libraryAlbums = useBoundStore((state) => state.library.albums);
  const setFavoriteAlbum = useBoundStore((state) => state.setFavoriteAlbum);
  const removeFavoriteAlbum = useBoundStore(
    (state) => state.removeFavoriteAlbum,
  );
  const setLibraryAlbum = useBoundStore((state) => state.setLibraryAlbum);
  const removeLibraryAlbum = useBoundStore((state) => state.removeLibraryAlbum);
  const isAdded = useMemo(() => {
    return libraryAlbums?.some((a) => a.id === album?.id);
  }, [libraryAlbums, album]);
  const isFavorite = useMemo(
    () => albums?.some((a: AlbumById) => a.id === album?.id),
    [albums, album],
  );

  const handleAlbum = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (album && isAdded) {
      removeLibraryAlbum(album.id);
    } else {
      setLibraryAlbum(album);
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
      if (albums) {
        for (const a of albums) {
          setFavoriteAlbum(a);
        }
      }
    }
  }, [setFavoriteAlbum]);

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
      <ShuffleButton />
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
      <AlbumPlayButton album={album} />
    </div>
  );
});
AlbumControls.displayName = "AlbumControls";

const AlbumPlayButton = ({ album }: { album: AlbumById }) => {
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setQueue = useBoundStore((state) => state.setQueue);
  const inQueue = queue?.id === album?.id;
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const isAlbumPlaying = isPlaying && queue?.id === album?.id;

  return (
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
  );
};

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
    const obj = images.find((img) => img.quality === "150x150");

    if (obj?.url) {
      preload(obj.url, {
        as: "image",
        fetchPriority: "high",
      });
    }

    const getAlbumImage = () => {
      if (obj) return obj.url;
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
          alt={cleanString(name)}
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
