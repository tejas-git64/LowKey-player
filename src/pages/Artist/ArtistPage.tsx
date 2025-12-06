import x from "/svgs/icons8-twitterx.svg";
import meta from "/svgs/icons8-meta.svg";
import wiki from "/svgs/icons8-wiki.svg";
import verified from "/svgs/icons8-verified.svg";
import { memo, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistSongs,
} from "../../api/requests";
import Song from "../../components/Song/Song";
import { AlbumById, Image, TrackDetails } from "../../types/GlobalTypes";
import artistfallback from "/fallbacks/artist-fallback.png";
import albumfallback from "/fallbacks/playlist-fallback.webp";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import RouteNav from "../../components/RouteNav/RouteNav";
import { FollowButton } from "../../components/FollowButton/FollowButton";
import { animateScreen } from "../../helpers/animateScreen";
import {
  ArtistAlbumFallback,
  ArtistInfoFallback,
  ArtistSongsFallback,
} from "./Loading";
import useClearTimer from "../../hooks/useClearTimer";
import { preload } from "react-dom";

export default function ArtistPage() {
  const { id } = useParams();
  const artistEl = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useClearTimer(timerRef);
  useEffect(() => {
    timerRef.current = animateScreen(artistEl);
  }, [id]);

  return (
    <div
      data-testid="artist-page"
      ref={artistEl}
      className="home-fadeout w-full bg-neutral-900 pb-32 duration-300 ease-in sm:h-auto sm:pb-0"
    >
      {id && <ArtistInfo id={id} />}
      {id && <ArtistAlbums id={id} />}
      {id && <ArtistSongs id={id} />}
    </div>
  );
}

export const ArtistInfo = memo(({ id }: { id: string }) => {
  const intlFormatter = new Intl.NumberFormat("en-US");
  const artistImgEl = useRef<HTMLImageElement>(null);
  const artistTitleEl = useRef<HTMLParagraphElement>(null);
  const artistEl = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["artistdetails", id],
    queryFn: () => getArtistDetails(id),
    enabled: !!id,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  const obj = data?.image?.find((img: Image) => img.quality === "150x150");
  if (obj?.url) {
    preload(obj.url, {
      as: "image",
      fetchPriority: "high",
    });
  }

  const getArtistImage = () => {
    if (obj) return obj.url;
    return artistfallback;
  };

  function handleImageLoad() {
    artistEl.current?.classList.remove("home-fadeout");
    artistEl.current?.classList.add("home-fadein");
    artistImgEl.current?.classList.remove("image-fadeout");
    artistTitleEl.current?.classList.remove("song-fadeout");
    artistImgEl.current?.classList.add("image-fadein");
    artistTitleEl.current?.classList.add("song-fadein");
  }

  if (isLoading) return <ArtistInfoFallback />;

  return (
    <div
      ref={artistEl}
      data-testid="artist-info"
      className="home-fadeout relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-black p-4 duration-200 ease-in sm:flex-row sm:items-end sm:justify-between sm:bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]"
    >
      <div className="absolute right-2 top-2 h-auto w-auto">
        <RouteNav />
      </div>
      <div className="flex h-full min-w-[80%] flex-col items-center justify-center text-center sm:h-full sm:w-[70%] sm:flex-row sm:justify-start sm:text-left">
        <img
          ref={artistImgEl}
          src={getArtistImage()}
          alt="artist-image"
          onError={(e) => (e.currentTarget.src = artistfallback)}
          loading="eager"
          fetchPriority="high"
          onLoad={handleImageLoad}
          className="image-fadeout h-[150px] w-[150px] shadow-xl shadow-black duration-300 ease-in sm:mr-4"
        />
        <div>
          <div className="flex h-fit w-full items-center justify-center sm:justify-start">
            <p
              ref={artistTitleEl}
              data-testid="artist-title"
              className="song-fadeout sm:max-w-auto my-2 ml-5 line-clamp-2 w-full whitespace-pre-line text-center text-3xl font-bold capitalize text-white duration-200 ease-in sm:my-0 sm:ml-0 sm:min-w-min sm:text-left sm:text-4xl"
            >
              {data?.name || "Unknown Artist"}
            </p>
            <img src={verified} alt="verified" className="h-[24px] w-[24px]" />
          </div>
          {data && data.followerCount > 0 && (
            <p
              data-testid="artist-followers"
              className="text-md font-medium leading-5 text-neutral-400 sm:leading-7"
            >
              {intlFormatter.format(Number(data.followerCount))}
            </p>
          )}
          {data && data.fanCount > 0 && (
            <p
              data-testid="artist-fans"
              className="text-sm font-medium text-neutral-400 sm:leading-6"
            >
              {intlFormatter.format(Number(data.fanCount))}
            </p>
          )}
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-between sm:h-[150px] sm:items-end">
        <ul className="my-2.5 flex h-full w-[45%] items-center justify-evenly sm:w-fit sm:items-end sm:justify-end">
          {data?.fb && (
            <li className="mr-4 outline-none">
              <a
                href={data.fb}
                target="_blank"
                rel="noreferrer"
                className="outline-none"
              >
                <img
                  src={meta}
                  alt="meta"
                  loading="eager"
                  fetchPriority="high"
                  className="h-[28px] w-[28px] sm:h-[24px] sm:w-[24px]"
                />
              </a>
            </li>
          )}
          {data?.twitter && (
            <li className="mr-4 outline-none">
              <a
                href={data.twitter}
                target="_blank"
                rel="noreferrer"
                className="outline-none"
              >
                <img
                  src={x}
                  alt="x"
                  loading="eager"
                  fetchPriority="high"
                  className="mb-0.5 h-[28px] w-[28px] sm:h-5 sm:w-5"
                />
              </a>
            </li>
          )}
          {data?.wiki && (
            <li className="outline-none">
              <a
                href={data.wiki}
                target="_blank"
                rel="noreferrer"
                className="outline-none"
              >
                <img
                  src={wiki}
                  alt="wiki"
                  loading="eager"
                  fetchPriority="high"
                  className="h-[30px] w-[30px] sm:h-[24px] sm:w-[24px]"
                />
              </a>
            </li>
          )}
        </ul>
        {data && (
          <FollowButton
            artist={{
              id: data.id,
              image: data.image,
              name: data.name,
              role: "",
              type: "",
              url: data.url,
            }}
          />
        )}
      </div>
    </div>
  );
});
ArtistInfo.displayName = "ArtistInfo";

