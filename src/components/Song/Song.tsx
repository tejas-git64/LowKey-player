import { useLocation, useNavigate } from "react-router-dom";
import fallback from "../../assets/icons8-song-fallback.png";
import { TrackDetails } from "../../types/GlobalTypes";
import { useState } from "react";
import notfav from "../../assets/icons8-heart.svg";
import fav from "../../assets/icons8-favorited.svg";
import playing from "../../assets/song-playing.svg";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../utils/utils";
import add from "../../assets/icons8-addplaylist-28.svg";
import tick from "../../assets/icons8-tick.svg";

export default function Song(track: TrackDetails) {
  const {
    setNowPlaying,
    nowPlaying,
    setIsPlaying,
    setFavoriteSong,
    favorites,
    removeFavorite,
    library,
    setRevealCreation,
    setCreationTrack,
    removeFromUserPlaylist,
  } = useBoundStore();
  const [isHovered, setIsHovered] = useState(false);
  const artistIds = track?.primaryArtistsId.split(",");
  const artistNames = track?.primaryArtists.split(",");
  const navigate = useNavigate();
  const path = useLocation().pathname;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playlist = library.userPlaylists.find((obj) => {
    return obj.songs.find((song) => {
      return song.id === track?.id;
    });
  });

  function removeFromPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    playlistid: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    removeFromUserPlaylist(playlistid, track?.id);
  }

  function navigateToArtist(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string,
  ) {
    e.stopPropagation();
    e.preventDefault();
    id !== "" ? navigate(`/artists/${id.replace(/\s+/g, "")}`) : navigate(path);
  }
  function addFavorite(
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    e.stopPropagation();
    track && setFavoriteSong(track);
  }
  function unFavorite(
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.stopPropagation();
    removeFavorite(track?.id);
  }
  function setPlay(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    song: TrackDetails,
  ) {
    e.stopPropagation();
    e.preventDefault();
    setNowPlaying(null);
    setNowPlaying(song);
    setIsPlaying(true);
  }
  function revealTrackMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setCreationTrack(track);
    setRevealCreation(true);
  }

  return (
    <>
      <li
        id={track?.id}
        onClick={(e) => track && setPlay(e, track)}
        className="mb-0.5 h-12 w-full flex-shrink-0 overflow-hidden rounded-sm text-sm"
      >
        <div
          style={{
            border: "none",
            outline: "none",
          }}
          className="flex h-full w-full items-center justify-between bg-neutral-800 p-0 pr-2 transition-all ease-in-out"
          role="button"
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={track.image ? track.image[0]?.link : fallback}
            alt="img"
            className="mr-4 h-[50px] w-[50px] bg-black md:mr-[5%]"
            onError={(e) => (e.currentTarget.src = fallback)}
          />
          <p className="line-clamp-1 w-[35%] text-ellipsis text-xs font-normal capitalize text-white sm:text-sm md:w-[30%]">
            {track.name !== ""
              ? track.name?.replace("&quot;", "").replace("&amp;", "")
              : ""}
          </p>
          <div className="mx-2 flex h-[20px] w-[20px] items-center justify-start">
            {nowPlaying.track?.id === track?.id && nowPlaying.isPlaying && (
              <img src={playing} alt="playing" className="h-[20px] w-[20px]" />
            )}
          </div>
          <div
            style={{
              wordSpacing: "2px",
            }}
            className="2xl:w-50 line-clamp-2 w-32 overflow-hidden whitespace-nowrap font-medium text-neutral-300 sm:flex sm:w-[20%] 2xl:w-56"
          >
            {artistIds.map((id, i) => (
              <div
                key={id}
                onClick={(e) => navigateToArtist(e, id)}
                className="mr-2 text-xs text-neutral-400 hover:text-white"
              >
                {artistNames[i] !== "" ? artistNames[i] : ""}
              </div>
            ))}
          </div>
          <p className="hidden text-xs font-normal text-white sm:block">
            {secondsToHMS(Number(track?.duration))}
          </p>
          <div className="mx-1 flex w-[60px] items-center justify-between xl:ml-3">
            {favorites.songs?.some((song) => song.id === track?.id) ? (
              <button
                style={{
                  border: "none",
                  outline: "none",
                }}
                className={`h-auto w-[20px] bg-transparent p-0 ${
                  isHovered ||
                  favorites.songs?.some((song) => song.id === track?.id)
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                onClick={(e) => unFavorite(e)}
              >
                <img src={fav} alt="fav" />
              </button>
            ) : (
              <button
                style={{
                  border: "none",
                  outline: "none",
                }}
                className={`h-auto w-[20px] bg-transparent p-0 ${
                  isHovered ? "opacity-100" : "opacity-0"
                } ${
                  favorites.songs?.some((song) => song.id === track?.id)
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                onClick={(e) => addFavorite(e)}
              >
                <img src={notfav} alt="not-fav" />
              </button>
            )}
            <button
              style={{
                border: "none",
                outline: "none",
              }}
              onClick={(e) => revealTrackMenu(e)}
              className={`border bg-transparent p-0 ${
                isHovered ? "opacity-100" : "opacity-0"
              } ${!playlist ? "block" : "hidden"}`}
            >
              <img src={add} alt="add" className="h-[20px] w-[20px]" />
            </button>
            {playlist?.id && (
              <button
                style={{
                  border: "none",
                  outline: "none",
                }}
                type="button"
                onClick={(e) => playlist && removeFromPlaylist(e, playlist.id)}
                className={`border bg-transparent p-0 opacity-100 `}
              >
                <img src={tick} alt="tick" className="h-[20px] w-[20px]" />
              </button>
            )}
          </div>
        </div>
      </li>
    </>
  );
}
