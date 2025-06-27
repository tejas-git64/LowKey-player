import x from "../../assets/svgs/icons8-twitterx.svg";
import meta from "../../assets/svgs/icons8-meta.svg";
import wiki from "../../assets/svgs/icons8-wiki.svg";
import verified from "../../assets/svgs/icons8-verified.svg";
import { memo, Suspense, useEffect, useRef } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistSongs,
} from "../../api/requests";
import Song from "../../components/Song/Song";
import { AlbumById, Image, TrackDetails } from "../../types/GlobalTypes";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import albumfallback from "../../assets/fallbacks/playlist-fallback.webp";
import { useQuery } from "@tanstack/react-query";
import RouteNav from "../../components/RouteNav/RouteNav";
import { FollowButton } from "../../components/FollowButton/FollowButton";
import { animateScreen } from "../../helpers/animateScreen";
import {
  ArtistAlbumFallback,
  ArtistInfoFallback,
  ArtistSongsFallback,
} from "./Loading";

export default function ArtistPage() {
  const { id } = useParams();
  const artistEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateScreen(artistEl);
  }, [id]);

  return (
    <div
      ref={artistEl}
      className="home-fadeout sm: h-auto w-full bg-neutral-900 pb-32 duration-300 ease-in sm:pb-0"
    >
      {id && <ArtistInfo id={id} />}
      {id && <ArtistAlbums id={id} />}
      {id && <ArtistSongs id={id} />}
    </div>
  );
}

const ArtistInfo = memo(({ id }: { id: string }) => {
  const intlFormatter = new Intl.NumberFormat("en-US");
  const artistImgEl = useRef<HTMLImageElement>(null);
  const artistTitleEl = useRef<HTMLParagraphElement>(null);
  const artistEl = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["artistdetails", id],
    queryFn: () => id && getArtistDetails(id),
    enabled: true,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });
  const followers = data?.followerCount
    ? `${intlFormatter.format(data.followerCount)} followers`
    : "";
  const fans = data?.fanCount
    ? `${intlFormatter.format(data.fanCount)} fans`
    : "";

  const getArtistImage = () => {
    if (data) {
      const obj = data.image.find((img: Image) => img.quality === "150x150");
      if (obj) return obj.url;
    }
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

  return (
    <Suspense fallback={<ArtistInfoFallback />}>
      <div
        ref={artistEl}
        className="home-fadeout relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-black p-4 duration-200 ease-in sm:flex-row sm:items-end sm:justify-between sm:bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]"
      >
        <div className="absolute right-2 top-2 h-auto w-auto">
          <RouteNav />
        </div>
        <div className="flex h-full min-w-[80%] flex-col items-center justify-center text-center sm:h-full sm:w-[70%] sm:flex-row sm:justify-start sm:text-left">
          <img
            ref={artistImgEl}
            src={getArtistImage()}
            alt="artist-img"
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
                className="song-fadeout sm:max-w-auto my-2 ml-5 line-clamp-2 w-full whitespace-pre-line text-center text-3xl font-bold capitalize text-white duration-200 ease-in sm:my-0 sm:ml-0 sm:min-w-min sm:text-left sm:text-4xl"
              >
                {data?.name || "Unknown Artist"}
              </p>
              <img
                src={verified}
                alt="verified"
                className="h-[24px] w-[24px]"
              />
            </div>
            <p className="text-md font-medium leading-5 text-neutral-400 sm:leading-7">
              {followers}
            </p>
            <p className="text-sm font-medium text-neutral-400 sm:leading-6">
              {fans}
            </p>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-between sm:h-[150px] sm:items-end">
          <ul className="my-2.5 flex h-full w-[45%] items-center justify-evenly sm:w-fit sm:items-end sm:justify-end">
            {data?.fb && (
              <li
                className="mr-4 outline-none focus:ring-2 focus:ring-emerald-500"
                tabIndex={0}
              >
                <a href={data.fb} target="_blank" className="outline-none">
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
              <li
                tabIndex={0}
                className="mr-4 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <a href={data.twitter} target="_blank" className="outline-none">
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
            {data?.fb && (
              <li
                tabIndex={0}
                className="outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <a href={data.wiki} target="_blank" className="outline-none">
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
    </Suspense>
  );
});
ArtistInfo.displayName = "ArtistInfo";

const ArtistAlbums = memo(({ id }: { id: string }) => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["artistalbums", id],
    queryFn: () => id && getArtistAlbums(id),
    enabled: true,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  const getAlbumImage = (id: string) => {
    if (data) {
      const obj = data.find((album: AlbumById) => album.id === id);
      if (obj) return obj.image[1].url;
    }
    return albumfallback;
  };

  return (
    <Suspense fallback={<ArtistAlbumFallback />}>
      <div className="h-[240px] w-full px-4 py-3 pb-12">
        <h2 className="text-xl font-semibold text-white">Albums</h2>
        <ul className="mx-auto mt-2.5 flex h-full w-full cursor-pointer items-center justify-start overflow-y-hidden overflow-x-scroll">
          {data?.map((album: AlbumById, i: number) => (
            <ArtistAlbum
              key={album.id}
              i={i}
              id={album.id}
              name={album.name}
              navigate={navigate}
              getAlbumImage={getAlbumImage}
            />
          ))}
        </ul>
      </div>
    </Suspense>
  );
});
ArtistAlbums.displayName = "ArtistAlbums";

const ArtistAlbum = ({
  id,
  i,
  name,
  getAlbumImage,
  navigate,
}: {
  id: string;
  i: number;
  name: string;
  getAlbumImage: (id: string) => string | undefined;
  navigate: NavigateFunction;
}) => {
  const albumImgEl = useRef<HTMLImageElement>(null);
  const albumTitleEl = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setTimeout(() => {
      albumImgEl.current?.classList.remove("image-fadeout");
      albumTitleEl.current?.classList.remove("song-fadeout");
      albumImgEl.current?.classList.add("image-fadein");
      albumTitleEl.current?.classList.add("song-fadein");
    }, i * 50);
  }, [id]);

  return (
    <li
      key={id}
      tabIndex={0}
      onClick={() => navigate(`/albums/${id}`, { replace: true })}
      className="group mr-4 h-[180px] w-[150px] flex-shrink-0 outline-none"
    >
      <div className="mb-2.5 h-[150px] w-[150px] overflow-hidden">
        <img
          ref={albumImgEl}
          src={getAlbumImage(id)}
          alt="artist-album"
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
    </li>
  );
};

const ArtistSongs = memo(({ id }: { id: string }) => {
  const { data } = useQuery({
    queryKey: ["artistsongs", id],
    queryFn: () => id && getArtistSongs(id),
    enabled: true,
    refetchOnReconnect: "always",
    _optimisticResults: "isRestoring",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  return (
    <Suspense fallback={<ArtistSongsFallback />}>
      <div className="max-h-auto h-full w-full px-4 py-2 pb-20">
        <h2 className="pb-2 text-xl font-semibold text-white">Songs</h2>
        <ul
          id="artist-songs-list"
          className="max-h-auto mx-auto mt-1 h-[60dvh] w-full overflow-hidden bg-neutral-900 pb-28 sm:pb-20"
        >
          {data?.length > 0 ? (
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
    </Suspense>
  );
});
ArtistSongs.displayName = "ArtistSongs";
