import { memo, startTransition, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistData } from "../../api/requests";
import { useBoundStore } from "../../store/store";
import fallback from "/fallbacks/playlist-fallback.webp";
import favorite from "/svgs/icons8-heart.svg";
import favorited from "/svgs/icons8-favorited.svg";
import play from "/svgs/play-icon.svg";
import pause from "/svgs/pause-icon.svg";
import addPlaylist from "/svgs/icons8-addplaylist-28.svg";
import addedToPlaylist from "/svgs/tick.svg";
import Song from "../../components/Song/Song";
import {
  Image,
  LocalLibrary,
  PlaylistById,
  TrackDetails,
} from "../../types/GlobalTypes";
import { useQuery } from "@tanstack/react-query";
import ListLoading from "./Loading";
import RouteNav from "../../components/RouteNav/RouteNav";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";
import { animateScreen } from "../../helpers/animateScreen";
import { cleanString } from "../../helpers/cleanString";
import ShuffleButton from "../../components/ShuffleButton/ShuffleButton";
import useClearTimer from "../../hooks/useClearTimer";
import { preload } from "react-dom";

export default function PlaylistPage() {
  const { id } = useParams();
  const playEl = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["playlistPage", id],
    queryFn: () => id && getPlaylistData(id),
    enabled: !!id,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  function handleImageLoad() {
    timerRef.current = animateScreen(playEl);
  }

  useClearTimer(timerRef);

  return (
    <div
      data-testid="playlist-page"
      ref={playEl}
      className="home-fadeout relative h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth pb-20 duration-100 ease-in-out"
    >
      <div
        className={`absolute h-full w-full ${isLoading ? "opacity-100" : "opacity-0 duration-100"} ${data ? "invisible delay-100" : "visible"} z-10 transition-opacity ease-in-out`}
      >
        <ListLoading />
      </div>
      <div className="relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 p-3 sm:h-[223px] sm:p-4">
        <div className="absolute right-2 top-2 h-auto w-auto">
          <RouteNav />
        </div>
        <PlaylistInfo
          images={data?.image}
          name={data?.name}
          handleImageLoad={handleImageLoad}
        />
        <div className="flex h-auto w-full items-center justify-between sm:mt-2">
          <PlaylistCount
            followerCount={data?.followerCount}
            songCount={data?.songCount}
          />
          <PlaylistControls playlist={data} />
        </div>
      </div>
      <PlaylistTracks songs={data?.songs} />
    </div>
  );
}

const PlaylistControls = memo(({ playlist }: { playlist: PlaylistById }) => {
  const playlists = useBoundStore((state) => state.favorites.playlists);
  const libraryPlaylists = useBoundStore((state) => state.library.playlists);
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
  const isAdded = useMemo(
    () => libraryPlaylists.some((p) => p?.id === playlist?.id),
    [libraryPlaylists, playlist],
  );
  const isFavorite = useMemo(
    () => playlists.some((p: PlaylistById) => p.id === playlist?.id),
    [playlist, playlists],
  );

  const handlePlaylist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (playlist && isAdded) {
      removeLibraryPlaylist(playlist.id);
    } else {
      setLibraryPlaylist(playlist);
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
      if (playlists) {
        for (const p of playlists) {
          setLibraryPlaylist(p);
        }
      }
    }
  }, [setLibraryPlaylist]);

  useEffect(() => {
    saveToLocalStorage("local-favorites", {
      playlists,
    });
    saveToLocalStorage("local-library", {
      playlists: libraryPlaylists,
    });
  }, [playlists, libraryPlaylists]);

  return (
    <div
      data-testid="playlist-controls"
      className="mr-1 flex w-[170px] items-center justify-between sm:mr-0"
    >
      <ShuffleButton />
      <button
        data-testid="add-btn"
        type="button"
        tabIndex={0}
        aria-label={isAdded ? "Remove from Library" : "Add to Library"}
        onClick={handlePlaylist}
        className="border border-white bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <img
          data-testid="add-icon"
          src={isAdded ? addedToPlaylist : addPlaylist}
          alt={isAdded ? "Added to library" : "Add to library"}
          className="h-6 w-6"
          aria-hidden="true"
        />
      </button>
      <button
        data-testid="playlist-favorite-btn"
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
          className="h-[28px] w-[28px]"
          aria-hidden="true"
        />
      </button>
      <PlaylistPlayButton playlist={playlist} />
    </div>
  );
});
PlaylistControls.displayName = "PlaylistControls";

