/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Playlist from "../../components/Playlist/Playlist";
import RouteNav from "../../components/RouteNav/RouteNav";
import { useBoundStore } from "../../store/store";
import {
  AlbumById,
  ArtistType,
  PlaylistById,
  UserPlaylist,
} from "../../types/GlobalTypes";
import close from "../../assets/close.svg";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import artistfallback from "../../assets/icons8-artist-fallback.png";
import userplaylist from "../../assets/playlist-fallback.webp";
import unfollow from "../../assets/user-xmark.svg";
import add from "../../assets/icons8-addplaylist-28.svg";
import { Link } from "react-router-dom";

export default function Library() {
  const {
    library,
    removeLibraryAlbum,
    removeLibraryPlaylist,
    removeFollowing,
    setNowPlaying,
    removeUserPlaylist,
    setIsPlaying,
    nowPlaying,
    setRevealCreation,
    setQueue,
    setCreationMenu,
  } = useBoundStore();

  //Album play/pause functions
  function playAlbum(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    album: AlbumById,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
    setQueue({
      id: album.id,
      name: album.name,
      image: album.image,
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
  //Album play/pause functions
  function playPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    playlist: any,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setQueue({
      id: playlist.id,
      name: playlist.name,
      songs: playlist.songs,
      image: playlist.image || false,
    });
    setNowPlaying(playlist.songs[0]);
    setIsPlaying(true);
  }
  function pausePlaylist(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(false);
  }
  function createNewPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setCreationMenu(true);
    setRevealCreation(true);
  }

  const LibraryAlbum = (props: any) => {
    const [isAlbumHovered, setIsAlbumHovered] = useState(false);
    return (
      <>
        <Link
          to={`/albums/${props.album.id}`}
          key={props.album.id}
          className="relative h-fit w-fit"
          onMouseOver={() => setIsAlbumHovered(true)}
          onMouseLeave={() => setIsAlbumHovered(false)}
        >
          <Playlist
            id={props.album.id}
            userId={props.album.id}
            name={props.album.name}
            songCount={props.album.songCount}
            username={""}
            firstname={""}
            lastname={""}
            language={""}
            image={props.album.image}
            url={props.album.url}
            songs={[]}
          />
          <div
            className={`${
              isAlbumHovered ? "opacity-100" : "opacity-0"
            } absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent transition-all ease-in`}
          >
            {nowPlaying.isPlaying && nowPlaying.queue.id === props.album.id ? (
              <button
                type="button"
                className="rounded-full bg-emerald-400 p-2"
                onClick={(e) => pauseAlbum(e)}
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
              className="ml-2 rounded-full bg-black p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeLibraryAlbum(props.album.id);
              }}
            >
              <img
                src={close}
                alt="remove"
                className="h-[28px] w-[28px] rounded-full"
              />
            </button>
          </div>
        </Link>
      </>
    );
  };

  const LibraryPlaylist = (props: any) => {
    const [isPlaylistHovered, setIsPlaylistHovered] = useState(false);
    return (
      <>
        <Link
          to={`/playlists/${props.playlist.id}`}
          key={props.playlist.id}
          className="relative h-fit w-fit"
          onMouseOver={() => setIsPlaylistHovered(true)}
          onMouseLeave={() => setIsPlaylistHovered(false)}
        >
          <Playlist
            id={props.playlist.id}
            userId={props.playlist.userId}
            name={props.playlist.name}
            songCount={props.playlist.songCount}
            username={props.playlist.username}
            firstname={props.playlist.firstname}
            lastname={props.playlist.lastname}
            language={""}
            image={props.playlist.image}
            url={props.playlist.url}
            songs={props.playlist.songs}
          />
          <div
            className={`${
              isPlaylistHovered ? "opacity-100" : "opacity-0"
            } absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent transition-all ease-in`}
          >
            {nowPlaying.isPlaying &&
            nowPlaying.queue.id === props.playlist.id ? (
              <button
                type="button"
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
              className="ml-2 rounded-full bg-black p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeLibraryPlaylist(props.playlist.id);
              }}
            >
              <img
                src={close}
                alt="remove"
                className="h-[28px] w-[28px] rounded-full"
              />
            </button>
          </div>
        </Link>
      </>
    );
  };

  const CustomPlaylist = ({ playlist }: any) => {
    const [isPlaylistHovered, setIsPlaylistHovered] = useState(false);
    return (
      <>
        <Link
          to={`/userplaylists/${playlist.id}`}
          key={playlist.id}
          className="relative h-fit w-fit"
          onMouseOver={() => setIsPlaylistHovered(true)}
          onMouseLeave={() => setIsPlaylistHovered(false)}
        >
          <div className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center">
            <img
              src={userplaylist}
              alt="user-profile"
              className="h-[150px] w-[150px] shadow-md shadow-black"
            />
            <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
              {playlist.name}
            </p>
          </div>
          <div
            className={`${
              isPlaylistHovered ? "opacity-100" : "opacity-0"
            } absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent transition-all ease-in`}
          >
            {nowPlaying.isPlaying && nowPlaying.queue.id === playlist.id ? (
              <button
                type="button"
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
                className="rounded-full bg-emerald-400 p-2"
                onClick={(e) => playPlaylist(e, playlist)}
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
              className="ml-2 rounded-full bg-black p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeUserPlaylist(Number(playlist.id));
              }}
            >
              <img
                src={close}
                alt="remove"
                className="h-[28px] w-[28px] rounded-full"
              />
            </button>
          </div>
        </Link>
      </>
    );
  };

  const Following = ({ id, name, image }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <Link
        to={`/artists/${id}`}
        className="mb-3 flex h-[50px] w-full items-center justify-between"
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full w-[80%] items-center justify-start">
          <img
            src={image ? image[0].link : artistfallback}
            alt="artist"
            className="mr-4 h-[50px] w-[50px] rounded-lg"
          />
          <p className="text-sm font-medium text-white">{name}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFollowing(id);
          }}
          className={`mr-2 h-auto w-auto p-0 transition-all ease-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={unfollow}
            alt="unfollow-artist"
            className="h-[28px] w-[28px]"
          />
        </button>
      </Link>
    );
  };

  return (
    <div className="relative h-[95vh] w-full overflow-y-scroll scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
      <div className="absolute right-2 top-2 h-auto w-auto">
        <RouteNav />
      </div>
      <h2 className="font p-2 px-2 text-2xl font-semibold">Your Library</h2>
      <div className="mt-8 flex h-full w-full flex-col items-center justify-start px-3 py-2">
        <div className="h-auto w-full overflow-x-hidden overflow-y-scroll">
          <div className="mb-3 h-[215px] w-full overflow-x-hidden">
            <div className="mb-2 flex h-[28px] w-full items-center justify-between">
              <h2 className="text-md w-auto font-semibold">Your playlists</h2>
              <button
                type="button"
                style={{
                  outline: "none",
                  border: "none",
                }}
                onClick={(e) => createNewPlaylist(e)}
                className="h-auto w-auto p-0"
              >
                <img
                  src={add}
                  alt="add-to-playlist"
                  className="h-[20px] w-[20px]"
                />
              </button>
            </div>
            <ul className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
              {library.userPlaylists.map((playlist: UserPlaylist) => (
                <CustomPlaylist key={playlist.id} playlist={playlist} />
              ))}
            </ul>
          </div>
          <div className="mb-3 h-[215px] w-full overflow-x-hidden">
            <h2 className="text-md mb-2 w-full font-semibold">Playlists</h2>
            <ul className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
              {library.playlists.map(
                (playlist: PlaylistById | UserPlaylist) => (
                  <LibraryPlaylist key={playlist.id} playlist={playlist} />
                ),
              )}
            </ul>
          </div>
          <div className="mb-3 h-[215px] w-full overflow-x-hidden">
            <h2 className="text-md mb-2 w-full font-semibold">Albums</h2>
            <ul className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
              {library.albums.map((album: AlbumById) => (
                <LibraryAlbum key={album.id} album={album} />
              ))}
            </ul>
          </div>
          <div className="mb-3 h-auto w-full overflow-x-hidden">
            <h2 className="text-md mb-3 w-full font-semibold">Followings</h2>
            <ul className="h-auto max-h-fit w-full overflow-x-scroll">
              {library.followings.map((following: ArtistType) => (
                <Following
                  key={following.id}
                  id={following.id}
                  image={following.image}
                  name={following.name}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
