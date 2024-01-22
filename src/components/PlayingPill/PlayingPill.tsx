import { useBoundStore } from "../../store/store";
import songfallback from "../../assets/icons8-song-fallback.png";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import favorite from "../../assets/icons8-heart.svg";
import favorited from "../../assets/icons8-favorited.svg";

export default function PlayingPill() {
  const {
    nowPlaying,
    setIsPlaying,
    setShowPlayer,
    setFavoriteSong,
    favorites,
    removeFavorite,
  } = useBoundStore();

  function playTrack(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
  }

  function pauseTrack(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(false);
  }

  return (
    <div
      onClick={() => setShowPlayer(true)}
      className={`${
        nowPlaying.track?.id ? "flex" : "hidden"
      } ml-0.5 h-[50px] w-[95%] items-center justify-start overflow-hidden rounded-lg bg-black sm:hidden`}
    >
      <img
        src={nowPlaying.track ? nowPlaying.track.image[0]?.link : songfallback}
        alt="song-img"
        onError={(e) => (e.currentTarget.src = songfallback)}
        className="h-[50px] w-[50px] rounded-md"
      />
      <div className="flex h-full w-[87%] items-center justify-between">
        <div className="ml-3 flex h-[50px] w-[55%] flex-col items-start justify-center border-white leading-4">
          <p className="line-clamp-1 h-auto w-full text-white">
            {nowPlaying.track?.name}
          </p>
          <p className="line-clamp-1 h-auto w-full text-ellipsis whitespace-nowrap text-xs text-neutral-400">
            {nowPlaying.track?.primaryArtists}
          </p>
        </div>
        <div className="flex h-full w-[90px] items-center justify-around pr-2">
          {favorites.songs?.some((song) => song.id === nowPlaying.track?.id) ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nowPlaying.track && removeFavorite(nowPlaying.track?.id);
              }}
              style={{
                border: "none",
                outline: "none",
              }}
              className="mx-3 border-none bg-transparent p-0 outline-none"
            >
              <img
                src={favorited}
                alt="favorite"
                className="h-[25px] w-[25px] bg-transparent"
              />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nowPlaying.track && setFavoriteSong(nowPlaying.track);
              }}
              style={{
                border: "none",
                outline: "none",
              }}
              className="mx-3 border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
              disabled={nowPlaying.track?.id === ""}
            >
              <img
                src={favorite}
                alt="favorite"
                className="h-[25px] w-[25px] bg-transparent"
              />
            </button>
          )}
          {nowPlaying.isPlaying ? (
            <button
              onClick={(e) => pauseTrack(e)}
              style={{
                border: "none",
                outline: "none",
              }}
              className="h-auto w-auto bg-transparent p-0"
            >
              <img src={pause} alt="pause" className="w-[35px] invert-[1]" />
            </button>
          ) : (
            <button
              onClick={(e) => playTrack(e)}
              style={{
                border: "none",
                outline: "none",
              }}
              className="h-auto w-auto bg-transparent p-0"
            >
              <img src={play} alt="play" className="w-[30px] invert-[1]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