const PlaylistPlayButton = ({ playlist }: { playlist: PlaylistById }) => {
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setQueue = useBoundStore((state) => state.setQueue);
  const inQueue = queue?.id === playlist?.id;
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const isPlaylistPlaying = isPlaying && queue?.name === playlist?.name;
  return (
    <button
      type="button"
      data-testid="playlist-playback"
      tabIndex={playlist ? 0 : -1}
      aria-label={isPlaylistPlaying ? "Pause playlist" : "Play playlist"}
      onClick={(e) =>
        playlist &&
        handleCollectionPlayback(
          e,
          playlist,
          startTransition,
          isPlaying,
          inQueue,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        )
      }
      className="rounded-full bg-emerald-400 p-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-black"
      disabled={!playlist}
    >
      <img
        data-testid="playlist-playback-icon"
        src={isPlaylistPlaying ? pause : play}
        alt={isPlaylistPlaying ? "Pause" : "Play"}
        className="h-7 w-7"
        aria-hidden="true"
      />
    </button>
  );
};

const PlaylistInfo = memo(
  ({
    images,
    name,
    handleImageLoad,
  }: {
    images: Image[];
    name: string;
    handleImageLoad: () => void;
  }) => {
    const obj = images?.find((img: Image) => img.quality === "150x150") || null;
    if (obj?.url) {
      preload(obj.url, {
        as: "image",
        fetchPriority: "high",
      });
    }

    const getPlaylistImage = () => {
      if (obj !== null) return obj.url;
      return fallback;
    };

    return (
      <div
        data-testid="playlist-info"
        className="flex h-auto w-full flex-col items-start justify-start pt-1 sm:flex-row sm:items-center"
      >
        <img
          data-testid="playlist-info-image"
          src={getPlaylistImage()}
          alt="img"
          className="mr-4 h-[150px] w-[150px]"
          style={{
            boxShadow: "5px 5px 0px #000",
          }}
          fetchPriority="high"
          loading="eager"
          onLoad={handleImageLoad}
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p className="text-md mb-1 mt-2 line-clamp-1 h-auto w-[60%] text-ellipsis text-left text-xl font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
          {cleanString(name)}
        </p>
      </div>
    );
  },
);
PlaylistInfo.displayName = "PlaylistAlbumInfo";

const PlaylistCount = memo(
  ({
    followerCount,
    songCount,
  }: {
    followerCount: string;
    songCount: string;
  }) => {
    return (
      <div
        data-testid="playlist-count"
        className="flex h-full w-[50%] flex-col items-start justify-center sm:w-[320px] sm:justify-start"
      >
        {Number(followerCount) > 0 && (
          <p className="mr-2 text-sm text-neutral-400">
            {followerCount} Followers
          </p>
        )}
        {Number(songCount) > 0 && (
          <p className="text-sm text-neutral-400">{songCount} Tracks</p>
        )}
      </div>
    );
  },
);
PlaylistCount.displayName = "PlaylistAlbumCount";

const PlaylistTracks = memo(({ songs }: { songs: TrackDetails[] }) => {
  return (
    <ul className="flex h-auto min-h-[71.5dvh] w-full flex-col items-start justify-start bg-neutral-900 p-3 pb-28 sm:p-4 sm:pb-20">
      {songs && songs.length > 0 ? (
        songs.map((song: TrackDetails, i) => (
          <Song index={i} key={song.id} track={song} isWidgetSong={false} />
        ))
      ) : (
        <p className="m-auto text-xl text-neutral-500">No songs here...T_T</p>
      )}
    </ul>
  );
});
PlaylistTracks.displayName = "PlaylistTracks";
