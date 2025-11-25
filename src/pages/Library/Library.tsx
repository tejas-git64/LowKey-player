import Playlist from "../../components/Playlist/Playlist";
import RouteNav from "../../components/RouteNav/RouteNav";
import { useBoundStore } from "../../store/store";
import {
  AlbumById,
  ArtistInSong,
  Image,
  PlaylistById,
  UserPlaylist,
} from "../../types/GlobalTypes";
import close from "../../assets/svgs/close.svg";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import userplaylist from "../../assets/fallbacks/playlist-fallback.webp";
import playlistIcon from "../../assets/svgs/playlist-icon.svg";
import { useNavigate } from "react-router-dom";
import handleCollectionPlayback from "../../helpers/handleCollectionPlayback";
import { FollowButton } from "../../components/FollowButton/FollowButton";
import {
  memo,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";
import { animateScreen } from "../../helpers/animateScreen";
import useClearTimer from "../../hooks/useClearTimer";

export default function Library() {
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const playlists = useBoundStore((state) => state.library.playlists);
  const albums = useBoundStore((state) => state.library.albums);
  const followings = useBoundStore((state) => state.library.followings);
  const libElRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout>(null);
  const [hydrated, setHydrated] = useState(false);

  function createNewPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.stopPropagation();
    setRevealCreation(true);
  }

  function fadeOutNavigate(str: string) {
    if (libElRef.current) {
      libElRef.current.classList.add("home-fadeout");
      libElRef.current.classList.remove("home-fadein");
    }
    timerRef.current = setTimeout(() => {
      navigate(str);
    }, 150);
  }

  useClearTimer(timerRef);
  useEffect(() => {
    timerRef.current = animateScreen(libElRef);
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
  }, [userPlaylists, playlists, albums, followings, hydrated]);

  return (
    <div
      data-testid="library-page"
      ref={libElRef}
      className="home-fadeout relative max-h-fit min-h-full w-full scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 pb-56 duration-200 ease-in"
    >
      <div className="flex h-auto w-auto items-center justify-between bg-inherit px-3 py-1">
        <h2 className="text-2xl font-semibold text-white">Library</h2>
        <RouteNav />
      </div>
      <div className="my-2 flex h-auto w-full items-center justify-end px-3">
        <button
          type="button"
          tabIndex={0}
          data-testid="playlist-btn"
          onClick={(e) => createNewPlaylist(e)}
          className="h-auto w-auto rounded-sm bg-neutral-400 px-3 py-1.5 text-sm font-semibold text-black transition-colors ease-in hover:bg-neutral-200 focus-visible:bg-white"
        >
          New playlist
        </button>
      </div>
      {userPlaylists.length > 0 ||
      playlists.length > 0 ||
      albums.length > 0 ||
      followings.length > 0 ? (
        <div
          data-testid="library-container"
          className="h-auto w-full overflow-x-hidden overflow-y-scroll px-3"
        >
          {userPlaylists && userPlaylists.length > 0 && (
            <div
              data-testid="customplaylist-container"
              className="mb-3 flex h-full max-h-max w-full items-start justify-start"
            >
              <CustomPlaylists
                userPlaylists={userPlaylists}
                fadeOutNavigate={fadeOutNavigate}
              />
            </div>
          )}
          {playlists && playlists.length > 0 && (
            <div
              data-testid="playlists-container"
              className="mb-3 h-[215px] w-full overflow-x-hidden"
            >
              <LibraryPlaylists
                playlists={playlists}
                fadeOutNavigate={fadeOutNavigate}
              />
            </div>
          )}
          {albums && albums.length > 0 && (
            <div
              data-testid="albums-container"
              className="mb-3 h-[215px] w-full overflow-x-hidden"
            >
              <LibraryAlbums
                albums={albums}
                fadeOutNavigate={fadeOutNavigate}
              />
            </div>
          )}
          {followings && (
            <div
              data-testid="followings-container"
              className="mt-1 h-auto w-full"
            >
              <h2 className="text-md w-full font-semibold text-white">
                Followings
              </h2>
              <div className="mt-3 h-auto w-full overflow-hidden">
                {followings.map((following: ArtistInSong) => (
                  <Following
                    key={following.id}
                    {...following}
                    fadeOutNavigate={fadeOutNavigate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          data-testid="empty-message"
          className="flex h-[70dvh] w-full flex-col items-center justify-center"
        >
          <img
            src={playlistIcon}
            alt="playlist-icon"
            width={80}
            height={80}
            className="mb-2 invert-[0.6]"
          />
          <p className="text-lg text-neutral-400">Your library is empty</p>
        </div>
      )}
    </div>
  );
}

const Following = memo(
  ({
    id,
    name,
    image,
    fadeOutNavigate,
  }: {
    id: string;
    name: string;
    image: Image[];
    fadeOutNavigate: (str: string) => void;
  }) => {
    return (
      <div
        data-testid="following"
        onClick={() => fadeOutNavigate(`/artists/${id}`)}
        role="link"
        tabIndex={0}
        className="flex h-[50px] w-full cursor-pointer items-center justify-between bg-inherit px-1.5 transition-colors hover:bg-neutral-800"
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
      </div>
    );
  },
);
Following.displayName = "Following";

const CustomPlaylists = memo(
  ({
    userPlaylists,
    fadeOutNavigate,
  }: {
    userPlaylists: UserPlaylist[];
    fadeOutNavigate(str: string): void;
  }) => {
    return (
      <div
        data-test="custom-playlists"
        className="flex h-full w-full flex-col items-start justify-start"
      >
        <h2 className="mb-3 w-auto text-base font-semibold text-white">
          Your playlists
        </h2>
        <div className="flex h-auto w-full items-start justify-start overflow-x-scroll">
          {userPlaylists?.map((playlist) => (
            <CustomPlaylist
              key={playlist.name}
              playlist={playlist}
              fadeOutNavigate={fadeOutNavigate}
            />
          ))}
        </div>
      </div>
    );
  },
);
CustomPlaylists.displayName = "CustomPlaylists";

const CustomPlaylist = memo(
  ({
    playlist,
    fadeOutNavigate,
  }: {
    playlist: UserPlaylist;
    fadeOutNavigate: (str: string) => void;
  }) => {
    const removeUserPlaylist = useBoundStore(
      (state) => state.removeUserPlaylist,
    );

    return (
      <div
        data-testid="userplaylist"
        onClick={() => fadeOutNavigate(`/userplaylists/${playlist.id}`)}
        role="link"
        tabIndex={0}
        key={playlist.id}
        className="group relative h-fit w-fit cursor-pointer"
      >
        <div className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 list-none flex-col items-center justify-center">
          <div className="h-[150px] w-[150px] overflow-hidden">
            <img
              src={userplaylist}
              alt="user-profile"
              loading="eager"
              fetchPriority="high"
              width={150}
              height={150}
              className="h-full w-full scale-105 shadow-md shadow-black brightness-100 transition-all ease-linear group-hover:scale-100 group-hover:brightness-90 group-focus:scale-100"
            />
          </div>
          <p className="mt-1.5 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-sm font-semibold text-neutral-400 transition-colors ease-linear group-hover:text-white sm:text-sm">
            {playlist.name}
          </p>
        </div>
        <div className="absolute left-0 top-0 -ml-2 flex h-[150px] w-full items-center justify-center opacity-0 transition-all ease-in group-hover:bg-[#0000004b] group-hover:opacity-100">
          {playlist.songs.length > 0 && (
            <HoverPlayButton key={playlist.name} playlist={playlist} />
          )}
          <button
            type="button"
            data-testid="menu-close-btn"
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
              className="h-6 w-6 rounded-full p-1"
            />
          </button>
        </div>
      </div>
    );
  },
);
CustomPlaylist.displayName = "CustomPlaylist";

const HoverPlayButton = ({
  playlist,
}: {
  playlist: UserPlaylist | PlaylistById;
}) => {
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const inQueue = useMemo(
    () => queue !== null && queue.id === String(playlist.id),
    [playlist.id, queue],
  );

  return (
    <button
      type="button"
      data-testid="hover-playlist-btn"
      className="mx-2 rounded-full bg-emerald-400 p-2"
      onClick={(e) =>
        handleCollectionPlayback(
          e,
          {
            id: String(playlist.id),
            image: false,
            name: playlist.name,
            songs: playlist.songs,
          },
          startTransition,
          isPlaying,
          inQueue,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        )
      }
    >
      <img
        src={isPlaying && inQueue ? pause : play}
        alt="play album"
        className="h-7 w-7"
      />
    </button>
  );
};

const LibraryAlbums = memo(
  ({
    albums,
    fadeOutNavigate,
  }: { albums: AlbumById[] } & { fadeOutNavigate(str: string): void }) => {
    return (
      <>
        <h2 className="text-md mb-2 w-full font-semibold text-white">Albums</h2>
        <div className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
          {albums?.map((album: AlbumById, i: number) => (
            <LibraryAlbum
              key={album.name}
              i={i}
              album={album}
              fadeOutNavigate={fadeOutNavigate}
            />
          ))}
        </div>
      </>
    );
  },
);
LibraryAlbums.displayName = "LibraryAlbums";

const LibraryAlbum = memo(
  ({
    album,
    fadeOutNavigate,
    i,
  }: {
    album: AlbumById;
    fadeOutNavigate: (str: string) => void;
    i: number;
  }) => {
    const removeLibraryAlbum = useBoundStore(
      (state) => state.removeLibraryAlbum,
    );

    return (
      <div
        key={album.id}
        data-testid="album-container"
        onClick={() => fadeOutNavigate(`/albums/${album.id}`)}
        role="link"
        tabIndex={0}
        className="group relative h-fit w-fit cursor-pointer"
      >
        <Playlist
          i={i}
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
          fadeOutNavigate={fadeOutNavigate}
        />
        <div className="absolute left-0 top-0 -ml-2 flex h-[150px] w-full items-center justify-center opacity-0 transition-all ease-in hover:opacity-100 group-hover:bg-[#0000004b]">
          <AlbumHoverPlayButton album={album} />
          <button
            type="button"
            data-testid="album-remove-btn"
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
              className="h-6 w-6 rounded-full p-1"
            />
          </button>
        </div>
      </div>
    );
  },
);
LibraryAlbum.displayName = "LibraryAlbum";

const AlbumHoverPlayButton = ({ album }: { album: AlbumById }) => {
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const inQueue = useMemo(
    () => queue !== null && queue.name === String(album.name),
    [album.name, queue],
  );

  return (
    <button
      type="button"
      data-testid="album-play-btn"
      className="rounded-full bg-emerald-400 p-2"
      onClick={(e) =>
        handleCollectionPlayback(
          e,
          album,
          startTransition,
          isPlaying,
          inQueue,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        )
      }
    >
      <img
        src={isPlaying && inQueue ? pause : play}
        alt="play album"
        className="h-7 w-7"
      />
    </button>
  );
};

const LibraryPlaylists = memo(
  ({
    playlists,
    fadeOutNavigate,
  }: {
    playlists: PlaylistById[];
    fadeOutNavigate(str: string): void;
  }) => {
    return (
      <>
        <h2 className="text-md mb-2 w-full font-semibold text-white">
          Playlists
        </h2>
        <div className="flex h-[180px] w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
          {playlists?.map((playlist, i) => (
            <LibraryPlaylist
              key={playlist.name}
              i={i}
              playlist={playlist}
              fadeOutNavigate={fadeOutNavigate}
            />
          ))}
        </div>
      </>
    );
  },
);
LibraryPlaylists.displayName = "LibraryPlaylists";

const LibraryPlaylist = memo(
  ({
    playlist,
    fadeOutNavigate,
    i,
  }: {
    playlist: PlaylistById;
    fadeOutNavigate: (str: string) => void;
    i: number;
  }) => {
    const removeLibraryPlaylist = useBoundStore(
      (state) => state.removeLibraryPlaylist,
    );

    return (
      <div
        key={playlist.id}
        data-testid="playlist-container"
        onClick={() => fadeOutNavigate(`/playlists/${playlist.id}`)}
        role="link"
        tabIndex={0}
        className="group relative h-fit w-fit cursor-pointer"
      >
        <Playlist
          i={i}
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
          fadeOutNavigate={fadeOutNavigate}
        />
        <div className="absolute left-0 top-0 -ml-2 flex h-[150px] w-full items-center justify-center opacity-0 transition-all ease-in group-hover:opacity-100">
          <HoverPlayButton playlist={playlist} />
          <button
            type="button"
            data-testid="playlist-remove-btn"
            className="ml-2 mt-1 rounded-full bg-white p-0"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeLibraryPlaylist(playlist.id);
            }}
          >
            <img
              src={close}
              alt="remove"
              className="h-6 w-6 rounded-full p-1"
            />
          </button>
        </div>
      </div>
    );
  },
);
LibraryPlaylist.displayName = "LibraryPlaylist";
