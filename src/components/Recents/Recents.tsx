import history from "../../assets/svgs/icons8-history.svg";
import activity from "../../assets/svgs/icons8-activity.svg";
import { useBoundStore } from "../../store/store";
import { ActivityType, TrackDetails } from "../../types/GlobalTypes";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import { cleanString } from "../../helpers/cleanString";
import { memo, useEffect, useRef } from "react";

type RecentTypes = {
  history: TrackDetails[] | null;
  activity: string[];
};

const Recents = memo(() => {
  const recentTracks = useBoundStore((state) => state.recents.history);
  const recentActivity = useBoundStore((state) => state.recents.activity);
  const setHistory = useBoundStore((state) => state.setHistory);
  const setActivity = useBoundStore((state) => state.setActivity);

  useEffect(() => {
    const stored = localStorage.getItem("last-recents");
    if (stored) {
      const { history, activity }: RecentTypes = JSON.parse(stored);
      for (const h of history || []) {
        setHistory(h);
      }
      for (const a of activity || []) {
        setActivity(a);
      }
    }
  }, [setActivity, setHistory]);

  return (
    <div
      data-testid="recents"
      className="hidden h-[95vh] flex-col items-center justify-start overflow-hidden border-r-[3px] border-black bg-neutral-950 xl:flex xl:w-[380px] 2xl:w-96"
    >
      <div className="flex h-[45vh] w-full flex-col items-start justify-start overflow-hidden border-b-2 border-black bg-neutral-800">
        <div className="flex h-12 w-full items-center justify-between border-b-2 border-neutral-900 bg-neutral-700 px-3">
          <h2 className="w-full font-semibold text-white">Listening History</h2>
          <img src={history} alt="history" className="h-[20px] w-[20px]" />
        </div>
        <ul
          data-testid="recent-songs"
          className="flex h-full w-full list-none flex-col items-center justify-start overflow-y-scroll bg-neutral-900"
        >
          {recentTracks?.map((song: TrackDetails, i) => (
            <RecentSong key={song.id} i={i} {...song} />
          ))}
        </ul>
      </div>
      <div className="flex h-[49.8vh] w-full flex-col items-start justify-start overflow-hidden bg-neutral-800">
        <div className="flex h-12 w-full items-center justify-between bg-neutral-700 px-3">
          <h2 className="w-full font-semibold text-white">Activity</h2>
          <img src={activity} alt="activity" className="h-[25px] w-[25px]" />
        </div>
        <ul
          data-testid="recent-activity"
          className="h-[38dvh] w-full list-none overflow-y-scroll bg-neutral-900"
        >
          {recentActivity.map((message: string, i) => (
            <Activity key={i} i={i} message={message} />
          ))}
        </ul>
      </div>
    </div>
  );
});
Recents.displayName = "Recents";
export default Recents;

const RecentSong = ({
  id,
  name,
  artists,
  image,
  i,
}: TrackDetails & { i: number }) => {
  const recentEl = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      recentEl.current?.classList.remove("song-fadeout");
      recentEl.current?.classList.add("song-fadein");
    }, i * 50);
    return () => {
      clearTimeout(timer);
    };
  }, [i]);
  return (
    <li
      id={id}
      ref={recentEl}
      data-testid="recent-song"
      className="song-fadeout mb-0.5 flex h-[50px] w-full flex-shrink-0 items-center justify-start overflow-hidden bg-black duration-200 ease-in"
    >
      <img
        src={image[0] ? image[0].url : songfallback}
        alt={`${name}-img`}
        onError={(e) => (e.currentTarget.src = songfallback)}
        className="mr-4 h-[50px] w-[50px] border-r border-black"
      />
      <div className="w-[65%] leading-5">
        <p className="line-clamp-1 w-full text-ellipsis text-xs text-white">
          {cleanString(name) || "Unknown track"}
        </p>
        <p className="line-clamp-1 text-xs text-neutral-400">
          {artists.primary[0]
            ? cleanString(artists.primary[0].name)
            : "Unknown Artist"}
        </p>
      </div>
    </li>
  );
};

const Activity = ({ message, i }: ActivityType & { i: number }) => {
  const activityEl = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      activityEl.current?.classList.remove("song-fadeout");
      activityEl.current?.classList.add("song-fadein");
    }, i * 50);
    return () => {
      clearTimeout(timer);
    };
  }, [i]);

  return (
    <li
      data-testid={`activity-${i}`}
      ref={activityEl}
      className="song-fadeout mb-0.5 line-clamp-1 flex h-[35px] w-full flex-shrink-0 items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap bg-black px-2 duration-200 ease-in"
    >
      <p className="mx-1 line-clamp-1 w-auto text-ellipsis text-xs font-semibold text-neutral-300">
        {message}
      </p>
    </li>
  );
};
