import {
  startTransition,
  useMemo,
  useCallback,
  memo,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "../../store/store";
import { cleanString } from "../../helpers/cleanString";
import { toggleFavorite } from "../../helpers/toggleFavorite";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";
import { TrackDetails, UserPlaylist } from "../../types/GlobalTypes";
import secondsToHMS from "../../helpers/secondsToHMS";
import fallback from "/fallbacks/song-fallback.webp";
import notfav from "/svgs/icons8-heart.svg";
import fav from "/svgs/icons8-favorited.svg";
import playing from "/gifs/play-animation.gif";
import add from "/svgs/icons8-addplaylist-28.svg";
import tick from "/svgs/tick.svg";

const Song = memo(
  ({
    track,
    isWidgetSong,
    index,
  }: {
    track: TrackDetails;
    isWidgetSong: boolean;
    index: number;
  }) => {
    const songs = useBoundStore((state) => state.favorites.songs);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);

    const songEl = useRef<HTMLDivElement>(null);
    const imgEl = useRef<HTMLImageElement>(null);
    const titleEl = useRef<HTMLParagraphElement>(null);
    const durationEl = useRef<HTMLParagraphElement>(null);
    const { artistIds, artistNames } = useMemo(() => {
      const ids: string[] = [];
      const names: string[] = [];
      for (const a of track?.artists?.primary || []) {
        ids.push(a.id);
        names.push(a.name);
      }
      return { artistIds: ids, artistNames: names };
    }, [track]);

    const setPlay = useCallback(
      (
        e:
          | React.MouseEvent<HTMLDivElement, MouseEvent>
          | React.KeyboardEvent<HTMLDivElement>,
        song: TrackDetails,
      ) => {
        e.stopPropagation();
        startTransition(() => {
          setNowPlaying(song);
          setIsPlaying(true);
        });
      },
      [setIsPlaying, setNowPlaying],
    );

    useEffect(() => {
      saveToLocalStorage("local-favorites", {
        favorites: songs,
      });
    }, [songs]);

    useEffect(() => {
      const timer = setTimeout(() => {
        songEl.current?.classList.remove("song-fadeout");
        titleEl.current?.classList.remove("song-fadeout");
        durationEl.current?.classList.remove("song-fadeout");
        imgEl.current?.classList.remove("image-fadeout");
        imgEl.current?.classList.add("image-fadein");
        durationEl.current?.classList.add("song-fadein");
        songEl.current?.classList.add("song-fadein");
        titleEl.current?.classList.add("song-fadein");
      }, index * 20);
      return () => {
        clearTimeout(timer);
      };
    }, [index]);

    return (
      <div
        ref={songEl}
        onClick={(e) => setPlay(e, track)}
        onKeyDown={(e) => setPlay(e, track)}
        tabIndex={0}
        role="listitem"
        style={{
          transitionDelay: `${index * 10}ms`,
        }}
        data-testid="song"
        className="song-fadeout group h-12 w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border-b border-neutral-900 text-sm outline-none transition-colors duration-75 ease-in focus-within:bg-neutral-700 hover:bg-neutral-700 focus:bg-neutral-700"
      >
        <div className="flex h-full w-full items-center justify-start p-0 pr-2 transition-all ease-in-out">
          <img
            ref={imgEl}
            src={track?.image[0]?.url}
            alt={track.name ? cleanString(track.name) : "Unknown track"}
            width={50}
            height={50}
            fetchPriority="high"
            loading="eager"
            className="image-fadeout mr-4 h-[50px] w-[50px] bg-black transition-all duration-200 ease-in"
            onError={(e) => (e.currentTarget.src = fallback)}
          />
          <p
            ref={titleEl}
            data-testid="name"
            className={`${isWidgetSong ? "w-[10vw] sm:w-[18vw] md:w-[20vw] xmd:w-[22vw] lg:mr-[1vw] lg:w-[22vw] xl:w-[12.5vw] xxl:w-[13.5vw] 2xl:w-[15vw] 2xl:max-w-60" : "w-[40vw] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[30%] 2xl:w-60"} song-fadeout line-clamp-1 flex-shrink-0 flex-grow-[0.85] basis-12 text-ellipsis text-xs font-normal text-white`}
          >
            {(track.name && cleanString(track.name)) || "Unknown track"}
          </p>
          <div
            data-testid="playing"
            className={`${isWidgetSong ? "mx-[1vw] flex-shrink-0 sm:hidden xmd:mx-2 xmd:block lg:hidden xlg:mx-4 xlg:block xxl:mx-5 2xl:mx-6 2xl:block" : "mx-2 sm:ml-0 lg:mx-8 xl:mx-12 2xl:mx-10"} flex h-5 w-5 flex-shrink-0 items-center justify-start`}
          >
            <PlayingGif track={track} />
          </div>
          <div
            style={{
              wordSpacing: "5px",
            }}
            data-testid="artists"
            className={`${isWidgetSong ? "hidden flex-shrink-0 xlg:flex xlg:w-[3.5vw] xl:w-[5vw] xxl:w-[8.5vw] 2xl:w-[10vw] 2xl:max-w-40" : "hidden sm:mr-12 sm:inline-flex sm:w-[25%] md:mr-6 md:w-[27.5%] xmd:w-[37.5%] lg:mr-10 lg:w-[37.5%] xl:mr-[7%] xl:w-[25%] xxl:mr-[4%] xxl:w-[30%] 2xl:mr-14 2xl:w-[35%] 2xl:max-w-96"} mr-4 line-clamp-1 flex flex-shrink-0 space-x-3 overflow-hidden font-medium text-neutral-300`}
          >
            {artistIds?.map((id: string, i: number) => (
              <Artist id={id} key={id} i={i} artistName={artistNames[i]} />
            ))}
          </div>
          <p
            ref={durationEl}
            data-testid="duration"
            className={`${isWidgetSong ? "mr-[1vw] w-10 flex-shrink-0 sm:ml-[4vw] sm:mr-2 md:mx-[2vw] xmd:mx-[3vw] lg:mx-[1vw] xlg:ml-[1.5vw] xxl:mx-[0.5vw] 2xl:mx-2" : "m-[3vw] w-10 max-w-14 sm:ml-4 sm:mr-[2%] sm:block md:mx-[5%] xmd:mx-4 lg:mx-0 xlg:mx-[2vw] xl:mr-4"} song-fadeout text-xs font-normal text-white duration-200 ease-in`}
          >
            {secondsToHMS(Number(track?.duration))}
          </p>
          <div className="mx-0 flex w-10 flex-grow-[0.08] basis-12 items-center justify-evenly space-x-3 sm:w-6 md:ml-2 lg:mx-6 lg:w-12 xlg:mx-[1vw]">
            <FavoriteButton key={track.name} track={track} songs={songs} />
            <AddToPlaylistButton track={track} />
          </div>
        </div>
      </div>
    );
  },
);
Song.displayName = "Song";

