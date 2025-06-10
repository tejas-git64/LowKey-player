import { useBoundStore } from "../../store/store";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import tick from "../../assets/svgs/icons8-tick.svg";
import { toggleFavorite } from "../../helpers/toggleFavorite";
import { startTransition, useMemo } from "react";
import { TrackDetails, UserPlaylist } from "../../types/GlobalTypes";
import { getPlaylist } from "../../helpers/getPlaylist";
import { cleanString } from "../../helpers/cleanString";

export default function PlayingPill() {
  const track = useBoundStore((state) => state.nowPlaying.track);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setShowPlayer = useBoundStore((state) => state.setShowPlayer);
  const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
  const favorites = useBoundStore((state) => state.favorites);
  const removeFavorite = useBoundStore((state) => state.removeFavorite);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const setCreationTrack = useBoundStore((state) => state.setCreationTrack);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const removeFromUserPlaylist = useBoundStore(
    (state) => state.removeFromUserPlaylist,
  );
  const isFavorited = useMemo(
    () => favorites.songs?.some((song) => song.id === track?.id),
    [favorites],
  );
  const playlist: UserPlaylist | undefined = useMemo(
    () =>
      userPlaylists.find((obj) => {
        return obj.songs.find((song) => {
          return song.id === track?.id;
        });
      }),
    [userPlaylists, track?.id],
  );

  const Pill = ({ track }: { track: TrackDetails }) => {
    return (
      <div
        onClick={() => setShowPlayer(true)}
        className={`${
          track?.id ? "flex" : "hidden"
        } ml-0.5 h-[50px] w-[95%] cursor-pointer items-center justify-around overflow-hidden rounded-lg bg-black sm:hidden`}
      >
        <img
          src={track?.image ? track.image[0]?.url : songfallback}
          alt="song-img"
          onError={(e) => (e.currentTarget.src = songfallback)}
          className="h-[50px] w-[50px] rounded-md"
        />
        <div className="flex h-full w-[87%] items-center justify-between">
          <div className="ml-3 flex h-[50px] w-[55%] flex-col items-start justify-center border-white leading-4">
            <p className="line-clamp-1 h-auto w-full text-sm text-white">
              {track ? cleanString(track?.name) : ""}
            </p>
            <p className="line-clamp-1 h-auto w-full text-ellipsis whitespace-nowrap text-xs text-neutral-400">
              {track ? cleanString(track?.artists?.primary[0].name) : ""}
            </p>
          </div>
          <div className="flex h-full w-[130px] items-center justify-around">
            <button
              className="h-auto w-auto px-1"
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
            >
              <img
                src={playlist?.id ? tick : add}
                alt="add-to-playlist"
                className="h-6 w-6"
              />
            </button>
            <button
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
              className="border-none bg-transparent p-0 outline-none"
            >
              <img
                src={isFavorited ? favorited : favorite}
                alt="favorite"
                className="h-7 w-7 bg-transparent"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                isPlaying ? setIsPlaying(false) : setIsPlaying(true);
              }}
              style={{
                border: "none",
                outline: "none",
              }}
              className="h-auto w-auto bg-transparent p-0"
            >
              <img
                src={isPlaying ? pause : play}
                alt="play-btn"
                className="h-9 w-9 invert-[1]"
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return track && <Pill track={track} />;
}
