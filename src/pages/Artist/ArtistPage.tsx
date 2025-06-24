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
import { useBoundStore } from "../../store/store";
import Song from "../../components/Song/Song";
import { TrackDetails } from "../../types/GlobalTypes";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import albumfallback from "../../assets/fallbacks/playlist-fallback.webp";
import { useQuery } from "@tanstack/react-query";
import ArtistPageLoading from "./Loading";
import RouteNav from "../../components/RouteNav/RouteNav";
import { FollowButton } from "../../components/FollowButton/FollowButton";

export default function ArtistPage() {
  const { id } = useParams();

  return (
    <Suspense fallback={<ArtistPageLoading />}>
      <div className="h-auto w-full bg-neutral-900 pb-32">
        {id && <ArtistInfo id={id} />}
        {id && <ArtistAlbums id={id} />}
        {id && <ArtistSongs id={id} />}
      </div>
    </Suspense>
  );
}

const ArtistInfo = memo(({ id }: { id: string }) => {
  const details = useBoundStore((state) => state.artist.details);
  const setArtistDetails = useBoundStore((state) => state.setArtistDetails);
  const intlFormatter = new Intl.NumberFormat("en-US");
  const artistEl = useRef<HTMLDivElement>(null);
  const artistImgEl = useRef<HTMLImageElement>(null);
  const artistTitleEl = useRef<HTMLParagraphElement>(null);
  const followerCount = Number(details?.followerCount) ?? undefined;
  const fanCount = Number(details?.fanCount) ?? undefined;
  const followers = followerCount
    ? `${intlFormatter.format(followerCount)} followers`
    : "";
  const fans = fanCount ? `${intlFormatter.format(fanCount)} fans` : "";

  useQuery({
    queryKey: ["artistdetails", id],
    queryFn: () => id && getArtistDetails(id),
    select: (data: any) => setArtistDetails(data.data),
  });

  const getArtistImage = () => {
    if (details) {
      const obj = details.image.find((img) => img.quality === "150x150");
      if (obj) return obj.url;
    }
    return artistfallback;
  };

  useEffect(() => {
    setTimeout(() => {
      artistEl.current?.classList.remove("intro-fadeout");
      artistImgEl.current?.classList.remove("image-fadeout");
      artistTitleEl.current?.classList.remove("song-fadeout");
      artistEl.current?.classList.add("intro-fadein");
      artistImgEl.current?.classList.add("image-fadein");
      artistTitleEl.current?.classList.add("song-fadein");
    }, 50);
  }, [id]);

  return (
    <div
      ref={artistEl}
      className="intro-fadeout relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-black p-4 duration-200 ease-in sm:flex-row sm:items-end sm:justify-between sm:bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]"
    >
      <div className="absolute right-2 top-2 h-auto w-auto">
        <RouteNav />
      </div>
      <div className="flex h-full min-w-[80%] flex-col items-center justify-center text-center sm:h-full sm:w-[70%] sm:flex-row sm:justify-start sm:text-left">
        <img
          ref={artistImgEl}
          src={getArtistImage()}
          alt="artist-img"
          loading="eager"
          fetchPriority="high"
          className="image-fadeout h-[150px] w-[150px] shadow-xl shadow-black duration-200 ease-in sm:mr-4"
        />
        <div>
          <div className="flex h-fit w-full items-center justify-center sm:justify-start">
            <p
              ref={artistTitleEl}
              className="song-fadeout sm:max-w-auto my-2 ml-5 line-clamp-2 w-full whitespace-pre-line text-center text-3xl font-bold capitalize text-white duration-200 ease-in sm:my-0 sm:ml-0 sm:min-w-min sm:text-left sm:text-4xl"
            >
              {details?.name || "Unknown Artist"}
            </p>
            <img src={verified} alt="verified" className="h-[24px] w-[24px]" />
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
          {details?.fb && (
            <li
              className="mr-4 outline-none focus:ring-2 focus:ring-emerald-500"
              tabIndex={0}
            >
              <a href={details?.fb} target="_blank" className="outline-none">
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
          {details?.twitter && (
            <li
              tabIndex={0}
              className="mr-4 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <a
                href={details?.twitter}
                target="_blank"
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
          {details?.fb && (
            <li
              tabIndex={0}
              className="outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <a href={details?.wiki} target="_blank" className="outline-none">
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
        {details && (
          <FollowButton
            artist={{
              id: details.id,
              image: details.image,
              name: details.name,
              role: "",
              type: "",
              url: details.url,
            }}
          />
        )}
      </div>
    </div>
  );
});
ArtistInfo.displayName = "ArtistInfo";

const ArtistAlbums = memo(({ id }: { id: string }) => {
  const navigate = useNavigate();
  const albums = useBoundStore((state) => state.artist.albums);
  const setArtistAlbums = useBoundStore((state) => state.setArtistAlbums);

  useQuery({
    queryKey: ["artistalbums", id],
    queryFn: () => id && getArtistAlbums(id),
    select: (data: any) => setArtistAlbums(data.data.albums),
  });

  const getAlbumImage = (id: string) => {
    if (albums) {
      const obj = albums.find((album) => album.id === id);
      if (obj) return obj.image[1].url;
    }
    return albumfallback;
  };

  return (
    <div className="h-[240px] w-full px-4 py-3 pb-12">
      <h2 className="text-xl font-semibold text-white">Albums</h2>
      <ul className="mx-auto mt-2.5 flex h-full w-full cursor-pointer items-center justify-start overflow-y-hidden overflow-x-scroll">
        {albums?.map((album, i) => (
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
  const songs = useBoundStore((state) => state.artist.songs);
  const setArtistSongs = useBoundStore((state) => state.setArtistSongs);

  useQuery({
    queryKey: ["artistsongs", id],
    queryFn: () => id && getArtistSongs(id),
    select: (data: any) => setArtistSongs(data.data.songs),
  });

  return (
    <div className="max-h-auto h-full w-full px-4 py-2 pb-20">
      <h2 className="pb-2 text-xl font-semibold text-white">Songs</h2>
      <ul
        id="artist-songs-list"
        className="max-h-auto mx-auto mt-1 h-[60dvh] w-full overflow-hidden bg-neutral-900 pb-28 sm:pb-20"
      >
        {songs.length > 0 ? (
          songs.map((song: TrackDetails, i) => (
            <Song index={i} key={song.id} track={song} isWidgetSong={false} />
          ))
        ) : (
          <p className="m-auto text-xl text-neutral-500">No songs here...T_T</p>
        )}
      </ul>
    </div>
  );
});
ArtistSongs.displayName = "ArtistSongs";
