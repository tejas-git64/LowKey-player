import { memo, Suspense, useEffect } from "react";
import { useBoundStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { ActivityType, TrackDetails } from "../../types/GlobalTypes";
import Loading from "./Loading";
import Section from "../../components/Section/Section";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import Song from "../../components/Song/Song";
import fallbacktoday from "../../assets/timely/icons8-timely-today.png";
import fallbackweekly from "../../assets/timely/icons8-timely-weekly.png";
import fallbackmonthly from "../../assets/timely/icons8-timely-monthly.png";
import fallbackyearly from "../../assets/timely/icons8-timely-yearly.png";
import { useQuery } from "@tanstack/react-query";
import { getTimelyData, getWidgetData } from "../../api/requests";
import { genres, timelyData } from "../../utils/utils";
import logo from "../../assets/sound-waves.png";
import songfallback from "../../assets/icons8-song-fallback.png";
import notif from "../../assets/bell-svgrepo-com.svg";

export default function Home() {
  const changeGreeting = useBoundStore((state) => state.changeGreeting);
  const greeting = useBoundStore((state) => state.greeting);
  const setWidgetData = useBoundStore((state) => state.setWidgetData);
  const nowPlaying = useBoundStore((state) => state.nowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const notifications = useBoundStore((state) => state.notifications);
  const setNotifications = useBoundStore((state) => state.setNotifications);
  const navigate = useNavigate();

  const { isPending } = useQuery({
    queryKey: ["widget"],
    queryFn: getWidgetData,
    select: (data) => setWidgetData(data.data),
  });

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

  const Activity = ({ message }: ActivityType) => {
    return (
      <>
        <li className="mb-0.5 line-clamp-1 flex h-[35px] w-full flex-shrink-0 items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-black px-2">
          <p className="mx-1 line-clamp-1 w-auto text-ellipsis text-xs font-semibold text-neutral-300">
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

  useEffect(() => {
    if (greeting === "") setGreeting();
    timelyData.map((obj: { id: number; timely: string }) => {
      getTimelyData(obj.id, obj.timely);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Widget = memo(() => {
    const widget = useBoundStore((state) => state.home.widget);

    function setNowPlayingQueue(
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
      e.preventDefault();
      e.stopPropagation();
      setQueue({
        id: widget?.id || "",
        name: widget?.name || "",
        image: widget?.image || [],
        songs: widget?.songs || [],
      });
      widget !== null && setNowPlaying(widget.songs[0]);
      setIsPlaying(true);
    }

    return (
      <div className="h-auto max-h-max w-full px-3.5">
        <section className="relative z-0 mx-auto my-3 mb-7 flex h-80 w-full flex-col overflow-hidden rounded-2xl bg-transparent sm:flex-row">
          <img
            src={
              widget !== null && widget.image
                ? widget.image[2]?.url
                : songfallback
            }
            alt="img"
            width={320}
            height={320}
            className="h-auto w-auto flex-shrink-0 bg-neutral-700 sm:z-10 sm:h-[320px] sm:w-[320px] sm:rounded-xl"
            onClick={() =>
              widget !== null &&
              widget.id !== "" &&
              navigate(`/playlists/${widget.id}`)
            }
          />
          <div className="absolute right-2.5 top-[105px] z-20 flex h-auto w-[95%] items-end justify-between sm:left-0 sm:top-[268px] sm:h-12 sm:w-[320px] sm:justify-end sm:p-2 md:p-2 md:py-1">
            <p className="left-0 top-0 line-clamp-1 h-auto w-[80%] pl-1 text-xl font-bold text-white sm:hidden">
              {widget !== null && widget.name}
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
            className="absolute bottom-1.5 left-1.5 h-[158px] w-[96.5%] list-none overflow-x-hidden overflow-y-scroll rounded-xl bg-neutral-900 sm:static sm:ml-3 sm:mt-0 sm:h-full"
          >
            {widget !== null && widget.songs.length > 0 ? (
              widget.songs.map((song: TrackDetails, i: number) => (
                <Song
                  key={i}
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
              ))
            ) : (
              <p className="m-auto my-[12.5%] text-center text-xl text-neutral-500 sm:my-[135px]">
                No songs here...T_T
              </p>
            )}
          </ul>
        </section>
      </div>
    );
  });

  const TimelyPlaylists = memo(() => {
    const monthly = useBoundStore((state) => state.home.timely.monthly);
    const yearly = useBoundStore((state) => state.home.timely.yearly);
    const weekly = useBoundStore((state) => state.home.timely.weekly);
    const today = useBoundStore((state) => state.home.timely.today);

    return (
      <>
        <div className="mx-auto my-4 mt-6 grid h-auto w-full grid-cols-2 grid-rows-2 gap-3 px-3.5 sm:gap-5">
          <Link
            to={`/playlists/${today.id}`}
            className="flex h-12 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-800 shadow-md transition-all ease-linear hover:text-yellow-500 hover:shadow-lg hover:shadow-yellow-500 sm:h-full"
          >
            <img
              src={today.image ? today.image[0]?.url : fallbacktoday}
              alt="img"
              width={56}
              height={56}
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
              src={weekly.image ? weekly.image[0]?.url : fallbackweekly}
              alt="img"
              width={56}
              height={56}
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
              src={monthly.image ? monthly.image[0]?.url : fallbackmonthly}
              alt="img"
              width={56}
              height={56}
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
              src={yearly.image ? yearly.image[0]?.url : fallbackyearly}
              alt="img"
              width={56}
              height={56}
              className="h-full w-12 sm:w-14"
              onError={(e) => (e.currentTarget.src = fallbackyearly)}
            />
            <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-purple-400 sm:px-4 sm:text-sm">
              Yearly throwback
            </p>
          </Link>
        </div>
      </>
    );
  });

  const HomeComponent = () => {
    const recents = useBoundStore((state) => state.recents);

    return (
      <div className="h-auto w-full scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
        <div className="h-auto max-h-max w-full pt-2 xl:w-full">
          <div className="-mb-0.5 flex h-auto w-full items-center justify-between px-4 sm:hidden">
            <h1 className="text-left text-xl font-semibold text-white sm:hidden md:text-2xl">
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
          <Widget />
          <h1 className="-my-1 px-4 text-left text-xl font-semibold text-white">
            Timely Tracks
          </h1>
          <TimelyPlaylists />
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
    if (isPending) {
      throw new Promise((resolve) => setTimeout(resolve, 0));
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
