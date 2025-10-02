import Searchbar from "../../components/Searchbar/Searchbar";
import { useBoundStore } from "../../store/store";
import {
  AlbumResult,
  PlaylistResult,
  QueryResult,
  SongAlbumResult,
  TrackDetails,
} from "../../types/GlobalTypes";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import { Link, useNavigate } from "react-router-dom";
import RouteNav from "../../components/RouteNav/RouteNav";
import { memo, useEffect, useRef } from "react";
import { cleanString } from "../../helpers/cleanString";
import { animateScreen } from "../../helpers/animateScreen";

export default function Search() {
  const search = useBoundStore((state) => state.search);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const searchEl = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { topQuery, albums, artists, playlists, songs } = search;

  const navigateQuery = (type: string, id: string) => {
    if (type === "artist") {
      navigate(`/artists/${id}`);
    }
    if (type === "song") {
      fetch(`https://lowkey-backend.vercel.app/api/songs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && (data.data[0] as TrackDetails)) {
            setNowPlaying(data.data[0]);
            setIsPlaying(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    animateScreen(searchEl);
  }, []);

  return (
    <>
      <div
        data-testid="search-page"
        ref={searchEl}
        className="home-fadeout relative h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth bg-neutral-900 px-3 duration-200 ease-in"
      >
        <div className="fixed mx-[2.5%] flex w-[90%] items-center bg-inherit pb-6 pt-4 sm:mx-[4.5%] sm:w-[80%] md:mx-[4.5%] lg:w-[67%] xlg:mx-[5.5%] xl:w-[52.5%] 2xl:w-[875px]">
          <Searchbar />
          <RouteNav />
        </div>
        <div className="mx-auto mt-20 flex h-[88dvh] w-full flex-col items-start justify-start rounded-md sm:h-[83dvh] lg:w-[80%]">
          {topQuery?.results ||
          songs?.results ||
          playlists?.results ||
          artists?.results ||
          albums?.results ? (
            <div
              data-testid="results-container"
              className="h-auto w-full px-3 pb-20 md:w-[96.5%] md:px-10 lg:w-[80%]"
            >
              {topQuery?.results && topQuery.results.length > 0 && (
                <TopQuery navigateQuery={navigateQuery} />
              )}
              {songs?.results && songs?.results.length > 0 && (
                <QuerySongs navigateQuery={navigateQuery} />
              )}
              {playlists?.results && playlists.results.length > 0 && (
                <QueryPlaylists />
              )}
              {albums?.results && albums?.results.length > 0 && <QueryAlbums />}
              {artists?.results && artists?.results.length > 0 && (
                <QueryArtists />
              )}
            </div>
          ) : (
            <div
              data-testid="search-fallback"
              className="mx-auto -mt-6 flex h-[88dvh] w-full flex-col items-center justify-center rounded-md font-medium sm:h-[83dvh]"
            >
              <p className="mb-2 text-3xl sm:text-4xl">🎧</p>
              <p className="text-sm text-neutral-400 sm:text-base">
                Find your next mood
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const TopQuery = memo(
  ({
    navigateQuery,
  }: {
    navigateQuery: (type: string, id: string, res: any) => void;
  }) => {
    const topQuery = useBoundStore((state) => state.search.topQuery?.results);
    const topEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setTimeout(() => {
        topEl.current?.classList.remove("song-fadeout");
        topEl.current?.classList.add("song-fadein");
      }, 50);
    }, []);

    return (
      <div
        ref={topEl}
        data-testid="top-queries"
        className="song-fadeout mb-8 h-auto w-full list-none duration-200 ease-in sm:w-full"
      >
        {topQuery && (
          <p className="my-2 text-xs font-semibold text-white">Top results</p>
        )}
        <ul
          data-testid="top-query-results"
          className="flex h-auto w-full flex-col items-start justify-start"
        >
          {topQuery?.map((res: QueryResult) => (
            <li
              key={res.id}
              id={res.id}
              onClick={(e) => {
                e.stopPropagation();
                navigateQuery(res.type, res.id, res);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigateQuery(res.type, res.id, res);
                }
              }}
              data-testid="top-result"
              role="button"
              tabIndex={0}
              aria-label={res.title ? cleanString(res.title) : res.type}
              className="flex h-[50px] w-full cursor-pointer items-center justify-start overflow-hidden bg-neutral-900 outline-none hover:bg-neutral-800 focus:bg-neutral-800"
            >
              <img
                src={res.image[0]?.url || undefined}
                alt="query-img"
                className="mr-4 h-[50px] w-[50px] rounded-sm"
              />
              <p
                data-testid="query-title"
                className="text-sm font-medium text-white"
              >
                {res.title ? cleanString(res.title) : "Unknown title"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

const QuerySongs = memo(
  ({
    navigateQuery,
  }: {
    navigateQuery: (type: string, id: string) => void;
  }) => {
    const songs = useBoundStore((state) => state.search.songs?.results);
    return (
      <>
        {songs && songs.length > 0 && (
          <div
            data-testid="query-songs"
            className="mb-6 mt-2 h-auto w-full list-none"
          >
            <p className="mb-2 text-xs font-semibold text-white">Songs</p>
            <ul className="flex h-auto w-full flex-col items-end justify-start">
              {songs?.map((song, i) => (
                <SearchSong
                  key={song.id}
                  song={song}
                  i={i}
                  navigateQuery={navigateQuery}
                />
              ))}
            </ul>
          </div>
        )}
      </>
    );
  },
);

const SearchSong = memo(
  ({
    song,
    i,
    navigateQuery,
  }: {
    song: SongAlbumResult;
    i: number;
    navigateQuery: (type: string, id: string) => void;
  }) => {
    const searchSongEl = useRef<HTMLLIElement>(null);

    useEffect(() => {
      setTimeout(() => {
        searchSongEl.current?.classList.remove("song-fadeout");
        searchSongEl.current?.classList.add("song-fadein");
      }, i * 10);
    }, []);

    return (
      <li
        key={song.id}
        ref={searchSongEl}
        onClick={(e) => {
          e.stopPropagation();
          navigateQuery(song.type, song.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigateQuery(song.type, song.id);
          }
        }}
        role="button"
        data-testid="query-song"
        tabIndex={0}
        aria-label={song.title ? cleanString(song.title) : song.type}
        className="song-fadeout mb-4 flex h-auto w-full cursor-pointer items-center justify-start overflow-hidden bg-neutral-900 outline-none duration-150 ease-in hover:bg-neutral-800 focus:bg-neutral-800"
      >
        <img
          src={song.image[0]?.url || songfallback}
          alt="query-song-img"
          className="mr-4 h-[40px] w-[40px]"
          onError={(e) => (e.currentTarget.src = songfallback)}
        />
        <div className="mr-4 flex h-auto w-[30%] flex-col items-start justify-center">
          <p
            data-testid="query-song-title"
            className="line-clamp-1 text-ellipsis text-sm text-white"
          >
            {song.title ? cleanString(song.title) : "Unknown song"}
          </p>
          <p className="line-clamp-1 text-ellipsis text-xs text-neutral-400">
            {song.primaryArtists}
          </p>
        </div>
        <p className="line-clamp-1 w-[45%] text-ellipsis text-sm text-neutral-500">
          {song.album}
        </p>
      </li>
    );
  },
);

const QueryPlaylists = memo(() => {
  const playlists = useBoundStore((state) => state.search.playlists?.results);
  return (
    <>
      {playlists && playlists.length > 0 && (
        <div
          data-testid="query-playlists"
          className="mb-5 mt-2 h-auto w-full list-none"
        >
          <p className="mb-2 text-xs font-semibold text-white">Playlists</p>
          <ul className="mb-2 flex h-auto w-full list-none items-center justify-start overflow-y-hidden overflow-x-scroll pb-10">
            {playlists.map((playlist: PlaylistResult, i) => (
              <QueryPlaylist key={playlist.id} i={i} {...playlist} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
});

const QueryPlaylist = memo(
  ({ i, id, title, image }: PlaylistResult & { i: number }) => {
    const qpImgEl = useRef<HTMLImageElement>(null);

    useEffect(() => {
      setTimeout(() => {
        qpImgEl.current?.classList.remove("image-fadeout");
        qpImgEl.current?.classList.add("image-fadein");
      }, i * 50);
    }, []);

    return (
      <li
        key={id}
        data-testid="query-playlist"
        className="mr-4 flex h-[150px] w-[150px] flex-shrink-0 flex-col items-center bg-neutral-900 outline-none hover:bg-neutral-800"
      >
        <Link to={`/playlists/${id}`} className="h-auto w-auto">
          <img
            ref={qpImgEl}
            src={image[1] ? image[1].url : fallback}
            width={150}
            height={150}
            fetchPriority="high"
            loading="eager"
            alt="query-playlist-img"
            className="image-fadeout h-[150px] w-[150px] shadow-md shadow-black duration-200 ease-in"
            onError={(e) => (e.currentTarget.src = fallback)}
          />
          <p
            data-testid="query-playlist-title"
            className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400"
          >
            {title ? cleanString(title) : "Unknown playlist"}
          </p>
        </Link>
      </li>
    );
  },
);

const QueryArtists = memo(() => {
  const artists = useBoundStore((state) => state.search.artists?.results);

  return (
    <>
      {artists && artists.length > 0 && (
        <div
          data-testid="query-artists"
          className="mb-4 mt-2 h-auto w-full list-none"
        >
          <p className="mb-2 text-xs font-semibold text-white">Artists</p>
          <ul className="mb-4 flex h-auto w-full list-none items-center justify-start overflow-y-hidden overflow-x-scroll pb-10">
            {artists?.map((album: AlbumResult, i) => (
              <QueryArtist key={album.id} {...album} i={i} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
});

const QueryArtist = ({ id, title, image, i }: AlbumResult & { i: number }) => {
  const qaImgEl = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setTimeout(() => {
      qaImgEl.current?.classList.remove("image-fadeout");
      qaImgEl.current?.classList.add("image-fadein");
    }, i * 50);
  }, []);

  return (
    <li
      key={id}
      data-testid="query-artist"
      className="mr-4 flex h-[150px] w-[150px] flex-shrink-0 list-none flex-col items-center"
    >
      <Link to={`/artists/${id}`} className="h-auto w-auto">
        <img
          ref={qaImgEl}
          src={image[1] ? image[1].url : artistfallback}
          alt="query-artist-img"
          className="image-fadeout h-[150px] w-[150px] rounded-full shadow-md shadow-black duration-200 ease-in"
          onError={(e) => (e.currentTarget.src = artistfallback)}
        />
        <p
          data-testid="query-artist-title"
          className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400"
        >
          {title ? cleanString(title) : "Unknown Artist"}
        </p>
      </Link>
    </li>
  );
};

const QueryAlbums = () => {
  const albums = useBoundStore((state) => state.search.albums?.results);

  return (
    <>
      {albums && albums.length > 0 && (
        <div
          data-testid="query-albums"
          className="mb-4 mt-2 h-auto w-full list-none pb-24 sm:pb-0"
        >
          <p className="mb-2 text-xs font-semibold text-white">Albums</p>
          <ul className="mb-2 flex h-auto w-full list-none items-center justify-start overflow-y-hidden overflow-x-scroll pb-10">
            {albums?.map((album: SongAlbumResult, i) => (
              <QueryAlbum key={album.id} i={i} {...album} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

const QueryAlbum = ({
  id,
  title,
  image,
  i,
}: SongAlbumResult & { i: number }) => {
  const qalImg = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setTimeout(() => {
      qalImg.current?.classList.remove("image-fadeout");
      qalImg.current?.classList.add("image-fadein");
    }, i * 50);
  }, []);

  return (
    <li
      key={id}
      data-testid="query-album"
      className="mr-4 flex h-[150px] w-[150px] flex-shrink-0 list-none flex-col items-center outline-none"
    >
      <Link to={`/albums/${id}`} className="h-auto w-auto">
        <img
          ref={qalImg}
          src={image[1] ? image[1].url : fallback}
          alt="query-album-img"
          className="image-fadeout h-[150px] w-[150px] shadow-md shadow-black duration-200 ease-in"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p
          data-testid="query-album-title"
          className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400"
        >
          {title ? cleanString(title) : "Unknown Album"}
        </p>
      </Link>
    </li>
  );
};
