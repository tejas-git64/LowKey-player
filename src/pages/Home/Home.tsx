import { memo, Suspense, useEffect, useRef } from "react";
import { useBoundStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Image, TrackDetails } from "../../types/GlobalTypes";
import Section from "../../components/Section/Section";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import Song from "../../components/Song/Song";
import fallbacktoday from "../../assets/fallbacks/timely/icons8-timely-today.webp";
import fallbackweekly from "../../assets/fallbacks/timely/icons8-timely-weekly.webp";
import fallbackmonthly from "../../assets/fallbacks/timely/icons8-timely-monthly.webp";
import fallbackyearly from "../../assets/fallbacks/timely/icons8-timely-yearly.webp";
import { useQuery } from "@tanstack/react-query";
import { getTimelyData, getWidgetData } from "../../api/requests";
import { genres } from "../../utils/utils";
import widgetfallback from "../../assets/fallbacks/widget-fallback.webp";
import { TimelyFallback, Widgetfallback } from "./Loading";

export default function Home() {
  const changeGreeting = useBoundStore((state) => state.changeGreeting);
  const greeting = useBoundStore((state) => state.greeting);
  const homeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 12) {
      changeGreeting("Good morning");
    } else if (hour > 12 && hour <= 15) {
      changeGreeting("Good afternoon");
    } else if (hour > 15 && hour <= 18) {
      changeGreeting("Good evening");
    } else if (hour > 18) {
      changeGreeting("Good night");
    } else {
      changeGreeting("Jump back in");
    }
  };

  function fadeOutNavigate(str: string) {
    homeRef.current?.classList.remove("home-fadein");
    homeRef.current?.classList.add("home-fadeout");
    setTimeout(() => {
      navigate(str);
    }, 150);
  }

  useEffect(() => {
    setTimeout(() => {
      homeRef.current?.classList.remove("home-fadeout");
      homeRef.current?.classList.add("home-fadein");
    }, 150);
    if (greeting === "") setGreeting();
  }, []);

  return (
    <div
      data-testid="home-page"
      ref={homeRef}
      className="home-fadeout h-auto max-h-max w-full scroll-smooth duration-300 ease-in-out xl:w-full"
    >
      <Widget fadeOutNavigate={fadeOutNavigate} />
      <h1 className="my-2 px-4 pt-2 text-left text-xl font-semibold text-white">
        Timely tracks
      </h1>
      <TimelyPlaylists fadeOutNavigate={fadeOutNavigate} />
      <div className="h-auto max-h-max w-full pb-28 sm:pb-14">
        {/* Genres */}
        {genres.map((genre: string) => (
          <Section
            genre={genre}
            key={genre}
            fadeOutNavigate={fadeOutNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export const Widget = memo(
  ({ fadeOutNavigate }: { fadeOutNavigate: (str: string) => void }) => {
    const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const setQueue = useBoundStore((state) => state.setQueue);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
    const iRef = useRef<HTMLImageElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);
    const { data } = useQuery({
      queryKey: ["widget"],
      queryFn: getWidgetData,
      enabled: true,
      refetchOnReconnect: "always",
      _optimisticResults: "isRestoring",
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
    });

    const lcpImg =
      data?.image?.find((img: Image) => img.quality === "500x500")?.url ??
      widgetfallback;

    const handlePlaylist = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      e.stopPropagation();
      if (!isPlaying) {
        setQueue({
          id: data?.id || "",
          name: data?.name || "",
          image: data?.image || [],
          songs: data?.songs || [],
        });
        data !== null && setNowPlaying(data.songs[0]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    function handleImageLoad() {
      iRef.current?.classList.remove("widget-banner-fadeout");
      iRef.current?.classList.add("widget-banner-fadein");
      widgetRef.current?.classList.remove("song-fadeout");
      widgetRef.current?.classList.add("song-fadein");
    }

    return (
      <Suspense fallback={<Widgetfallback />}>
        <div
          ref={widgetRef}
          data-testid="widget"
          className="song-fadeout h-auto max-h-max w-full px-3.5 sm:pt-0.5"
        >
          <section className="relative z-0 mx-auto mb-7 flex h-80 w-full flex-col overflow-hidden rounded-sm bg-transparent sm:my-3 sm:h-[40vw] sm:flex-row md:h-80">
            <img
              ref={iRef}
              src={lcpImg}
              alt="img"
              fetchPriority="high"
              loading="eager"
              data-testid="widget-image"
              className="widget-banner-fadeout aspect-square h-auto w-auto flex-shrink-0 cursor-pointer rounded-sm brightness-75 duration-200 ease-in contain-layout sm:z-10 sm:h-[40vw] sm:w-[40vw] sm:brightness-100 md:h-80 md:w-80"
              onClick={() =>
                data !== null &&
                data.id !== "" &&
                fadeOutNavigate(`/playlists/${data.id}`)
              }
              onLoad={handleImageLoad}
              onError={(e) => (e.currentTarget.src = widgetfallback)}
            />
            <div className="absolute right-2.5 top-[105px] z-20 flex h-auto w-[95%] items-end justify-between sm:-left-16 sm:top-[80%] sm:h-12 sm:w-[48vw] sm:justify-end sm:p-2 md:w-[370px] md:py-1">
              <p className="left-0 top-0 line-clamp-1 h-auto w-[80%] text-3xl font-bold text-white sm:hidden sm:text-xl">
                {data !== null && data?.name}
              </p>
              <button
                style={{
                  border: "1px solid #000",
                }}
                tabIndex={data ? 0 : -1}
                onClick={handlePlaylist}
                data-testid="widget-btn"
                className="rounded-full bg-emerald-500 p-1.5 focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-black"
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
              {data && data.songs?.length > 0 ? (
                data.songs.map((song: TrackDetails, i: number) => (
                  <Song
                    index={i}
                    key={song.id}
                    track={song}
                    isWidgetSong={true}
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
      </Suspense>
    );
  },
);

export const TimelyPlaylists = memo(
  ({ fadeOutNavigate }: { fadeOutNavigate: (str: string) => void }) => {
    const timeEl = useRef<HTMLDivElement>(null);
    const loadedCount = useRef(0);

    const { data } = useQuery({
      queryKey: ["timely"],
      queryFn: getTimelyData,
      enabled: true,
      refetchOnReconnect: "always",
      _optimisticResults: "isRestoring",
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
    });
    const { viral, weekly, monthly, latest } = data || {};

    function handleLoadedImage() {
      loadedCount.current += 1;
      if (loadedCount.current === 4) {
        timeEl.current?.classList.remove("song-fadeout");
        timeEl.current?.classList.add("song-fadein");
      }
    }

    return (
      <Suspense fallback={<TimelyFallback />}>
        <div
          ref={timeEl}
          data-testid="timely-playlists"
          className="song-fadeout mx-auto mb-4 mt-1 grid h-auto w-full cursor-pointer grid-cols-2 grid-rows-2 gap-3 px-3.5 duration-200 ease-in sm:gap-5"
        >
          <div
            tabIndex={0}
            data-testid="today-playlist"
            onClick={() => fadeOutNavigate(`/playlists/${viral?.id}`)}
            className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear hover:text-yellow-500 hover:shadow-md hover:shadow-yellow-500 focus-visible:bg-neutral-700 sm:h-full"
          >
            <img
              src={(viral && viral.image[0]?.url) || fallbacktoday}
              alt="img"
              width={50}
              height={50}
              fetchPriority="high"
              data-testid="today-playlist-image"
              loading="eager"
              className="h-[50px] w-[50px] rounded-sm"
              onLoad={handleLoadedImage}
              onError={(e) => (e.currentTarget.src = fallbacktoday)}
            />
            <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-yellow-400 duration-200 ease-in sm:px-4 sm:text-base">
              Viral mix
            </p>
          </div>
          <div
            tabIndex={0}
            data-testid="weekly-playlist"
            onClick={() => fadeOutNavigate(`/playlists/${weekly?.id}`)}
            className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear hover:text-teal-500 hover:shadow-md hover:shadow-teal-500 focus-visible:bg-neutral-700 sm:h-auto"
          >
            <img
              src={(weekly && weekly.image[0]?.url) || fallbackweekly}
              alt="img"
              width={50}
              height={50}
              fetchPriority="high"
              loading="eager"
              data-testid="weekly-playlist-image"
              className="h-[50px] w-[50px] rounded-sm"
              onLoad={handleLoadedImage}
              onError={(e) => (e.currentTarget.src = fallbackweekly)}
            />
            <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-teal-500 sm:px-4 sm:text-base">
              Top weekly
            </p>
          </div>
          <div
            tabIndex={0}
            data-testid="monthly-playlist"
            onClick={() => fadeOutNavigate(`/playlists/${monthly?.id}`)}
            className="flex h-12 w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear hover:text-rose-500 hover:shadow-md hover:shadow-rose-500 focus-visible:bg-neutral-700 sm:h-auto"
          >
            <img
              src={(monthly && monthly.image[0]?.url) || fallbackmonthly}
              alt="img"
              width={50}
              height={50}
              fetchPriority="high"
              loading="eager"
              data-testid="monthly-playlist-image"
              className="h-[50px] w-[50px] rounded-sm"
              onLoad={handleLoadedImage}
              onError={(e) => (e.currentTarget.src = fallbackmonthly)}
            />
            <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-rose-400 sm:px-4 sm:text-base">
              Best of the month
            </p>
          </div>
          <div
            tabIndex={0}
            data-testid="yearly-playlist"
            onClick={() => fadeOutNavigate(`/playlists/${latest?.id}`)}
            className="flex h-[50px] w-full items-center justify-start overflow-hidden rounded-sm bg-neutral-800 shadow-sm outline-none transition-all ease-linear hover:text-purple-500 hover:shadow-md hover:shadow-purple-500 focus-visible:bg-neutral-700 sm:h-auto"
          >
            <img
              src={(latest && latest.image[0]?.url) || fallbackyearly}
              alt="img"
              width={50}
              height={50}
              fetchPriority="high"
              loading="eager"
              data-testid="yearly-playlist-image"
              className="h-[50px] w-[50px] rounded-sm"
              onLoad={handleLoadedImage}
              onError={(e) => (e.currentTarget.src = fallbackyearly)}
            />
            <p className="sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-purple-400 sm:px-4 sm:text-base">
              Latest tracks
            </p>
          </div>
        </div>
      </Suspense>
    );
  },
);