const FavoriteButton = ({
  songs,
  track,
}: {
  songs: TrackDetails[];
  track: TrackDetails;
}) => {
  const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
  const removeFavorite = useBoundStore((state) => state.removeFavorite);
  const isFavorited = useMemo(
    () => songs?.some((song) => song.id === track?.id),
    [songs, track],
  );
  return (
    <button
      tabIndex={0}
      type="button"
      data-testid="favorite-btn"
      className={`h-auto w-[20px] flex-shrink-0 bg-transparent p-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-visible:ring-2 group-focus-visible:ring-emerald-500 ${isFavorited ? "opacity-100" : "opacity-0"}`}
      onClick={(e) =>
        track &&
        toggleFavorite({
          e,
          track,
          isFavorited,
          setFavoriteSong,
          removeFavorite,
          startTransition,
        })
      }
    >
      <img
        width={18}
        height={18}
        src={isFavorited ? fav : notfav}
        alt="fav-icon"
      />
    </button>
  );
};

const AddToPlaylistButton = ({ track }: { track: TrackDetails }) => {
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const setCreationTrack = useBoundStore((state) => state.setCreationTrack);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);

  const playlist: UserPlaylist | undefined = useMemo(
    () =>
      userPlaylists?.find((obj) => {
        return obj.songs.find((song) => {
          return song.id === track?.id;
        });
      }),
    [track?.id, userPlaylists],
  );

  return (
    <button
      tabIndex={0}
      type="button"
      data-testid="playlist-btn"
      onClick={(e) => {
        e.stopPropagation();
        setCreationTrack(track);
        setRevealCreation(true);
      }}
      className={`flex-shrink-0 border bg-transparent p-0 opacity-0 transition-opacity focus:opacity-100 focus:ring-2 focus:ring-emerald-500 group-hover:opacity-100 ${playlist?.id ? "opacity-100" : "opacity-0"}`}
    >
      <img
        width={18}
        height={18}
        src={playlist?.id ? tick : add}
        alt="playlist-icon"
      />
    </button>
  );
};

const PlayingGif = ({ track }: { track: TrackDetails }) => {
  const currentTrack = useBoundStore((state) => state.nowPlaying.track);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  if (currentTrack !== null && currentTrack.id === track.id && isPlaying) {
    return <img src={playing} alt="playing" className="h-5 w-5" />;
  }
};

const Artist = memo(
  ({ id, i, artistName }: { id: string; i: number; artistName: string }) => {
    const navigate = useNavigate();
    const artistEl = useRef<HTMLParagraphElement>(null);

    const navigateToArtist = useCallback(
      (
        e:
          | React.MouseEvent<HTMLDivElement, MouseEvent>
          | React.KeyboardEvent<HTMLDivElement>,
      ) => {
        e.stopPropagation();
        if (id) navigate(`/artists/${id}`);
      },
      [id, navigate],
    );

    useEffect(() => {
      const timer = setTimeout(() => {
        artistEl.current?.classList.remove("song-fadeout");
        artistEl.current?.classList.add("song-fadein");
      }, i * 100);
      return () => {
        clearTimeout(timer);
      };
    }, [i]);

    return (
      <div
        key={id}
        ref={artistEl}
        data-testid="artist"
        role="link"
        onClick={navigateToArtist}
        tabIndex={0}
        onKeyDown={navigateToArtist}
        className="song-fadeout cursor-pointer whitespace-nowrap py-4 text-xs text-neutral-400 duration-200 ease-in hover:text-white"
      >
        {artistName ? cleanString(artistName) : "Unknown Artist"}
      </div>
    );
  },
);
Artist.displayName = "Artist";

export default Song;
