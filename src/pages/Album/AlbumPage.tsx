import { useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { getAlbumData } from "../../api/requests";
import Song from "../../components/Song/Song";
import { useBoundStore } from "../../store/store";
import { TrackDetails } from "../../types/GlobalTypes";
import favorite from "../../assets/icons8-heart.svg";
import favorited from "../../assets/icons8-favorited.svg";
import fallback from "../../assets/playlist-fallback.webp";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import shuffle from "../../assets/icons8-shuffle.svg";
import random from "../../assets/icons8-shuffle-activated.svg";
import addPlaylist from "../../assets/icons8-addplaylist-28.svg";
import addedToPlaylist from "../../assets/icons8-tick.svg";
import ListLoading from "../Playlist/Loading";
import { useQuery } from "@tanstack/react-query";
import RouteNav from "../../components/RouteNav/RouteNav";

export default function AlbumPage() {
  const { id } = useParams();
  const {
    album,
    setAlbum,
    setFavoriteAlbum,
    removeFavoriteAlbum,
    favorites,
    setLibraryAlbum,
    removeLibraryAlbum,
    library,
    setNowPlaying,
    setIsPlaying,
    nowPlaying,
    setQueue,
    isShuffling,
    setIsShuffling,
  } = useBoundStore();

  const { isPending: albumPending } = useQuery({
    queryKey: ["albumPage"],
    queryFn: () => id && getAlbumData(id),
    select: (data) => setAlbum(data.data),
  });

  function playNewAlbum(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
    album !== null &&
      setQueue({
        id: album.id,
        name: album.name,
        image: album.image || false,
        songs: album.songs,
      });
  }

  useEffect(() => {
    setNowPlaying(nowPlaying.queue.songs[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPlaying.queue.id]);

  useEffect(() => {
    id && getAlbumData(id);
  }, [id]);

  const AlbumPageById = () => {
    return (
      <div className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth">
        <div className="relative flex h-auto w-full flex-col items-center justify-center border-b border-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700 p-3 sm:h-[230px] sm:px-4">
          <div className="absolute right-2 top-2 h-auto w-auto">
            <RouteNav />
          </div>
          <div className="flex h-auto w-full flex-col items-start justify-start pt-1 sm:flex-row sm:items-center">
            <img
              src={
                album.image !== undefined || album.image !== null
                  ? album.image[1].link
                  : fallback
              }
              alt="img"
              className="mr-4 h-[150px] w-[150px]"
              style={{
                boxShadow: "5px 5px 0px #000",
              }}
              onError={(e) => (e.currentTarget.src = fallback)}
            />
            <p className="text-md mb-1 mt-2 line-clamp-1 h-auto w-[50%] text-ellipsis text-left text-xl font-semibold capitalize text-white sm:line-clamp-3 sm:w-[40%] sm:text-3xl sm:font-bold">
              {album.name || ""}
            </p>
          </div>
          <div className="flex h-auto w-full items-center justify-between">
            <div className="flex h-auto w-[50%] flex-col items-start justify-center sm:mt-2 sm:w-[30%]">
              <div
                style={{
                  wordSpacing: "5px",
                }}
                className="mb-1 w-full leading-tight sm:line-clamp-2"
              >
                <p className="line-clamp-1 w-[75%] overflow-hidden whitespace-nowrap text-sm text-neutral-400 sm:w-fit">
                  {album.primaryArtists || ""}
                </p>
              </div>
              <p className="text-sm text-neutral-400">
                {album.songCount} Tracks
              </p>
            </div>
            <div className="flex h-auto w-[180px] items-center justify-between">
              {library.albums.some((album) => album.id === id) ? (
                <button
                  type="button"
                  style={{
                    outline: "none",
                    border: "none",
                  }}
                  onClick={() => id && removeLibraryAlbum(id)}
                  className="border border-white p-0"
                >
                  <img
                    src={addedToPlaylist}
                    alt="added-to-playlist"
                    className="h-[25px] w-[25px]"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    outline: "none",
                    border: "none",
                  }}
                  onClick={() => setLibraryAlbum(album)}
                  className="border border-white p-0"
                >
                  <img
                    src={addPlaylist}
                    alt="add-to-playlist"
                    className="h-[25px] w-[25px]"
                  />
                </button>
              )}
              {favorites.albums?.some((data) => data.id === id) ? (
                <button
                  type="button"
                  style={{
                    outline: "none",
                    border: "none",
                  }}
                  onClick={() => removeFavoriteAlbum(album.id)}
                  className="border border-white p-0"
                >
                  <img
                    src={favorited}
                    alt="favorited"
                    className="h-[28px] w-[28px]"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    outline: "none",
                    border: "none",
                  }}
                  onClick={() => setFavoriteAlbum(album)}
                  className="border border-white p-0"
                >
                  <img
                    src={favorite}
                    alt="favorite"
                    className="h-[28px] w-[28px]"
                  />
                </button>
              )}
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
                  <img
                    src={random}
                    alt="random"
                    className="h-[28px] w-[28px]"
                  />
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
                  <img
                    src={shuffle}
                    alt="shuffle"
                    className="h-[28px] w-[28px]"
                  />
                </button>
              )}
              {(nowPlaying.isPlaying && nowPlaying.queue.id === id) ||
              (nowPlaying.isPlaying &&
                album.songs.some(
                  (song) => song.id === nowPlaying.track?.id,
                )) ? (
                <button
                  type="button"
                  style={{
                    outline: "none",
                    border: "none",
                  }}
                  onClick={() => setIsPlaying(false)}
                  className="rounded-full bg-emerald-400 p-1.5"
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
                  onClick={(e) => playNewAlbum(e)}
                  className="rounded-full bg-emerald-400 p-1.5"
                >
                  <img src={play} alt="play" />
                </button>
              )}
            </div>
          </div>
        </div>
        <ul className="flex h-auto min-h-[71.5dvh] w-full flex-col items-start justify-start bg-neutral-900 px-3 py-2 pb-28 sm:pb-20">
          {album.songs.length > 0 ? (
            album.songs.map((song: TrackDetails) => (
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
            ))
          ) : (
            <p className="m-auto text-xl text-neutral-500">
              No songs here...T_T
            </p>
          )}
        </ul>
      </div>
    );
  };

  const DataComponent = () => {
    if (!albumPending) {
      return <AlbumPageById />;
    } else {
      if (id !== album.id) {
        throw new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  return (
    <Suspense fallback={<ListLoading />}>
      <DataComponent />
    </Suspense>
  );
}
