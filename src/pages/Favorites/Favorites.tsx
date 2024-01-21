/* eslint-disable @typescript-eslint/no-explicit-any */
import RouteNav from "../../components/RouteNav/RouteNav";
import Song from "../../components/Song/Song";
import { useBoundStore } from "../../store/store";
import { AlbumById, PlaylistById, TrackDetails } from "../../types/GlobalTypes";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import shuffle from "../../assets/icons8-shuffle.svg";
import random from "../../assets/icons8-shuffle-activated.svg";
import favoritesImg from "../../assets/favorites.webp";
import { useNavigate } from "react-router-dom";
import fallback from "../../assets/playlist-fallback.webp";
import close from "../../assets/close.svg";
import brokenheart from "../../assets/heart-break.svg";
import { useState } from "react";

export default function Favorites() {
  const {
    favorites,
    setIsPlaying,
    nowPlaying,
    setIsShuffling,
    isShuffling,
    setNowPlaying,
    removeFavoriteAlbum,
    removeFavoritePlaylist,
    setQueue,
  } = useBoundStore();
  const navigate = useNavigate();

  const FavoriteAlbum = (props: any) => {
    const [isAlbumHovered, setIsAlbumHovered] = useState(false);

    //Album play/pause functions
    function playAlbum(
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      album: AlbumById,
    ) {
      e.preventDefault();
      e.stopPropagation();
      setQueue({
        id: album.id,
        name: album.name,
        image: album.image || false,
        songs: album.songs,
      });
      setNowPlaying(album.songs[0]);
      setIsPlaying(true);
    }
    function pauseAlbum(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.preventDefault();
      e.stopPropagation();
      setIsPlaying(false);
    }

    return (
      <li
        className="relative mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center bg-transparent"
        key={props.album.id}
        onClick={() => navigate(`/albums/${props.album.id}`, { replace: true })}
        onMouseOver={() => setIsAlbumHovered(true)}
        onMouseLeave={() => setIsAlbumHovered(false)}
      >
        <img
          src={
            Array.isArray(props.album.image)
              ? props.album.image[1].link
              : fallback
          }
          alt="user-profile"
          className="h-[150px] w-[150px] rounded-full shadow-xl shadow-neutral-950"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p className="mt-1 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
          {props.album.name}
        </p>
        <div
          className={`${
            isAlbumHovered ? "opacity-100" : "opacity-0"
          } absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent transition-all ease-in`}
        >
          {nowPlaying.isPlaying && nowPlaying.queue.id === props.album.id ? (
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              className="rounded-full bg-emerald-400"
              onClick={(e) => pauseAlbum(e)}
            >
              <img
                src={pause}
                alt="pause album"
                className="h-[25px] w-[25px] p-0"
              />
            </button>
          ) : (
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              className="rounded-full bg-emerald-400 p-2"
              onClick={(e) => playAlbum(e, props.album)}
            >
              <img
                src={play}
                alt="play album"
                className="h-[25px] w-[25px] pl-1"
              />
            </button>
          )}
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            className="ml-2 h-auto w-auto rounded-full bg-white p-0"
            onClick={(e) => {
              e.stopPropagation();
              removeFavoriteAlbum(props.album.id);
            }}
          >
            <img
              src={close}
              alt="remove"
              className="h-[28px] w-[28px] rounded-full"
            />
          </button>
        </div>
      </li>
    );
  };

  function playFavorites(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setQueue({
      id: "",
      name: "Favorites",
      image: false,
      songs: favorites.songs,
    });
    if (favorites.songs) {
      setNowPlaying(favorites.songs[0]);
      setIsPlaying(true);
    }
  }

  const FavoritePlaylist = (props: any) => {
    const [isPlaylistHovered, setIsPlaylistHovered] = useState(false);

    //Playlist play/pause functions
    function playPlaylist(
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      playlist: PlaylistById,
    ) {
      e.preventDefault();
      e.stopPropagation();
      setQueue({
        id: playlist.id,
        name: playlist.name,
        image: playlist.image || false,
        songs: playlist.songs,
      });
      setNowPlaying(playlist.songs[0]);
      setIsPlaying(true);
    }
    function pausePlaylist(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.preventDefault();
      e.stopPropagation();
      setIsPlaying(false);
    }
    return (
      <li
        className="relative mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center bg-transparent"
        key={props.playlist.id}
        onMouseOver={() => setIsPlaylistHovered(true)}
        onMouseLeave={() => setIsPlaylistHovered(false)}
        onClick={() =>
          navigate(`/albums/${props.playlist.id}`, { replace: true })
        }
      >
        <img
          src={
            Array.isArray(props.playlist.image)
              ? props.playlist.image[1].link
              : fallback
          }
          alt="user-profile"
          className="h-[150px] w-[150px] rounded-lg shadow-xl shadow-neutral-950"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p className="mt-1 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
          {props.playlist.name}
        </p>
        <div
          className={`${
            isPlaylistHovered ? "opacity-100" : "opacity-0"
          } absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent transition-all ease-in`}
        >
          {nowPlaying.isPlaying && nowPlaying.queue.id === props.playlist.id ? (
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              className="rounded-full bg-emerald-400 p-2"
              onClick={(e) => pausePlaylist(e)}
            >
              <img
                src={pause}
                alt="pause album"
                className="h-[25px] w-[25px]"
              />
            </button>
          ) : (
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              className="rounded-full bg-emerald-400 p-2"
              onClick={(e) => playPlaylist(e, props.playlist)}
            >
              <img
                src={play}
                alt="play album"
                className="h-[25px] w-[25px] pl-1"
              />
            </button>
          )}
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            className="ml-2 rounded-full bg-white p-0"
            onClick={(e) => {
              e.stopPropagation();
              removeFavoritePlaylist(props.playlist.id);
            }}
          >
            <img
              src={close}
              alt="remove"
              className="h-[28px] w-[28px] rounded-full"
            />
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth">
      <div className="relative flex h-[210px] w-full items-end justify-between border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 px-4 py-3 sm:h-fit">
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
            className="mr-4 h-[150px] w-[150px]"
          />
          <p className="mt-1 line-clamp-1 h-auto w-[80%] text-ellipsis text-left text-xl font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
            Favorites
          </p>
        </div>
        <div className="flex w-[100px] items-center justify-between">
          {isShuffling ? (
            <button
              type="button"
              style={{
                outline: "none",
                border: "none",
              }}
              onClick={() => setIsShuffling(false)}
              className="border border-white p-0"
            >
              <img src={random} alt="shuffle" className="h-[28px] w-[28px]" />
            </button>
          ) : (
            <button
              type="button"
              style={{
                outline: "none",
                border: "none",
              }}
              onClick={() => setIsShuffling(true)}
              className="border border-white p-0"
            >
              <img src={shuffle} alt="shuffle" className="h-[28px] w-[28px]" />
            </button>
          )}
          {nowPlaying.isPlaying &&
          favorites.songs?.some((song) => song.id === nowPlaying.track.id) ? (
            <button
              type="button"
              style={{
                outline: "none",
                border: "none",
              }}
              onClick={() => setIsPlaying(false)}
              className="rounded-full bg-emerald-400 p-2"
            >
              <img src={pause} alt="pause" />
            </button>
          ) : (
            <button
              type="button"
              style={{
                outline: "none",
                border: "none",
              }}
              onClick={(e) => playFavorites(e)}
              className="rounded-full bg-emerald-400 p-2"
            >
              <img src={play} alt="play" />
            </button>
          )}
        </div>
      </div>
      {favorites.albums.length > 0 ||
      favorites.playlists.length > 0 ||
      favorites.songs.length > 0 ? (
        <div className="h-auto min-h-[80dvh] w-full bg-neutral-900">
          {favorites.albums.length > 0 && (
            <>
              <h2 className="p-4 py-2 font-semibold">Albums</h2>
              <ul className="bg-neutral-900w-full flex h-[200px] overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
                {favorites.albums?.map((album: AlbumById) => (
                  <FavoriteAlbum key={album.id} album={album} />
                ))}
              </ul>
            </>
          )}
          {favorites.playlists.length > 0 && (
            <>
              <h2 className="p-4 py-2 font-semibold">Playlists</h2>
              <ul className="flex h-[200px] max-h-fit w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
                {favorites.playlists?.map((playlist: PlaylistById) => (
                  <FavoritePlaylist playlist={playlist} />
                ))}
              </ul>
            </>
          )}
          {favorites.songs.length > 0 && (
            <>
              <h2 className="p-4 py-2 font-semibold">Songs</h2>
              <ul className="flex max-h-fit min-h-[23dvh] w-full flex-col items-start justify-start px-3 py-2 pb-28 sm:pb-20">
                {favorites.songs?.map((song: TrackDetails) => (
                  <Song
                    key={song.id}
                    id={song.id}
                    name={song.name}
                    type={song.type}
                    album={{
                      id: song.album.id,
                      name: song.album.name,
                      url: song.album.url,
                    }}
                    year={song.year}
                    releaseDate={song.releaseDate}
                    duration={song.duration}
                    label={song.label}
                    primaryArtists={song.primaryArtists}
                    primaryArtistsId={song.primaryArtistsId}
                    featuredArtists={song.featuredArtists}
                    featuredArtistsId={song.featuredArtistsId}
                    explicitContent={song.explicitContent}
                    playCount={song.playCount}
                    language={song.language}
                    hasLyrics={song.hasLyrics}
                    url={song.url}
                    copyright={song.copyright}
                    image={song.image}
                    downloadUrl={song.downloadUrl}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center">
          <img
            src={brokenheart}
            alt="broken"
            className="h-[40px] w-[40px] invert-[0.6] md:h-[50px] md:w-[50px]"
          />
          <p className="text-sm font-normal text-neutral-400 md:text-xl">
            No favorites here
          </p>
        </div>
      )}
    </div>
  );
}
