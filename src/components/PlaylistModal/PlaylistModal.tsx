import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useBoundStore } from "../../store/store";
import { TrackDetails, UserPlaylist } from "../../types/GlobalTypes";
import close from "../../assets/svgs/close.svg";
import add from "../../assets/svgs/icons8-plus.svg";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

export default function PlaylistModal({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const createNewUserPlaylist = useBoundStore(
    (state) => state.createNewUserPlaylist,
  );
  const revealCreation = useBoundStore((state) => state.revealCreation);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const creationTrack = useBoundStore((state) => state.creationTrack);
  const [name, setName] = useState<string>("");
  const isPlaylistPresent = userPlaylists.some(
    (playlist: UserPlaylist) => playlist.name === name,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const createNew = () => {
    if (isPlaylistPresent) {
      alert(`Playlist ${name} already exists`);
    } else {
      name && createNewUserPlaylist(name, Math.floor(Math.random() * 10000));
      setName("");
    }
  };

  useEffect(() => {
    if (ref.current) {
      if (revealCreation) {
        ref.current.style.overflow = "hidden";
      } else {
        ref.current.style.overflow = "auto";
      }
    }
  }, [revealCreation]);

  useEffect(() => {
    if (revealCreation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [revealCreation]);

  useEffect(() => {
    saveToLocalStorage("local-library", {
      userPlaylists,
    });
  }, [userPlaylists]);

  return (
    <>
      <div
        data-testid="playlist-modal"
        className={` ${
          revealCreation ? "flex" : "hidden"
        } absolute inset-0 z-10 h-full w-full flex-col items-center justify-center overflow-hidden bg-[#00000098]`}
      >
        <div className="-mt-14 flex h-auto w-[90%] flex-col items-start justify-between rounded-sm bg-neutral-800 p-3 px-4 sm:w-[600px]">
          <div className="flex w-full items-center justify-between">
            <h2 className="whitespace-nowrap text-xl font-bold text-white">
              Add to playlist
            </h2>
            <button
              type="button"
              tabIndex={0}
              data-testid="close-btn"
              onClick={() => {
                setName("");
                setRevealCreation(false);
              }}
              className="flex-shrink-0 whitespace-nowrap bg-neutral-700 p-1 transition-all ease-out hover:bg-neutral-600 focus-visible:bg-neutral-500"
              aria-label="Close playlist modal"
            >
              <img
                src={close}
                alt="close"
                className="h-5 w-5 flex-shrink-0 rounded-full invert"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="mt-4 flex h-10 w-full items-center justify-between p-0">
            <input
              ref={inputRef}
              type="text"
              name="playlist-name"
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createNew();
                }
              }}
              className="mr-3.5 h-full w-full rounded-sm bg-neutral-950 px-2 font-semibold placeholder:text-sm placeholder:text-neutral-500"
              placeholder="Playlist name here.."
              aria-label="Playlist name"
            />
            <button
              type="button"
              tabIndex={0}
              data-testid="create-playlist-btn"
              onClick={createNew}
              className="h-full whitespace-nowrap rounded-sm bg-neutral-400 px-3 text-sm font-semibold text-black transition-all ease-out hover:bg-white focus-visible:bg-white"
              aria-label="Create new playlist"
            >
              <img
                src={add}
                alt="add-icon"
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
            </button>
          </div>
          <div
            data-testid="userplaylists-container"
            className={`max-h-auto h-auto w-full flex-col items-center justify-center ${
              creationTrack ? "block" : "hidden"
            }`}
          >
            <ul
              data-testid="userplaylists"
              className="my-4 min-h-48 w-full list-none flex-col overflow-y-scroll rounded-sm border border-black bg-neutral-950"
            >
              {userPlaylists.length > 0 ? (
                userPlaylists.map((playlist: UserPlaylist) => (
                  <CustomPlaylist
                    key={playlist.id}
                    id={playlist.id}
                    name={playlist.name}
                    creationTrack={creationTrack || null}
                  />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="pt-20 text-sm text-neutral-400">
                    No current playlists
                  </p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const CustomPlaylist = memo(
  ({
    id,
    name,
    creationTrack,
  }: {
    id: number;
    name: string;
    creationTrack: TrackDetails | null;
  }) => {
    const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
    const setToUserPlaylist = useBoundStore((state) => state.setToUserPlaylist);
    const activity = useBoundStore((state) => state.recents.activity);
    const removeFromUserPlaylist = useBoundStore(
      (state) => state.removeFromUserPlaylist,
    );
    const isInPlaylist = useMemo(
      () =>
        userPlaylists
          .find((pl) => pl.id === id)
          ?.songs.some((song) => song.id === creationTrack?.id) || false,
      [userPlaylists, id, creationTrack?.id],
    );

    const setPlaylist = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (creationTrack) {
        if (e.target.checked) {
          setToUserPlaylist(creationTrack, id);
        } else {
          removeFromUserPlaylist(id, creationTrack.id);
        }
      }
    };

    useEffect(() => {
      saveToLocalStorage("last-recents", {
        activity,
      });
    }, [userPlaylists]);

    return (
      <li
        data-testid="custom playlist"
        className="flex h-12 w-full items-center justify-start border-y border-neutral-950 bg-neutral-800 px-4"
      >
        <label
          htmlFor={`new-playlist-${id}`}
          className="mr-4 line-clamp-1 w-full cursor-pointer overflow-hidden text-ellipsis py-2 text-base font-semibold text-white focus-visible:bg-neutral-400"
        >
          {name}
        </label>
        <input
          type="checkbox"
          tabIndex={0}
          name={`new-playlist-${id}`}
          id={`new-playlist-${id}`}
          checked={isInPlaylist}
          onChange={(e) => setPlaylist(e)}
          className="mx-1 h-[18px] w-[18px] cursor-pointer accent-emerald-500"
        />
      </li>
    );
  },
);
