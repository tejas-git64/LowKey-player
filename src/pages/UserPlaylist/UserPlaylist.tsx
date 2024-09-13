import RouteNav from "../../components/RouteNav/RouteNav";
import playlistImg from "../../assets/playlist-fallback.webp";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import shuffle from "../../assets/icons8-shuffle.svg";
import random from "../../assets/icons8-shuffle-activated.svg";
import { useBoundStore } from "../../store/store";
import { useParams } from "react-router-dom";
import { TrackDetails, UserPlaylist } from "../../types/GlobalTypes";
import Song from "../../components/Song/Song";

export default function UserPlaylistPage() {
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const nowPlaying = useBoundStore((state) => state.nowPlaying);
  const library = useBoundStore((state) => state.library);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const { id } = useParams();
  const playlist: UserPlaylist | undefined = library.userPlaylists.find(
    (playlist: UserPlaylist) => playlist.id === Number(id),
  );

  function playPlaylist(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (nowPlaying.queue.id !== String(playlist?.id)) {
      playlist &&
        setQueue({
          id: String(playlist?.id),
          name: playlist?.name,
          image: false,
          songs: playlist?.songs,
        });
      playlist && setNowPlaying(playlist.songs[0]);
    }
    setIsPlaying(true);
  }

  return (
    <>
      <div className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth">
        <div className="relative flex h-[210px] w-full items-end justify-between border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 px-4 py-3 sm:h-fit sm:py-1.5 sm:pb-3">
          <div className="absolute right-2 top-2 h-auto w-auto">
            <RouteNav />
          </div>
          <div className="flex h-auto w-full flex-col items-start justify-start sm:flex-row sm:items-center">
            <img
              src={playlistImg}
              alt="img"
              style={{
                boxShadow: "5px 5px 0px #000",
              }}
              className="mr-4 mt-1 h-[150px] w-[150px]"
            />
            <p className="mt-1 line-clamp-1 h-auto w-[80%] text-ellipsis text-left text-xl font-semibold text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
              {playlist?.name}
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
                className="border border-white bg-transparent p-0"
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
                className="border border-white bg-transparent p-0"
              >
                <img
                  src={shuffle}
                  alt="shuffle"
                  className="h-[28px] w-[28px]"
                />
              </button>
            )}
            {playlist?.id === Number(nowPlaying.queue.id) &&
            nowPlaying.isPlaying ? (
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
                onClick={(e) => playPlaylist(e)}
                className="rounded-full bg-emerald-400 p-2"
              >
                <img src={play} alt="play" />
              </button>
            )}
          </div>
        </div>
        <div className="mx-auto h-auto min-h-[80dvh] w-full bg-neutral-900">
          {playlist?.songs?.length ? (
            <ul className="flex max-h-fit min-h-[23dvh] w-full flex-col items-start justify-start bg-transparent px-4 py-2 pb-28 sm:pb-20">
              {playlist?.songs.map((song: TrackDetails) => (
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
                  artists={song.artists}
                  explicitContent={song.explicitContent}
                  playCount={song.playCount}
                  language={song.language}
                  hasLyrics={song.hasLyrics}
                  url={song.url}
                  copyright={song.copyright}
                  image={song.image}
                  downloadUrl={song.downloadUrl}
                  lyricsId={undefined}
                />
              ))}
            </ul>
          ) : (
            <p className="m-auto w-full py-40 text-center text-xl text-neutral-400">
              No songs here...T_T
            </p>
          )}
        </div>
      </div>
    </>
  );
}
