import { useNavigate } from "react-router-dom";
import fallback from "../../assets/fallbacks/song-fallback.webp";
import {
  ArtistInSong,
  TrackDetails,
  UserPlaylist,
} from "../../types/GlobalTypes";
import { startTransition, useMemo, useCallback, memo, useEffect } from "react";
import notfav from "../../assets/svgs/icons8-heart.svg";
import fav from "../../assets/svgs/icons8-favorited.svg";
import playing from "../../assets/gifs/play-animation.gif";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../utils/utils";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import tick from "../../assets/svgs/tick.svg";
import { toggleFavorite } from "../../helpers/toggleFavorite";
import { getPlaylist } from "../../helpers/getPlaylist";
import { cleanString } from "../../helpers/cleanString";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

const Song = memo(
  ({ track, isWidgetSong }: { track: TrackDetails; isWidgetSong: boolean }) => {
    const nowPlaying = useBoundStore((state) => state.nowPlaying);
    const songs = useBoundStore((state) => state.favorites.songs);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
    const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
    const removeFavorite = useBoundStore((state) => state.removeFavorite);
    const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
    const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
    const setCreationTrack = useBoundStore((state) => state.setCreationTrack);
    const removeFromUserPlaylist = useBoundStore(
      (state) => state.removeFromUserPlaylist,
    );
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
    const navigate = useNavigate();

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
    return (
      <>
        <li
          onClick={(e) => setPlay(e, track)}
          className="duration-70 group mb-0.5 h-12 w-full flex-shrink-0 overflow-hidden rounded-sm bg-neutral-800 text-sm transition-colors hover:bg-neutral-700"
        >
          <div
            className="flex h-full w-full items-center justify-start p-0 pr-2 transition-all ease-in-out"
            role="button"
          >
            <img
              src={track?.image[0]?.url}
              alt="img"
              width={50}
              height={50}
              className="mr-6 h-[50px] w-[50px] bg-black sm:mr-4"
              onError={(e) => (e.currentTarget.src = fallback)}
            />
            <p
              className={`${isWidgetSong ? "w-[48.5vw] flex-shrink-0 sm:w-[18vw] md:w-[20vw] xmd:w-[22vw] lg:mr-[1vw] lg:w-[22vw] xl:w-[12.5vw] xxl:w-[13.5vw] 2xl:w-[15vw] 2xl:max-w-60" : "w-[25vw] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[30%] 2xl:w-60"} line-clamp-1 flex-shrink-0 text-ellipsis text-xs font-normal text-white`}
            >
              {(track.name && cleanString(track.name)) || "Unknown track"}
            </p>
            <div
              className={`${isWidgetSong ? "flex-shrink-0 sm:hidden xmd:mx-2 xmd:block lg:hidden xlg:mx-4 xlg:block xxl:mx-5 2xl:mx-6 2xl:block" : "mx-2 sm:ml-0 lg:mx-8 xl:mx-12 2xl:mx-10"} flex h-5 w-5 flex-shrink-0 items-center justify-start`}
            >
              {nowPlaying.track?.id === track?.id && nowPlaying.isPlaying && (
                <img src={playing} alt="playing" className="h-5 w-5" />
              )}
            </div>
            <div
              style={{
                wordSpacing: "5px",
              }}
              className={`${isWidgetSong ? "hidden flex-shrink-0 xlg:flex xlg:w-[3.5vw] xl:w-[5vw] xxl:w-[8.5vw] 2xl:w-[10vw] 2xl:max-w-40" : "w-[17.5vw] sm:mr-12 sm:w-[25%] md:mr-6 md:w-[25%] xmd:w-[30%] lg:mr-10 lg:w-[35%] xl:mr-[7%] xl:w-[25%] xxl:mr-[4%] xxl:w-[30%] 2xl:mr-14 2xl:w-[37.5%] 2xl:max-w-96"} mr-4 line-clamp-1 flex flex-shrink-0 space-x-3 overflow-hidden font-medium text-neutral-300`}
            >
              {artistIds?.map((id, i) => (
                <p
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    id && navigate(`/artists/${id}`);
                  }}
                  className="whitespace-nowrap py-4 text-xs text-neutral-400 hover:text-white"
                >
                  {cleanString(artistNames[i]) || ""}
                </p>
              ))}
            </div>
            <p
              className={`${isWidgetSong ? "mr-[2%] w-10 flex-shrink-0 sm:ml-[4vw] sm:mr-2 md:mx-[2vw] xmd:mx-[3vw] lg:mx-[1vw] xlg:ml-[1.5vw] xxl:mx-[0.5vw] 2xl:mx-2" : "m-[1vw] w-10 max-w-14 sm:ml-4 sm:mr-[2%] sm:block md:mx-[5%] xmd:mx-4 lg:mx-0 xlg:mx-[2vw] xl:mr-4"} mr-2 text-xs font-normal text-white`}
            >
              {secondsToHMS(Number(track?.duration))}
            </p>
            <div className="mx-2 flex w-14 items-center justify-evenly space-x-3 sm:w-6 md:ml-2 lg:mx-6 lg:w-12 xlg:mx-[1vw]">
              <button
                className={`h-auto w-[20px] flex-shrink-0 bg-transparent p-0 opacity-0 transition-opacity group-hover:opacity-100 ${isFavorited ? "opacity-100" : "opacity-0"}`}
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
                type="button"
                onClick={(e) =>
                  track &&
                  getPlaylist({
                    e,
                    track,
                    playlist,
                    removeFromUserPlaylist,
                    setCreationTrack,
                    setRevealCreation,
                    startTransition,
                  })
                }
                className={`flex-shrink-0 border bg-transparent p-0 opacity-0 transition-opacity group-hover:opacity-100 ${!playlist?.id ? "opacity-0" : "opacity-100"}`}
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

export default Song;
