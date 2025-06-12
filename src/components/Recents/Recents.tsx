import history from "../../assets/svgs/icons8-history.svg";
import activity from "../../assets/svgs/icons8-activity.svg";
import { useBoundStore } from "../../store/store";
import { ActivityType, TrackDetails } from "../../types/GlobalTypes";
import songfallback from "../../assets/fallbacks/song-fallback.webp";

export default function Recents() {
  const recents = useBoundStore((state) => state.recents);
  const RecentSong = ({ id, name, artists, image }: TrackDetails) => {
    return (
      <>
        <li
          id={id}
          className="mb-0.5 flex h-[50px] w-full flex-shrink-0 items-center justify-start overflow-hidden bg-black"
        >
          <img
            src={image ? image[0]?.url : songfallback}
            alt="img"
            onError={(e) => (e.currentTarget.src = songfallback)}
            className="mr-4 h-[50px] w-[50px] border-r border-black"
          />
          <div className="w-[65%] leading-5">
            <p className="line-clamp-1 w-full text-ellipsis text-xs text-white">
              {name}
            </p>
            <p className="line-clamp-1 text-xs text-neutral-500">
              {artists.primary[0]?.name}
            </p>
          </div>
        </li>
      </>
    );
  };

  const Activity = ({ message }: ActivityType) => {
    return (
      <>
        <li className="mb-0.5 line-clamp-1 flex h-[35px] w-full flex-shrink-0 items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap bg-black px-2">
          <p className="mx-1 line-clamp-1 w-auto text-ellipsis text-xs font-semibold text-neutral-300">
            {message}
          </p>
        </li>
      </>
    );
  };

  return (
    <div className="hidden h-[95vh] flex-col items-center justify-start overflow-hidden border-r-[3px] border-black bg-neutral-950 xl:flex xl:w-[380px] 2xl:w-96">
      <div className="flex h-[45vh] w-full flex-col items-start justify-start overflow-hidden border-b-2 border-black bg-neutral-800">
        <div className="flex h-12 w-full items-center justify-between border-b-2 border-neutral-900 bg-neutral-700 px-3">
          <h2 className="w-full font-semibold text-white">Listening History</h2>
          <img src={history} alt="history" className="h-[20px] w-[20px]" />
        </div>
        <ul className="flex h-full w-full list-none flex-col items-center justify-start overflow-y-scroll bg-neutral-900">
          {recents.history.length > 1 &&
            recents.history.map((song: TrackDetails) => (
              <RecentSong
                key={song.id}
                id={song.id}
                name={song.name}
                type={""}
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
            ))}
        </ul>
      </div>
      <div className="flex h-[49.8vh] w-full flex-col items-start justify-start overflow-hidden bg-neutral-800">
        <div className="flex h-12 w-full items-center justify-between bg-neutral-700 px-3">
          <h2 className="w-full font-semibold text-white">Activity</h2>
          <img src={activity} alt="activity" className="h-[25px] w-[25px]" />
        </div>
        <ul className="h-[38dvh] w-full list-none overflow-y-scroll bg-neutral-900">
          {recents.activity.map((message: string, i: number) => (
            <Activity message={message} key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
