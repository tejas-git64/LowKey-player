import Searchbar from "../../components/Searchbar/Searchbar";
import { useBoundStore } from "../../store/store";
import {
  AlbumResult,
  PlaylistResult,
  QueryResult,
  SongAlbumResult,
} from "../../types/GlobalTypes";
import fallback from "../../assets//playlist-fallback.webp";
import songfallback from "../../assets/icons8-song-fallback.png";
import artistfallback from "../../assets/icons8-artist-fallback.png";
import { Link, useNavigate } from "react-router-dom";
import RouteNav from "../../components/RouteNav/RouteNav";

export default function Search() {
  const { search, setNowPlaying, setIsPlaying } = useBoundStore();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function navigateQuery(type: string, id: string, res: any) {
    if (type === "playlist") {
      navigate(`/playlists/${id}`);
    }
    if (type === "album") {
      navigate(`/albums/${id}`);
    }
    if (type === "artist") {
      navigate(`/artists/${id}`);
    }
    if (type === "song") {
      setNowPlaying(res);
      setIsPlaying(true);
    }
  }

  return (
    <>
      <div className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth bg-neutral-900 p-4">
        <div className="mx-auto flex w-full items-center sm:px-2 lg:w-[95%]">
          <Searchbar />
          <RouteNav />
        </div>
        <div className="mx-auto mt-3 flex h-[88dvh] w-full flex-col items-start justify-start rounded-md sm:h-[83dvh]">
          {search.topQuery.results.length !== 0 ? (
            <div className="h-auto w-full">
              {/* Top query */}
              <ul className="h-auto w-full list-none sm:w-full sm:px-10">
                {search.topQuery.results.length > 0 && (
                  <p className="my-2 text-white">Top results</p>
                )}
                {search.topQuery.results.map((res: QueryResult) => (
                  <li
                    key={res.id}
                    id={res.id}
                    onClick={() => navigateQuery(res.type, res.id, res)}
                    className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-md bg-neutral-900"
                  >
                    <img
                      src={res.image ? res.image[0].url : ""}
                      alt="img"
                      className="mr-4 h-[50px] w-[50px] rounded-lg"
                    />
                    <p className="text-sm font-medium text-white">
                      {res.title.replace(/^(&#(\d+);)/g, "")}
                    </p>
                  </li>
                ))}
              </ul>
              {/* Top Songs */}
              <ul className="my-2 h-auto w-full list-none sm:px-10">
                {search.songs.results.length > 0 && (
                  <p className="my-2 text-white">Songs</p>
                )}
                {search.songs.results.map((song: SongAlbumResult) => (
                  <li
                    key={song.id}
                    id={song.id}
                    className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-md border-b border-black bg-neutral-900"
                  >
                    <img
                      src={song.image ? song.image[0].url : songfallback}
                      alt="img"
                      className="mr-4 h-[40px] w-[40px] rounded-lg"
                      onError={(e) => (e.currentTarget.src = songfallback)}
                    />
                    <div className="mr-4 flex h-auto w-[50%] flex-col items-start justify-center">
                      <p className="line-clamp-1 text-ellipsis text-sm text-white">
                        {song.title.replace(/^(&#(\d+);)/g, "")}
                      </p>
                      <p className="line-clamp-1 text-ellipsis text-xs text-neutral-400">
                        {song.primaryArtists}
                      </p>
                    </div>
                    <p className="line-clamp-1 w-[45%] text-ellipsis text-sm text-neutral-400">
                      {song.album}
                    </p>
                  </li>
                ))}
              </ul>
              {/* Playlists */}
              <div className="mb-2 h-auto w-full list-none sm:px-10">
                {search.playlists.results.length > 0 && (
                  <p className="my-2 text-white">Playlists</p>
                )}
                <ul
                  className={`${
                    search.playlists.results.length > 0 ? "flex" : "hidden"
                  } mb-2 h-auto w-full list-none items-center justify-start overflow-y-hidden overflow-x-scroll pb-10`}
                >
                  {search.playlists.results.map(
                    ({ id, title, image }: PlaylistResult) => (
                      <li
                        key={id}
                        className="mr-4 flex h-[150px] w-[150px] flex-shrink-0 list-none flex-col items-center"
                      >
                        <Link to={`/playlists/${id}`} className="h-auto w-auto">
                          <img
                            src={image ? image[1].url : fallback}
                            alt="user-profile"
                            className="h-[150px] w-[150px] shadow-md shadow-black"
                            onError={(e) => (e.currentTarget.src = fallback)}
                          />
                          <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
                            {title.replace(/^(&#(\d+);)/g, "")}
                          </p>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              {/* Artists */}
              <div className="mb-2 h-auto w-full list-none sm:px-10">
                {search.artists.results.length > 0 && (
                  <p className="my-2 text-white">Artists</p>
                )}
                <ul
                  className={`${
                    search.artists.results.length > 0 ? "flex" : "hidden"
                  } mb-2 h-auto w-full list-none items-center justify-start overflow-y-hidden overflow-x-scroll pb-10`}
                >
                  {search.artists.results.map(
                    ({ id, title, image }: AlbumResult) => (
                      <li
                        key={id}
                        className="mr-4 flex h-[150px] w-[150px] flex-shrink-0 list-none flex-col items-center"
                      >
                        <Link to={`/artists/${id}`} className="h-auto w-auto">
                          <img
                            src={image ? image[1].url : artistfallback}
                            alt="user-profile"
                            className="h-[150px] w-[150px] rounded-full shadow-md shadow-black"
                            onError={(e) =>
                              (e.currentTarget.src = artistfallback)
                            }
                          />
                          <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
                            {title.replace(/^(&#(\d+);)/g, "")}
                          </p>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              {/* Albums */}
              <div className="mb-2 h-auto w-full list-none pb-24 sm:px-10 sm:pb-0">
                {search.albums.results.length > 0 && (
                  <p className="my-2 text-white">Albums</p>
                )}
                <ul
                  className={`${
                    search.albums.results.length > 0 ? "flex" : "hidden"
                  } mb-2 h-auto w-full list-none items-center justify-start overflow-y-hidden overflow-x-scroll pb-10`}
                >
                  {search.albums.results.map(
                    ({ id, title, image }: SongAlbumResult) => (
                      <li
                        key={id}
                        className="mr-4 flex h-[150px] w-[150px] flex-shrink-0 list-none flex-col items-center"
                      >
                        <Link to={`/albums/${id}`} className="h-auto w-auto">
                          <img
                            src={image ? image[1].url : fallback}
                            alt="user-profile"
                            className="h-[150px] w-[150px] shadow-md shadow-black"
                            onError={(e) => (e.currentTarget.src = fallback)}
                          />
                          <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
                            {title.replace(/^(&#(\d+);)/g, "")}
                          </p>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="sm:h-[83dvh]w mx-auto -mt-6 flex h-[88dvh] w-full flex-col items-center justify-center rounded-md font-medium">
              <p className="text-3xl sm:text-5xl">🎧</p>
              <p className="text-sm text-neutral-400 sm:text-lg">
                Find your next mood
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
