import { useNavigate } from "react-router-dom";
import fallback from "../../assets/fallbacks/song-fallback.webp";
import {
  ArtistInSong,
  TrackDetails,
  UserPlaylist,
} from "../../types/GlobalTypes";
import {
  startTransition,
  useMemo,
  useCallback,
  memo,
  useEffect,
  useRef,
} from "react";
import notfav from "../../assets/svgs/icons8-heart.svg";
import fav from "../../assets/svgs/icons8-favorited.svg";
import playing from "../../assets/gifs/play-animation.gif";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../utils/utils";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import tick from "../../assets/svgs/tick.svg";
import { toggleFavorite } from "../../helpers/toggleFavorite";
import { cleanString } from "../../helpers/cleanString";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

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
    const nowPlaying = useBoundStore((state) => state.nowPlaying);
    const songs = useBoundStore((state) => state.favorites.songs);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
    const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
    const removeFavorite = useBoundStore((state) => state.removeFavorite);
    const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
    const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
    const setCreationTrack = useBoundStore((state) => state.setCreationTrack);
    const songEl = useRef<HTMLLIElement>(null);
    const imgEl = useRef<HTMLImageElement>(null);
    const titleEl = useRef<HTMLParagraphElement>(null);
    const durationEl = useRef<HTMLParagraphElement>(null);

    const { artistIds, artistNames, playlist } = useMemo(() => {
      const ids: string[] = [];
      const names: string[] = [];
      track?.artists?.primary?.forEach((artist: ArtistInSong) => {
        ids.push(artist.id);
        names.push(artist.name);
      });
      const playlist: UserPlaylist | undefined = userPlaylists.find((obj) => {
        return obj.songs.find((song) => {
          return song.id === track?.id;
        });
      });
      return { artistIds: ids, artistNames: names, playlist: playlist };
    }, [track?.name, userPlaylists]);

    const isFavorited = useMemo(
      () => songs.some((song) => song.id === track?.id),
      [songs],
    );

    const setPlay = useCallback(
      (e: React.MouseEvent<HTMLLIElement, MouseEvent>, song: TrackDetails) => {
        e.stopPropagation();
        startTransition(() => {
          setNowPlaying(song);
          setIsPlaying(true);
        });
      },
      [track?.name],
    );

    useEffect(() => {
      saveToLocalStorage("local-favorites", {
        favorites: songs,
      });
    }, [songs]);

    useEffect(() => {
      setTimeout(() => {
        songEl.current?.classList.remove("song-fadeout");
        titleEl.current?.classList.remove("song-fadeout");
        durationEl.current?.classList.remove("song-fadeout");
        imgEl.current?.classList.remove("image-fadeout");
        imgEl.current?.classList.add("image-fadein");
        durationEl.current?.classList.add("song-fadein");
        songEl.current?.classList.add("song-fadein");
        titleEl.current?.classList.add("song-fadein");
      }, index * 20);
    }, []);

    return (
      <>
        <li
          ref={songEl}
          onClick={(e) => setPlay(e, track)}
          tabIndex={0}
          style={{
            transitionDelay: `${index * 10}ms`,
          }}
          className="song-fadeout group h-12 w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border-b border-neutral-950 text-sm outline-none transition-colors duration-75 ease-in focus-within:bg-neutral-700 hover:bg-neutral-700 focus:bg-neutral-700"
        >
          <div className="flex h-full w-full items-center justify-start p-0 pr-2 transition-all ease-in-out">
            <img
              ref={imgEl}
              src={track?.image[0]?.url}
              alt="img"
              width={50}
              height={50}
              className="image-fadeout mr-4 h-[50px] w-[50px] bg-black transition-all duration-200 ease-in"
              onError={(e) => (e.currentTarget.src = fallback)}
            />
            <p
              ref={titleEl}
              className={`${isWidgetSong ? "w-[10vw] sm:w-[18vw] md:w-[20vw] xmd:w-[22vw] lg:mr-[1vw] lg:w-[22vw] xl:w-[12.5vw] xxl:w-[13.5vw] 2xl:w-[15vw] 2xl:max-w-60" : "w-[40vw] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[30%] 2xl:w-60"} song-fadeout line-clamp-1 flex-shrink-0 flex-grow-[0.85] basis-12 text-ellipsis text-xs font-normal text-white`}
            >
              {(track.name && cleanString(track.name)) || "Unknown track"}
            </p>
            <div
              className={`${isWidgetSong ? "mx-[1vw] flex-shrink-0 sm:hidden xmd:mx-2 xmd:block lg:hidden xlg:mx-4 xlg:block xxl:mx-5 2xl:mx-6 2xl:block" : "mx-2 sm:ml-0 lg:mx-8 xl:mx-12 2xl:mx-10"} flex h-5 w-5 flex-shrink-0 items-center justify-start`}
            >
              {nowPlaying.track?.id === track?.id && nowPlaying.isPlaying && (
                <img src={playing} alt="playing" className="h-5 w-5" />
              )}
            </div>
            <div
              style={{
                wordSpacing: "5px",
              }}
              className={`${isWidgetSong ? "hidden flex-shrink-0 xlg:flex xlg:w-[3.5vw] xl:w-[5vw] xxl:w-[8.5vw] 2xl:w-[10vw] 2xl:max-w-40" : "hidden sm:mr-12 sm:inline-flex sm:w-[25%] md:mr-6 md:w-[27.5%] xmd:w-[37.5%] lg:mr-10 lg:w-[37.5%] xl:mr-[7%] xl:w-[25%] xxl:mr-[4%] xxl:w-[30%] 2xl:mr-14 2xl:w-[35%] 2xl:max-w-96"} mr-4 line-clamp-1 flex flex-shrink-0 space-x-3 overflow-hidden font-medium text-neutral-300`}
            >
              {artistIds?.map((id, i) => (
                <Artist id={id} key={id} i={i} artistName={artistNames[i]} />
              ))}
            </div>
            <p
              ref={durationEl}
              className={`${isWidgetSong ? "mr-[1vw] w-10 flex-shrink-0 sm:ml-[4vw] sm:mr-2 md:mx-[2vw] xmd:mx-[3vw] lg:mx-[1vw] xlg:ml-[1.5vw] xxl:mx-[0.5vw] 2xl:mx-2" : "m-[3vw] w-10 max-w-14 sm:ml-4 sm:mr-[2%] sm:block md:mx-[5%] xmd:mx-4 lg:mx-0 xlg:mx-[2vw] xl:mr-4"} song-fadeout text-xs font-normal text-white duration-200 ease-in`}
            >
              {secondsToHMS(Number(track?.duration))}
            </p>
            <div className="mx-0 flex w-10 flex-grow-[0.08] basis-12 items-center justify-evenly space-x-3 sm:w-6 md:ml-2 lg:mx-6 lg:w-12 xlg:mx-[1vw]">
              <button
                tabIndex={0}
                type="button"
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
                  alt="not-fav"
                />
              </button>
              <button
                tabIndex={0}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCreationTrack(track);
                  setRevealCreation(true);
                }}
                className={`flex-shrink-0 border bg-transparent p-0 opacity-0 transition-opacity focus:opacity-100 focus:ring-2 focus:ring-emerald-500 group-hover:opacity-100 ${!playlist?.id ? "opacity-0" : "opacity-100"}`}
              >
                <img
                  width={18}
                  height={18}
                  src={playlist?.id ? tick : add}
                  alt="tick"
                />
              </button>
            </div>
          </div>
        </li>
      </>
    );
  },
);

const Artist = memo(
  ({ id, i, artistName }: { id: string; i: number; artistName: string }) => {
    const navigate = useNavigate();
    const artistEl = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      setTimeout(() => {
        artistEl.current?.classList.remove("song-fadeout");
        artistEl.current?.classList.add("song-fadein");
      }, i * 100);
    }, []);

    return (
      <p
        key={id}
        ref={artistEl}
        onClick={(e) => {
          e.stopPropagation();
          id && navigate(`/artists/${id}`);
        }}
        className="song-fadeout cursor-pointer whitespace-nowrap py-4 text-xs text-neutral-400 duration-200 ease-in hover:text-white"
      >
        {cleanString(artistName) || ""}
      </p>
    );
  },
);

export default Song;
