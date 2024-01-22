import { Suspense, useEffect } from "react";
import { useBoundStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import {
  ActivityType,
  AlbumType,
  ChartType,
  PlaylistType,
  TrackDetails,
} from "../../types/GlobalTypes";
import Loading from "./Loading";
import Section from "../../components/Section/Section";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import Song from "../../components/Song/Song";
import fallbacktoday from "../../assets/timely/icons8-timely-today.png";
import fallbackweekly from "../../assets/timely/icons8-timely-weekly.png";
import fallbackmonthly from "../../assets/timely/icons8-timely-monthly.png";
import fallbackyearly from "../../assets/timely/icons8-timely-yearly.png";
import fallback from "../../assets/playlist-fallback.webp";
import { useQuery } from "@tanstack/react-query";
import { getMusic, getTimelyData, getWidgetData } from "../../api/requests";
import { genres, timelyData } from "../../utils/utils";
import logo from "../../assets/sound-waves.png";
import songfallback from "../../assets/icons8-song-fallback.png";
import notif from "../../assets/bell-svgrepo-com.svg";

export default function Home() {
  const {
    changeGreeting,
    home,
    greeting,
    setWidgetData,
    setDefault,
    nowPlaying,
    setIsPlaying,
    recents,
    setNowPlaying,
    setQueue,
    notifications,
    setNotifications,
  } = useBoundStore();
  const widget = home.widget;
  const today = home.timely.today;
  const weekly = home.timely.weekly;
  const monthly = home.timely.monthly;
  const yearly = home.timely.yearly;
  const navigate = useNavigate();

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 12) {
      changeGreeting("Good morning");
    } else if (hour > 12 && hour <= 15) {
      changeGreeting("Good afternoon");
    } else if (hour > 15 && hour <= 18) {
      changeGreeting("Good evening");
    } else if (hour > 18 && hour < 6) {
      changeGreeting("Good night");
    } else {
      changeGreeting("Jump back in");
    }
  };
  const { isPending: widgetPending } = useQuery({
    queryKey: ["widget"],
    queryFn: getWidgetData,
    select: (data) => setWidgetData(data.data),
  });

  const { isPending: homePending } = useQuery({
    queryKey: ["home"],
    queryFn: getMusic,
    select: (data) => setDefault(data.data),
  });

  function setNowPlayingQueue(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setQueue({
      id: widget.id,
      name: widget.name,
      image: widget.image,
      songs: widget.songs,
    });
    setNowPlaying(widget.songs[0]);
    setIsPlaying(true);
  }

  useEffect(() => {
    setGreeting();
    timelyData.map((obj: { id: number; timely: string }) => {
      getTimelyData(obj.id, obj.timely);
    });
    setInterval(() => setGreeting(), 60000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Activity = ({ message }: ActivityType) => {
    return (
      <>
        <li className="mb-0.5 line-clamp-1 flex h-[35px] w-full flex-shrink-0 items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-black px-2">
          <p className=" mx-1 line-clamp-1 w-auto text-ellipsis text-xs font-semibold text-neutral-300">
            {message}
          </p>
        </li>
      </>
    );
  };

  function toggleNotifs() {
    if (notifications) {
      setNotifications(false);
    } else {
      setNotifications(true);
    }
  }

  const HomeComponent = () => {
    return (
      <div className="h-auto w-full scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
        <div className="h-auto max-h-max w-full pt-2 xl:w-full">
          <div className="-mb-0.5 flex h-auto w-full items-center justify-between px-4 sm:hidden">
            <h1 className="text-left text-2xl font-semibold text-white sm:hidden">
              {greeting}
            </h1>
            <div className="flex w-20 items-center justify-between">
              <button
                type="button"
                style={{
                  border: "none",
                  outline: "none",
                }}
                onClick={() => toggleNotifs()}
                className="relative h-[25px] w-[25px] bg-transparent p-0"
              >
                <img
                  src={notif}
                  alt="notification"
                  className="h-[25px] w-[25px]"
                  loading="lazy"
                />
                {recents.activity.length > 0 && !notifications && (
                  <p className="absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-emerald-400"></p>
                )}
              </button>
              <ul
                className={`${
                  notifications ? "absolute" : "hidden"
                } right-20 top-11 z-20 flex h-40 w-[65%] flex-col items-start justify-start overflow-y-scroll rounded-b-xl rounded-tl-xl bg-neutral-900 p-1`}
              >
                {recents.activity.length > 0 ? (
                  recents.activity.map((message: string, i: number) => (
                    <Activity message={message} key={i} />
                  ))
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <p className="text-xl">¯\_(ツ)_/¯</p>
                    <p className="text-sm">Wow, such empty...</p>
                  </div>
                )}
              </ul>
              <img
                loading="lazy"
                src={logo}
                alt="logo"
                className="-mb-0.5 rounded-full"
              />
            </div>
          </div>
          <div className="h-auto max-h-max w-full px-3.5">
            <section className="relative z-0 mx-auto my-3 mb-7 flex h-80 w-full flex-col overflow-hidden rounded-2xl bg-transparent sm:flex-row">
              <img
                src={widget.image ? widget.image[2].link : songfallback}
                alt="img"
                loading="lazy"
                className="h-auto w-auto bg-neutral-700 sm:z-10 sm:h-[320px] sm:w-[320px] sm:rounded-xl"
                onClick={() =>
                  widget.id !== "" && navigate(`/playlists/${widget.id}`)
                }
              />
              <div className="absolute right-2.5 top-[105px] z-20 flex h-auto w-[95%] items-end justify-between sm:left-0 sm:top-[268px] sm:h-12 sm:w-[320px] sm:justify-end sm:p-2 md:p-2 md:py-1">
                <p className="left-0 top-0 line-clamp-1 h-auto w-[80%] pl-1 text-xl font-bold sm:hidden">
                  {widget.name}
                </p>
                {nowPlaying.isPlaying ? (
                  <button
                    style={{
                      outline: "none",
                      border: "1px solid #000",
                    }}
                    onClick={() => setIsPlaying(false)}
                    className="rounded-full bg-emerald-500 p-2"
                  >
                    <img
                      src={pause}
                      loading="lazy"
                      alt="pause"
                      className="h-[28px] w-[28px]"
                    />
                  </button>
                ) : (
                  <button
                    style={{
                      outline: "none",
                      border: "1px solid #000",
                    }}
                    onClick={(e) => setNowPlayingQueue(e)}
                    className="rounded-full bg-emerald-500 p-2"
                  >
                    <img
                      src={play}
                      alt="play"
                      loading="lazy"
                      className="h-[28px] w-[28px] pl-0.5"
                    />
                  </button>
                )}
              </div>
              <ul
                id="widget-container"
                className="absolute bottom-1.5 left-1.5 mx-auto h-[158px] w-[96.5%] list-none overflow-x-hidden overflow-y-scroll rounded-xl bg-neutral-900 p-2 sm:static sm:ml-1 sm:mt-0 sm:h-full sm:w-full sm:pl-2 sm:pr-2"
              >
                {widget.songs.map((song: TrackDetails) => (
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
                ))}
              </ul>
            </section>
          </div>
          <h1 className="-my-1 px-4 text-left text-xl font-semibold text-white">
            Timely Tracks
          </h1>
          <div className="mx-auto my-4 mt-6 grid h-auto w-full grid-cols-2 grid-rows-2 gap-3 px-3.5 sm:gap-5">
            <Link
              to={`/playlists/${today.id}`}
              className="flex h-12 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-800 shadow-md transition-all ease-linear hover:text-yellow-500 hover:shadow-lg hover:shadow-yellow-500 sm:h-full"
            >
              <img
                src={today.image ? today.image[0].link : fallbacktoday}
                alt="img"
                loading="lazy"
                className="h-full w-12 sm:w-14"
                onError={(e) => (e.currentTarget.src = fallbacktoday)}
              />
              <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-yellow-400 sm:px-4 sm:text-sm">
                Trending today
              </p>
            </Link>
            <Link
              to={`/playlists/${weekly.id}`}
              className="flex h-12 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-800 shadow-md transition-all ease-linear hover:text-teal-500 hover:shadow-lg hover:shadow-teal-500 sm:h-auto"
            >
              <img
                src={weekly.image ? weekly.image[0].link : fallbackweekly}
                alt="img"
                loading="lazy"
                className="h-full w-12 sm:w-14"
                onError={(e) => (e.currentTarget.src = fallbackweekly)}
              />
              <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-teal-500 sm:px-4 sm:text-sm">
                Top weekly
              </p>
            </Link>
            <Link
              to={`/playlists/${monthly.id}`}
              className="flex h-12 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-800 shadow-md transition-all ease-linear hover:text-rose-500 hover:shadow-lg hover:shadow-rose-500 sm:h-auto"
            >
              <img
                src={monthly.image ? monthly.image[0].link : fallbackmonthly}
                alt="img"
                loading="lazy"
                className="h-full w-12 sm:w-14"
                onError={(e) => (e.currentTarget.src = fallbackmonthly)}
              />
              <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-rose-400 sm:px-4 sm:text-sm">
                Best of the month
              </p>
            </Link>
            <Link
              to={`/playlists/${yearly.id}`}
              className="flex h-12 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-800 shadow-md transition-all ease-linear hover:text-purple-500 hover:shadow-lg hover:shadow-purple-500 sm:h-auto"
            >
              <img
                src={yearly.image ? yearly.image[0].link : fallbackyearly}
                alt="img"
                loading="lazy"
                className="h-full w-12 sm:w-14"
                onError={(e) => (e.currentTarget.src = fallbackyearly)}
              />
              <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-purple-400 sm:px-4 sm:text-sm">
                Yearly throwback
              </p>
            </Link>
          </div>
          {/* Trending */}
          <div className="flex h-auto w-full flex-col overflow-x-hidden bg-transparent py-2">
            <h1 className="px-4 pb-1 text-left text-xl font-semibold text-white">
              Trending
            </h1>
            <ul className="flex h-48 w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
              {home.default.trending?.albums?.map((album: AlbumType) => (
                <li
                  className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center bg-transparent"
                  key={album.id}
                  onClick={() =>
                    navigate(`/albums/${album.id}`, { replace: true })
                  }
                >
                  <img
                    src={
                      Array.isArray(album.image)
                        ? album.image[1].link
                        : fallback
                    }
                    alt="user-profile"
                    loading="lazy"
                    className="h-[150px] w-[150px] rounded-full shadow-xl shadow-neutral-950"
                    onError={(e) => (e.currentTarget.src = fallback)}
                  />
                  <p className="mt-1 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
                    {album.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {/* Playlists */}
          <div className="flex h-auto w-full flex-col overflow-x-hidden bg-transparent py-2">
            <h1 className="px-4 pb-1 text-left text-xl font-semibold text-white">
              Popular Playlists
            </h1>
            <ul className="flex h-48 w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
              {home.default.playlists?.map((playlist: PlaylistType) => (
                <li
                  className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center bg-transparent"
                  key={playlist.id}
                  onClick={() =>
                    navigate(`/playlists/${playlist.id}`, { replace: true })
                  }
                >
                  <img
                    src={
                      Array.isArray(playlist.image)
                        ? playlist.image[1].link
                        : fallback
                    }
                    alt="user-profile"
                    loading="lazy"
                    className="h-[150px] w-[150px] rounded-3xl shadow-xl shadow-neutral-950"
                    onError={(e) => (e.currentTarget.src = fallback)}
                  />
                  <p className="mt-1 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
                    {playlist.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {/* Albums */}
          <div className="flex h-auto w-full flex-col overflow-x-hidden bg-transparent py-2">
            <h1 className="px-4 pb-1 text-left text-xl font-semibold text-white">
              Latest Albums
            </h1>
            <ul className="flex h-48 w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
              {home.default.albums?.map((album: AlbumType) => (
                <li
                  className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center bg-transparent"
                  key={album.id}
                  onClick={() =>
                    navigate(`/albums/${album.id}`, { replace: true })
                  }
                >
                  <img
                    src={
                      Array.isArray(album.image)
                        ? album.image[1].link
                        : fallback
                    }
                    alt="user-profile"
                    loading="lazy"
                    className="h-[150px] w-[150px] rounded-br-3xl rounded-tl-3xl shadow-xl shadow-neutral-950"
                    onError={(e) => (e.currentTarget.src = fallback)}
                  />
                  <p className="mt-1 line-clamp-1 h-auto text-ellipsis whitespace-pre-line bg-transparent text-center text-xs font-semibold text-neutral-400">
                    {album.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex h-auto w-full flex-col bg-transparent py-2">
            <h1 className="px-4 pb-1 text-left text-xl font-semibold text-white">
              Charts
            </h1>
            <ul className="flex h-48 w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
              {home.default.charts?.map((chart: ChartType) => (
                <li
                  key={chart.id}
                  className="mr-4 flex h-[175px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center"
                  onClick={() =>
                    navigate(`/playlists/${chart.id}`, { replace: true })
                  }
                >
                  <img
                    src={chart.image ? chart.image[1].link : fallback}
                    alt="user-profile"
                    loading="lazy"
                    className="h-[150px] w-[150px] rounded-xl shadow-md shadow-black"
                    onError={(e) => (e.currentTarget.src = fallback)}
                  />
                  <p className="mt-1 line-clamp-1 h-auto text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
                    {chart.title.replace("-", "").replace("&quote;", "")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-auto max-h-max w-full pb-28 sm:pb-14">
            {/* Genres */}
            {genres.map((genre) => (
              <Section genre={genre} key={genre} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const DataComponent = () => {
    if (widgetPending && homePending) {
      throw new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      return <HomeComponent />;
    }
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <DataComponent />
      </Suspense>
    </>
  );
}