export const ArtistAlbums = memo(({ id }: { id: string }) => {
  const { data, isLoading }: UseQueryResult<AlbumById[]> = useQuery({
    queryKey: ["artistalbums", id],
    queryFn: () => getArtistAlbums(id),
    enabled: !!id,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  if (isLoading) return <ArtistAlbumFallback />;

  if (data && data.length > 0) {
    return (
      <div
        data-testid="artist-albums"
        className="h-[240px] w-full px-4 py-3 pb-12"
      >
        <h2 className="text-xl font-semibold text-white">Albums</h2>
        <ul
          data-testid="albums-container"
          className="mx-auto mt-2.5 flex h-full w-full cursor-pointer items-center justify-start overflow-y-hidden overflow-x-scroll"
        >
          {data.map((album: AlbumById, i: number) => (
            <ArtistAlbum key={id} i={i} {...album} />
          ))}
        </ul>
      </div>
    );
  }
});
ArtistAlbums.displayName = "ArtistAlbums";

const ArtistAlbum = ({
  i,
  id,
  name,
  image,
}: {
  i: number;
} & AlbumById) => {
  const albumImgEl = useRef<HTMLImageElement>(null);
  const albumTitleEl = useRef<HTMLParagraphElement>(null);

  const getAlbumImage = () => {
    return image.length > 0 ? image[1].url : albumfallback;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      albumImgEl.current?.classList.remove("image-fadeout");
      albumTitleEl.current?.classList.remove("song-fadeout");
      albumImgEl.current?.classList.add("image-fadein");
      albumTitleEl.current?.classList.add("song-fadein");
    }, i * 50);
    return () => {
      clearTimeout(timer);
    };
  }, [id, i]);

  return (
    <Link
      key={id}
      data-testid="artist-album"
      role="listitem"
      to={`/albums/${id}`}
      className="group mr-4 h-[180px] w-[150px] flex-shrink-0 outline-none"
    >
      <div className="mb-2.5 h-[150px] w-[150px] overflow-hidden">
        <img
          ref={albumImgEl}
          src={getAlbumImage()}
          alt="artist-album-image"
          width={150}
          height={150}
          loading="eager"
          fetchPriority="high"
          className="image-fadeout scale-105 transition-all duration-150 ease-in hover:scale-100 group-hover:brightness-110 group-focus:scale-100"
        />
      </div>
      <p
        ref={albumTitleEl}
        className="song-fadeout mt-1 line-clamp-1 w-full text-ellipsis text-center text-xs font-semibold text-neutral-400 transition-colors duration-200 ease-in group-hover:text-white group-focus:text-white"
      >
        {name}
      </p>
    </Link>
  );
};

export const ArtistSongs = memo(({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["artistsongs", id],
    queryFn: () => getArtistSongs(id),
    enabled: !!id,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  if (isLoading) return <ArtistSongsFallback />;

  return (
    <div
      data-testid="artist-songs"
      className="max-h-auto h-full w-full px-4 py-2 pb-20"
    >
      <h2 className="pb-2 text-xl font-semibold text-white">Songs</h2>
      <ul
        id="artist-songs-list"
        className="max-h-auto mx-auto mt-1 h-[60dvh] w-full overflow-hidden bg-neutral-900 pb-28 sm:pb-20"
      >
        {data ? (
          data.map((song: TrackDetails, i: number) => (
            <Song index={i} key={song.id} track={song} isWidgetSong={false} />
          ))
        ) : (
          <div className="h-auto w-full text-center">
            <p className="text-xl text-neutral-500">No songs here...T_T</p>
          </div>
        )}
      </ul>
    </div>
  );
});
ArtistSongs.displayName = "ArtistSongs";
