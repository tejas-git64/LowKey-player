import Playlist from "../../components/Playlist/Playlist";
import RouteNav from "../../components/RouteNav/RouteNav";
import { useBoundStore } from "../../store/store";
import {
  AlbumById,
  ArtistInSong,
  LocalLibrary,
  PlaylistById,
  UserPlaylist,
} from "../../types/GlobalTypes";
import close from "../../assets/svgs/close.svg";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import userplaylist from "../../assets/fallbacks/playlist-fallback.webp";
import { Link } from "react-router-dom";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { FollowButton } from "../../components/FollowButton/FollowButton";
import { memo, useEffect, useState } from "react";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

export default function Library() {
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const setCreationMenu = useBoundStore((state) => state.setCreationMenu);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const setUserPlaylist = useBoundStore((state) => state.setUserPlaylist);
  const setLibraryPlaylist = useBoundStore((state) => state.setLibraryPlaylist);
  const setLibraryAlbum = useBoundStore((state) => state.setLibraryAlbum);
  const setFollowing = useBoundStore((state) => state.setFollowing);
  const playlists = useBoundStore((state) => state.library.playlists);
  const albums = useBoundStore((state) => state.library.albums);
  const followings = useBoundStore((state) => state.library.followings);
  const [hydrated, setHydrated] = useState(false);

  function createNewPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.stopPropagation();
    setCreationMenu(true);
    setRevealCreation(true);
  }

  useEffect(() => {
    const localSaves = localStorage.getItem("local-library");
    if (localSaves !== null) {
      const {
        albums: lastAlbums,
        followings: lastFollowings,
        playlists: lastPlaylists,
        userPlaylists: lastUserPlaylists,
      }: LocalLibrary = JSON.parse(localSaves);
      lastAlbums?.forEach(setLibraryAlbum);
      lastUserPlaylists?.forEach(setUserPlaylist);
      lastPlaylists?.forEach(setLibraryPlaylist);
      lastFollowings?.forEach(setFollowing);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveToLocalStorage("local-library", {
        albums,
        playlists,
        userPlaylists,
        followings,
      });
    }
  }, [userPlaylists, playlists, albums, followings]);

  return (
    <div className="relative max-h-fit min-h-full w-full scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
      <div className="absolute right-2 top-2 h-auto w-auto">
        <RouteNav />
      </div>
      <h2 className="font p-2 px-2 text-2xl font-semibold text-white">
        Your Library
      </h2>
      <div className="mb-2 flex h-auto w-full items-center justify-end px-3">
        <button
          type="button"
          onClick={(e) => createNewPlaylist(e)}
          className="h-auto w-auto rounded-sm bg-neutral-300 py-1.5 pl-2 pr-3 text-sm font-semibold text-black transition-colors ease-in hover:bg-neutral-200"
        >
          ➕ New playlist
        </button>
      </div>
      {userPlaylists.length > 0 ||
      playlists.length > 0 ||
      albums.length > 0 ||
      followings.length > 0 ? (
        <div className="h-auto w-full overflow-x-hidden overflow-y-scroll px-3">
          {userPlaylists && userPlaylists.length > 0 && (
            <div className="mb-3 flex h-full max-h-max w-full flex-col items-start justify-start">
              {userPlaylists && (
                <CustomPlaylists userPlaylists={userPlaylists} />
              )}
            </div>
          )}
          {playlists && playlists.length > 0 && (
            <div className="mb-3 h-[215px] w-full overflow-x-hidden">
              <LibraryPlaylists playlists={playlists} />
            </div>
          )}
          {albums && albums.length > 0 && (
            <div className="mb-3 h-[215px] w-full overflow-x-hidden">
              <LibraryAlbums albums={albums} />
            </div>
          )}
          {followings &&
            followings.length > 0 &&
            followings.map((following: ArtistInSong) => (
              <div
                key={following.id}
                className="mb-[30dvh] h-auto w-full overflow-hidden"
              >
                <h2 className="text-md w-full font-semibold text-white">
                  Followings
                </h2>
                <ul className="mt-1 h-auto w-full">
                  <Following {...following} />
                </ul>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex h-[70dvh] w-full items-center justify-center">
          <p className="text-neutral-400">Add something to your library</p>
        </div>
      )}
    </div>
  );
}

const Following = memo(({ id, name, image }: any) => {
  return (
    <Link
      to={`/artists/${id}`}
      className="flex h-[50px] w-full items-center justify-between bg-inherit p-3 pr-4 transition-colors hover:bg-neutral-800"
    >
      <div className="flex h-full w-[80%] items-center justify-start">
        <img
          src={image[0]?.url || artistfallback}
          alt="artist"
          loading="eager"
          fetchPriority="high"
          className="mr-4 h-[40px] w-[40px] rounded-sm"
        />
        <p className="text-sm font-medium text-white">
          {name || "Unknown Artist"}
        </p>
      </div>
      <FollowButton
        artist={{
          id: id,
          name: name,
          role: "",
          image: image,
          type: "",
          url: "",
        }}
      />
    </Link>
  );
});

const CustomPlaylists = memo(
  ({ userPlaylists }: { userPlaylists: UserPlaylist[] }) => {
    const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const queueId = useBoundStore((state) => state.nowPlaying.queue?.id);
    const setQueue = useBoundStore((state) => state.setQueue);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
    const removeUserPlaylist = useBoundStore(
      (state) => state.removeUserPlaylist,
    );

    return (
      <>
        <div className="flex h-full w-full flex-col items-start justify-start overflow-x-scroll">
          <h2 className="mb-3 w-auto text-base font-semibold text-white">
            Your playlists
          </h2>
          {userPlaylists.map((playlist) => (
            <Link
              to={`/userplaylists/${playlist.id}`}
              key={playlist.id}
              className="group relative h-fit w-fit"
            >
              <div className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center justify-center">
                <img
                  src={userplaylist}
                  alt="user-profile"
                  loading="eager"
                  fetchPriority="high"
                  className="h-[150px] w-[150px] shadow-md shadow-black brightness-100 transition-all ease-linear group-hover:brightness-90"
                />
                <p className="mt-1.5 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-sm font-semibold text-neutral-400 transition-colors ease-linear group-hover:text-white sm:text-sm">
                  {playlist.name}
                </p>
              </div>
              <div className="absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent opacity-0 transition-all ease-in group-hover:opacity-100">
                {playlist.songs.length > 0 && (
                  <button
                    type="button"
                    className="-ml-2 mr-2 rounded-full bg-emerald-400 p-2"
                    onClick={(e) =>
                      handleCollectionPlayback(
                        e,
                        {
                          id: String(playlist.id),
                          image: false,
                          name: playlist.name,
                          songs: playlist.songs,
                        },
                        isPlaying,
                        setQueue,
                        setNowPlaying,
                        setIsPlaying,
                      )
                    }
                  >
                    <img
                      src={
                        isPlaying && queueId === String(playlist?.id)
                          ? pause
                          : play
                      }
                      alt="play album"
                      className="h-7 w-7"
                    />
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-full bg-white p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
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
          ))}
        </div>
      </>
    );
  },
);

const LibraryAlbums = memo(({ albums }: { albums: AlbumById[] }) => {
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const queueId = useBoundStore((state) => state.nowPlaying.queue?.id);
  const removeLibraryAlbum = useBoundStore((state) => state.removeLibraryAlbum);

  return (
    <>
      <h2 className="text-md mb-2 w-full font-semibold text-white">Albums</h2>
      <div className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
        {albums.map((album: AlbumById) => (
          <Link
            to={`/albums/${album.id}`}
            key={album.id}
            className="group relative h-fit w-fit"
          >
            <Playlist
              id={album.id}
              userId={album.id}
              name={album.name}
              songCount={album.songCount}
              username={""}
              firstname={""}
              lastname={""}
              language={""}
              image={album.image}
              url={album.url}
              songs={[]}
            />
            <div className="absolute left-0 top-0 flex h-[150px] w-full items-center justify-center bg-transparent opacity-0 transition-all ease-in hover:opacity-100">
              <button
                type="button"
                className="rounded-full bg-emerald-400 p-2"
                onClick={(e) =>
                  handleCollectionPlayback(
                    e,
                    album,
                    isPlaying,
                    setQueue,
                    setNowPlaying,
                    setIsPlaying,
                  )
                }
              >
                <img
                  src={isPlaying && queueId === album.id ? pause : play}
                  alt="play album"
                  className="h-7 w-7"
                />
              </button>
              <button
                type="button"
                className="ml-2 rounded-full bg-white p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeLibraryAlbum(album.id);
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
        ))}
      </div>
    </>
  );
});

const LibraryPlaylists = memo(
  ({ playlists }: { playlists: PlaylistById[] }) => {
    const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const queueId = useBoundStore((state) => state.nowPlaying.queue?.id);
    const setQueue = useBoundStore((state) => state.setQueue);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
    const removeLibraryPlaylist = useBoundStore(
      (state) => state.removeLibraryPlaylist,
    );

    return (
      <>
        <h2 className="text-md mb-2 w-full font-semibold text-white">
          Playlists
        </h2>
        <div className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
          {playlists.map((playlist) => (
            <Link
              to={`/playlists/${playlist.id}`}
              key={playlist.id}
              className="group relative h-fit w-fit"
            >
              <Playlist
                id={playlist.id}
                userId={playlist.userId}
                name={playlist.name}
                songCount={playlist.songCount}
                username={playlist.username}
                firstname={playlist.firstname}
                lastname={playlist.lastname}
                language={""}
                image={playlist.image}
                url={playlist.url}
                songs={[]}
              />
              <div className="absolute left-0 top-0 flex h-[150px] w-full items-center justify-center opacity-0 transition-all ease-in group-hover:opacity-100">
                <button
                  type="button"
                  className="rounded-full bg-emerald-400 p-2"
                  onClick={(e) =>
                    handleCollectionPlayback(
                      e,
                      playlist,
                      isPlaying,
                      setQueue,
                      setNowPlaying,
                      setIsPlaying,
                    )
                  }
                >
                  <img
                    src={isPlaying && queueId === playlist.id ? pause : play}
                    alt="pause album"
                    className="h-[25px] w-[25px]"
                  />
                </button>
                <button
                  type="button"
                  className="ml-2 rounded-full bg-white p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeLibraryPlaylist(playlist.id);
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
          ))}
        </div>
      </>
    );
  },
);
