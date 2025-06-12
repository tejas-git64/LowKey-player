import { useEffect, useState, useMemo } from "react";
import { useBoundStore } from "../../store/store";
import { UserPlaylist } from "../../types/GlobalTypes";
import close from "../../assets/svgs/close.svg";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

//Playlist Creation Component
export default function Creation() {
  const isCreationMenu = useBoundStore((state) => state.isCreationMenu);
  const setCreationMenu = useBoundStore((state) => state.setCreationMenu);
  const setToUserPlaylist = useBoundStore((state) => state.setToUserPlaylist);
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const createNewUserPlaylist = useBoundStore(
    (state) => state.createNewUserPlaylist,
  );
  const revealCreation = useBoundStore((state) => state.revealCreation);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const creationTrack = useBoundStore((state) => state.creationTrack);
  const ids: Set<number> = new Set([]);
  const [name, setName] = useState("");
  const isPlaylistPresent = useMemo(
    () =>
      userPlaylists.some((playlist: UserPlaylist) => playlist.name === name),
    [userPlaylists],
  );

  function addToIds(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    if (e.target.checked) {
      ids.add(id);
    } else {
      ids.delete(id);
    }
  }

  function addToPlaylist() {
    Array.from(ids).forEach((id: number) => {
      if (creationTrack) {
        setToUserPlaylist(creationTrack, id);
      }
    });
    setRevealCreation(false);
  }

  function createNew() {
    if (isPlaylistPresent) {
      alert(`Playlist ${name} already exists`);
    } else {
      createNewUserPlaylist(name, Math.floor(Math.random() * 10000));
      setRevealCreation(false);
    }
  }

  useEffect(() => {
    saveToLocalStorage("local-library", {
      userPlaylists,
    });
  }, [userPlaylists]);

  const CustomPlaylist = ({ id, name }: { id: number; name: string }) => {
    return (
      <>
        <li className="mb-1 flex h-10 w-full items-center justify-start rounded-xl bg-neutral-600 px-3">
          <input
            type="checkbox"
            name="playlist-1"
            id="playlist-1"
            onChange={(e) => addToIds(e, id)}
            className="mx-1 h-3.5 w-3.5 bg-black"
          />
          <label className="ml-3 line-clamp-1 w-[90%] overflow-hidden text-ellipsis text-xs text-white">
            {name}
          </label>
        </li>
      </>
    );
  };

  return (
    <>
      <div
        className={`absolute left-0 top-0 ${
          revealCreation === false ? "hidden" : "flex"
        } z-20 h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-t from-black via-neutral-950 to-transparent`}
      >
        <div className="flex h-auto w-[90%] flex-col items-start justify-between rounded-xl bg-neutral-800 p-3 sm:w-[450px] lg:w-[600px]">
          <div className="flex w-full items-center justify-between">
            <h2 className="whitespace-nowrap text-sm text-white">
              Add to playlist
            </h2>
            <div className="flex w-[135px] items-center justify-between">
              <button
                type="button"
                onClick={() => setCreationMenu(true)}
                className="whitespace-nowrap rounded-full bg-neutral-300 p-1 px-4 text-sm text-black transition-all ease-out hover:bg-white"
              >
                Create new
              </button>
              <button
                type="button"
                onClick={() => setRevealCreation(false)}
                className="flex-shrink-0 whitespace-nowrap rounded-full p-0 transition-all ease-out hover:invert"
              >
                <img
                  src={close}
                  alt="close"
                  className="h-[25px] w-[25px] flex-shrink-0 rounded-full invert-0"
                />
              </button>
            </div>
          </div>
          {userPlaylists?.length < 1 && creationTrack && (
            <p className="text-xs text-red-400">
              Create a playlist first to add to*
            </p>
          )}
          <div
            className={`mt-3 h-fit w-full flex-col overflow-hidden rounded-xl border border-black p-1 transition-all ease-in-out ${
              isCreationMenu ? "flex" : "hidden"
            }`}
          >
            <input
              style={{
                outline: "none",
                border: "none",
              }}
              type="text"
              className="mx-auto my-1 w-[98%] rounded-xl bg-neutral-950 p-2 px-3 text-sm text-white placeholder:text-neutral-500"
              placeholder="Enter playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex h-10 w-full items-center justify-around">
              <button
                type="button"
                onClick={() => setCreationMenu(false)}
                className="w-20 whitespace-nowrap bg-neutral-600 py-1.5 text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createNew}
                className="w-20 whitespace-nowrap border-2 bg-neutral-100 py-1.5 text-xs text-black"
              >
                Create ✨
              </button>
            </div>
          </div>
          <div
            className={`h-auto w-full flex-col items-center justify-center ${
              creationTrack ? "block" : "hidden"
            }`}
          >
            <ul className="mt-2 h-auto w-full list-none flex-col rounded-xl">
              {userPlaylists?.map((playlist: UserPlaylist) => (
                <CustomPlaylist
                  key={playlist.id}
                  id={playlist.id}
                  name={playlist.name}
                />
              ))}
            </ul>
            <button
              type="button"
              onClick={addToPlaylist}
              className={`mx-auto my-2 rounded-full bg-neutral-300 px-4 py-2 text-sm text-black hover:bg-white ${
                userPlaylists ? "block" : "hidden"
              }`}
            >
              Add to playlist 🎶
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
