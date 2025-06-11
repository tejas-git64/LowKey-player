import x from "../../assets/svgs/icons8-twitterx.svg";
import meta from "../../assets/svgs/icons8-meta.svg";
import wiki from "../../assets/svgs/icons8-wiki.svg";
import verified from "../../assets/svgs/icons8-verified.svg";
import { memo, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistSongs,
} from "../../api/requests";
import { useBoundStore } from "../../store/store";
import Song from "../../components/Song/Song";
import { TrackDetails } from "../../types/GlobalTypes";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import { useQuery } from "@tanstack/react-query";
import ArtistPageLoading from "./Loading";
import RouteNav from "../../components/RouteNav/RouteNav";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import { FollowButton } from "../../components/FollowButton/FollowButton";

export default function ArtistPage() {
  const { id } = useParams();

  return (
    <Suspense fallback={<ArtistPageLoading />}>
      <div className="h-auto w-full bg-neutral-900">
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

  return (
    <div className="relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-black p-4 sm:flex-row sm:items-end sm:justify-between sm:bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]">
      <div className="absolute right-2 top-2 h-auto w-auto">
        <RouteNav />
      </div>
      <div className="flex h-full min-w-[80%] flex-col items-center justify-center text-center sm:h-full sm:w-[70%] sm:flex-row sm:justify-start sm:text-left">
        <img
          src={(details?.image && details?.image[1]?.url) || artistfallback}
          alt="artist-img"
          className="h-[150px] w-[150px] shadow-xl shadow-black sm:mr-4"
        />
        <div>
          <div className="flex h-fit w-full items-center justify-center sm:justify-start">
            <p className="sm:max-w-auto my-2 ml-5 line-clamp-2 w-full whitespace-pre-line text-center text-3xl font-bold capitalize text-white sm:my-0 sm:ml-0 sm:min-w-min sm:text-left sm:text-4xl">
              {details?.name || ""}
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
        <ul className="my-2.5 flex h-full w-[45%] items-center justify-evenly sm:my-1.5 sm:w-fit sm:items-end sm:justify-end">
          {details?.fb && (
            <li className="mr-4">
              <a href={details?.fb} target="_blank">
                <img
                  src={meta}
                  alt="meta"
                  className="h-[28px] w-[28px] sm:h-[24px] sm:w-[24px]"
                />
              </a>
            </li>
          )}
          {details?.twitter && (
            <li>
              <a href={details?.twitter} target="_blank">
                <img
                  src={x}
                  alt="x"
                  className="mr-4 h-[28px] w-[28px] sm:h-[24px] sm:w-[24px]"
                />
              </a>
            </li>
          )}
          {details?.fb && (
            <li>
              <a href={details?.wiki} target="_blank">
                <img
                  src={wiki}
                  alt="wiki"
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

  return (
    <div className="h-[240px] w-full px-4 py-3 pb-12">
      <h2 className="text-xl font-semibold text-white">Albums</h2>
      <ul className="mx-auto mt-2.5 flex h-full w-full cursor-pointer items-center justify-start overflow-y-hidden overflow-x-scroll">
        {albums.map((album) => (
          <li
            key={album.id}
            onClick={() => navigate(`/albums/${album.id}`, { replace: true })}
            className="group mr-4 h-[180px] w-[150px] flex-shrink-0"
          >
            <img
              src={album.image ? album.image[1]?.url : songfallback}
              alt="artist-album"
              className="h-[150px] w-[150px] rounded-none transition-all ease-linear group-hover:rounded-xl group-hover:brightness-110"
            />
            <p className="mt-1 line-clamp-1 w-full text-ellipsis text-center text-xs text-neutral-300 transition-colors ease-linear group-hover:text-white sm:text-sm">
              {album.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
});
ArtistAlbums.displayName = "ArtistAlbums";

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
          songs.map((song: TrackDetails) => (
            <Song key={song.id} track={song} isWidgetSong={false} />
          ))
        ) : (
          <p className="m-auto text-xl text-neutral-500">No songs here...T_T</p>
        )}
      </ul>
    </div>
  );
});
ArtistSongs.displayName = "ArtistSongs";
