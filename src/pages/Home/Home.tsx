import { memo, Suspense, useEffect } from "react";
import { useBoundStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { TrackDetails } from "../../types/GlobalTypes";
import Loading from "./Loading";
import Section from "../../components/Section/Section";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import Song from "../../components/Song/Song";
import fallbacktoday from "../../assets/fallbacks/timely/icons8-timely-today.png";
import fallbackweekly from "../../assets/fallbacks/timely/icons8-timely-weekly.png";
import fallbackmonthly from "../../assets/fallbacks/timely/icons8-timely-monthly.png";
import fallbackyearly from "../../assets/fallbacks/timely/icons8-timely-yearly.png";
import { useQuery } from "@tanstack/react-query";
import { getTimelyData, getWidgetData } from "../../api/requests";
import { genres, timelyData } from "../../utils/utils";
import widgetfallback from "../../assets/fallbacks/widget-fallback.webp";
import SongFallback from "../../components/Song/SongFallback";

export default function Home() {
  const changeGreeting = useBoundStore((state) => state.changeGreeting);
  const greeting = useBoundStore((state) => state.greeting);

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

  useEffect(() => {
    if (greeting === "") setGreeting();
    timelyData.map((obj: { id: number; timely: string }) => {
      getTimelyData(obj.id, obj.timely);
    });
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="h-auto w-full scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
          <div className="h-auto max-h-max w-full xl:w-full">
            <Widget />
            <h1 className="my-2 px-4 pt-2 text-left text-xl font-semibold text-white">
              Timely tracks
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
      </Suspense>
    </>
  );
}

const Widget = memo(() => {
  const widget = useBoundStore((state) => state.home.widget);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setWidgetData = useBoundStore((state) => state.setWidgetData);
  const navigate = useNavigate();

  const { isPending } = useQuery({
    queryKey: ["widget"],
    queryFn: getWidgetData,
    select: (data) => setWidgetData(data.data),
  });

  const handlePlaylist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (!isPlaying) {
      setQueue({
        id: widget?.id || "",
        name: widget?.name || "",
        image: widget?.image || [],
        songs: widget?.songs || [],
      });
      widget !== null && setNowPlaying(widget.songs[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const getWidgetImage = () => {
    if (widget) {
      const obj = widget.image.find((img) => img.quality === "500x500");
      return obj?.url;
    }
    return widgetfallback;
  };

  return (
    <div className="h-auto max-h-max w-full px-3.5 sm:pt-0.5">
      <section className="relative z-0 mx-auto mb-7 flex h-80 w-full flex-col overflow-hidden rounded-sm bg-transparent sm:my-3 sm:h-[40vw] sm:flex-row md:h-80">
        <img
          src={getWidgetImage()}
          alt="img"
          width={320}
          height={320}
          fetchPriority="high"
          className="aspect-square h-auto w-auto flex-shrink-0 rounded-sm bg-neutral-700 brightness-75 contain-layout sm:z-10 sm:h-[40vw] sm:w-[40vw] sm:brightness-100 md:h-80 md:w-80"
          onClick={() =>
            widget !== null &&
            widget.id !== "" &&
            navigate(`/playlists/${widget.id}`)
          }
        />
        <div className="absolute right-2.5 top-[105px] z-20 flex h-auto w-[95%] items-end justify-between sm:-left-16 sm:top-[80%] sm:h-12 sm:w-[48vw] sm:justify-end sm:p-2 md:w-[370px] md:py-1">
          <p className="left-0 top-0 line-clamp-1 h-auto w-[80%] text-3xl font-bold text-white sm:hidden sm:text-xl">
            {widget !== null && widget.name}
          </p>
          <button
            style={{
              outline: "none",
              border: "1px solid #000",
            }}
            onClick={handlePlaylist}
            className="rounded-full bg-emerald-500 p-1.5"
          >
            <img
              src={isPlaying ? pause : play}
              alt="play"
              loading="lazy"
              className="h-8 w-8"
            />
          </button>
        </div>
        <ul
          id="widget-container"
          className="absolute bottom-1.5 left-[1.75%] h-[158px] w-[96.5%] list-none overflow-x-hidden overflow-y-scroll rounded-sm bg-neutral-900 sm:static sm:ml-3 sm:mt-0 sm:h-full"
        >
          {!isPending ? (
            widget ? (
              widget.songs.map((song: TrackDetails) => (
                <Song key={song.id} track={song} isWidgetSong={true} />
              ))
            ) : (
              <p className="m-auto my-[12.5%] text-center text-xl text-neutral-500 sm:my-[135px]">
                No songs here...T_T
              </p>
            )
          ) : (
            <>
              <SongFallback />
              <SongFallback />
              <SongFallback />
              <SongFallback />
              <SongFallback />
              <SongFallback />
              <SongFallback />
            </>
          )}
        </ul>
      </section>
    </div>
  );
});

const TimelyPlaylists = memo(() => {
  const monthly = useBoundStore((state) => state.home.timely.monthly);
  const latest = useBoundStore((state) => state.home.timely.latest);
  const weekly = useBoundStore((state) => state.home.timely.weekly);
  const viral = useBoundStore((state) => state.home.timely.viral);

  return (
    <>
      <div className="mx-auto mb-4 mt-1 grid h-auto w-full grid-cols-2 grid-rows-2 gap-3 px-3.5 sm:gap-5">
        <Link
          to={`/playlists/${viral?.id}`}
          className="flex h-12 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm transition-all ease-linear hover:text-yellow-500 hover:shadow-md hover:shadow-yellow-500 sm:h-full"
        >
          <img
            src={viral?.image[0]?.url || fallbacktoday}
            alt="img"
            width={56}
            height={56}
            fetchPriority="high"
            className="h-full w-12 sm:w-14"
            onError={(e) => (e.currentTarget.src = fallbacktoday)}
          />
          <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-yellow-400 sm:px-4 sm:text-base">
            Viral mix
          </p>
        </Link>
        <Link
          to={`/playlists/${weekly?.id}`}
          className="flex h-12 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm transition-all ease-linear hover:text-teal-500 hover:shadow-md hover:shadow-teal-500 sm:h-auto"
        >
          <img
            src={weekly?.image[0]?.url || fallbackweekly}
            alt="img"
            width={56}
            height={56}
            fetchPriority="high"
            className="h-full w-12 sm:w-14"
            onError={(e) => (e.currentTarget.src = fallbackweekly)}
          />
          <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-teal-500 sm:px-4 sm:text-base">
            Top weekly
          </p>
        </Link>
        <Link
          to={`/playlists/${monthly?.id}`}
          className="flex h-12 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm transition-all ease-linear hover:text-rose-500 hover:shadow-md hover:shadow-rose-500 sm:h-auto"
        >
          <img
            src={monthly?.image[0]?.url || fallbackmonthly}
            alt="img"
            width={56}
            height={56}
            fetchPriority="high"
            className="h-full w-12 sm:w-14"
            onError={(e) => (e.currentTarget.src = fallbackmonthly)}
          />
          <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-rose-400 sm:px-4 sm:text-base">
            Best of the month
          </p>
        </Link>
        <Link
          to={`/playlists/${latest?.id}`}
          className="flex h-12 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm transition-all ease-linear hover:text-purple-500 hover:shadow-md hover:shadow-purple-500 sm:h-auto"
        >
          <img
            src={latest?.image[0]?.url || fallbackyearly}
            alt="img"
            width={56}
            height={56}
            fetchPriority="high"
            className="h-full w-12 sm:w-14"
            onError={(e) => (e.currentTarget.src = fallbackyearly)}
          />
          <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-purple-400 sm:px-4 sm:text-base">
            Latest tracks
          </p>
        </Link>
      </div>
    </>
  );
});
