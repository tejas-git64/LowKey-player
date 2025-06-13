import {
  useState,
  useEffect,
  startTransition,
  useMemo,
  useRef,
  memo,
} from "react";
import { useBoundStore } from "../../store/store";
import {
  ArtistInSong,
  Image,
  TrackDetails,
  UserPlaylist,
} from "../../types/GlobalTypes";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import down from "../../assets/svgs/down.svg";
import high from "../../assets/svgs/volume-high.svg";
import vol from "../../assets/svgs/volume-min-svgrepo.svg";
import mute from "../../assets/svgs/mute-svgrepo-com.svg";
import previous from "../../assets/svgs/previous.svg";
import next from "../../assets/svgs/next.svg";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import tick from "../../assets/svgs/tick.svg";
import downloadIcon from "../../assets/svgs/download-icon.svg";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import "../../App.css";
import Waveform from "../Waveform/Waveform";
import { toggleFavorite } from "../../helpers/toggleFavorite";
import { PLAYER_CONSTANTS } from "../../utils/utils";
import { getTrackImage } from "../../helpers/getTrackImage";
import { useNavigate } from "react-router-dom";
import { cleanString } from "../../helpers/cleanString";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { FollowButton } from "../FollowButton/FollowButton";

export type RootStateType = {
  control: {
    isReplay: boolean;
    setIsReplay: React.Dispatch<React.SetStateAction<boolean>>;
    songIndex: number;
    id: string;
  };
  volume: {
    name: string;
    id: string;
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
  };
};

export default function NowPlaying() {
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const queueSongs = useBoundStore((state) => state.nowPlaying.queue?.songs);
  const track = useBoundStore((state) => state.nowPlaying.track);
  const isMobilePlayer = useBoundStore(
    (state) => state.nowPlaying.isMobilePlayer,
  );
  const isMobileWidth = useResponsiveLayout();
  const [audioIndex, setAudioIndex] = useState(2);
  const [isReplay, setIsReplay] = useState(false);
  const [volume, setVolume] = useState(() => {
    const lastVol = localStorage.getItem("last-volume");
    return lastVol ? Number(lastVol) : PLAYER_CONSTANTS.DEFAULT_VOLUME;
  });
  const playCountRef = useRef(0);
  const setShowPlayer = useBoundStore((state) => state.setShowPlayer);
  let songIndex =
    queueSongs?.findIndex((song: TrackDetails) => song.id === track?.id) ?? -1;
  const uniqueArtists = [...new Set(track?.artists?.primary)].slice(0, 4);

  const continuePlayback = () => {
    if (queueSongs) {
      if (!queueSongs.length) {
        setIsPlaying(false);
        return;
      }

      if (isShuffling) {
        let randomIndex = Math.floor(Math.random() * queueSongs.length);
        if (queueSongs.length > 1 && queueSongs[randomIndex].id === track?.id) {
          randomIndex = (randomIndex + 1) % queueSongs.length;
        }
        setNowPlaying(queueSongs[randomIndex]);
        setIsPlaying(true);
        return;
      }

      if (songIndex !== -1 && songIndex < queueSongs.length - 1) {
        setNowPlaying(queueSongs[songIndex + 1]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${cleanString(filename)}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    if (volume === 0) {
      setIsPlaying(false);
    }
    const saveBeforeRefresh = () => {
      if (track) {
        localStorage.setItem("last-audio", JSON.stringify(track));
        localStorage.setItem("last-volume", String(volume));
        localStorage.setItem("last-quality", String(audioIndex));
      }
    };
    window.addEventListener("beforeunload", saveBeforeRefresh);
    return () => {
      window.removeEventListener("beforeunload", saveBeforeRefresh);
    };
  }, [track, volume, audioIndex]);

  useEffect(() => {
    const lastAudio = localStorage.getItem("last-audio");
    const lastAudioQuality = localStorage.getItem("last-quality");
    if (lastAudio) setNowPlaying(JSON.parse(lastAudio));
    if (lastAudioQuality) setAudioIndex(Number(lastAudioQuality));
  }, []);

  return (
    <div
      className={`${!isMobilePlayer ? "translate-y-[100%]" : "translate-y-0"} absolute bottom-0 z-20 flex h-full w-full flex-col items-center justify-start overflow-y-scroll bg-black pb-10 transition-transform sm:h-fit sm:translate-y-0 sm:flex-row sm:items-center sm:justify-between sm:pb-0 2xl:border 2xl:border-neutral-900`}
    >
      <div className="sm:h-12.5 flex h-max w-full flex-shrink-0 flex-col items-center justify-center sm:w-[30%] sm:max-w-[300px] sm:flex-row sm:justify-start sm:px-2.5">
        <div className="relative z-0 h-full w-full sm:mr-3 sm:w-auto">
          {isMobileWidth && (
            <button
              type="button"
              onClick={() => setShowPlayer(false)}
              className="absolute right-2 top-2 rounded-full bg-black px-2 py-0.5"
            >
              <img src={down} alt="toggle-drawer" />
            </button>
          )}
          <img
            src={getTrackImage(track?.image as Image[], isMobileWidth)}
            id="songImg"
            alt="song-img"
            onError={(e) => (e.currentTarget.src = songfallback)}
            className="h-auto w-full flex-shrink-0 rounded-lg sm:mr-3 sm:h-[50px] sm:w-[50px] sm:rounded-sm"
          />
          {isMobileWidth && <PlayerOptions track={track} />}
        </div>
        {track?.artists?.all && (
          <TrackInfo name={track?.name} artists={uniqueArtists} />
        )}
      </div>
      <div className="mt-8 flex h-auto w-full flex-col items-center space-y-1 sm:order-1 sm:-ml-3 sm:mt-0 sm:w-auto lg:w-[350px] xl:w-[450px] 2xl:w-[500px]">
        {/*Controls */}
        <Controls
          isReplay={isReplay}
          setIsReplay={setIsReplay}
          songIndex={songIndex || 0}
          id={track?.id || ""}
        />
        {/*Progress */}
        <div className="flex h-auto w-full items-center justify-between sm:h-5 sm:pb-3">
          {/*Waveform*/}
          {track?.downloadUrl && track.downloadUrl.length > 0 && (
            <Waveform
              isReplay={isReplay}
              playCountRef={playCountRef}
              audioUrl={track.downloadUrl[audioIndex]?.url}
              duration={Number(track?.duration)}
              volume={volume}
              songIndex={songIndex || 0}
              queueLength={queueSongs ? queueSongs.length : 0}
              continuePlayback={continuePlayback}
              id={track.id}
              isMobileWidth={isMobileWidth}
            />
          )}
        </div>
      </div>
      <div className="-mt-1 flex h-auto w-full max-w-[420px] flex-col items-end justify-between p-2 sm:order-2 sm:mt-0 sm:h-full sm:w-[30%] xl:w-[300px]">
        {!isMobileWidth && <PlayerOptions track={track} />}
        <VolumeControl
          name={track?.name || ""}
          id={track?.id || ""}
          volume={volume}
          setVolume={setVolume}
        />
      </div>
      {track && (
        <div className="mx-auto ml-8 mt-8 flex h-auto w-[90%] items-center justify-evenly sm:absolute sm:-top-[25px] sm:right-16 sm:w-[120px]">
          <div>
            <label
              htmlFor="quality"
              className="mr-4 text-xl text-white sm:hidden"
            >
              Quality
            </label>
            <select
              name="quality"
              id="quality"
              value={audioIndex}
              defaultValue={undefined}
              onChange={(e) => {
                e.stopPropagation();
                setAudioIndex(Number(e.target.value));
              }}
              disabled={track.downloadUrl?.length <= 1}
              className="mr-4 rounded-sm bg-neutral-950 p-0.5 text-center outline-none disabled:text-neutral-800 sm:mr-0 sm:bg-black sm:px-0 sm:text-xs"
            >
              {track?.downloadUrl?.map((d, i) => (
                <option key={d.url} value={i}>
                  {d.quality}
                </option>
              ))}
            </select>
          </div>
          {track.downloadUrl && (
            <button
              onClick={() => {
                const url = track?.downloadUrl[audioIndex]?.url;
                const filename = track?.name || "track";
                if (url) {
                  handleDownload(url, filename);
                }
              }}
              disabled={!track?.downloadUrl[audioIndex]?.url}
              className={`flex w-auto items-center justify-center bg-transparent px-0 py-1 text-lg text-white transition-colors sm:py-0 ${
                !track?.downloadUrl[audioIndex]?.url &&
                "pointer-events-none cursor-not-allowed bg-neutral-700"
              }`}
            >
              <p className="block sm:hidden">Download</p>
              <img
                src={downloadIcon}
                alt="download-icon"
                className="w-9 flex-shrink-0 pl-2 sm:h-[23px] sm:w-auto sm:pl-0"
              />
            </button>
          )}
        </div>
      )}
      {isMobilePlayer && (
        <div className="mt-14 w-full bg-neutral-950 p-4 px-5">
          <h2 className="text-xl font-semibold">Primary artists</h2>
          <div className="mt-6 flex h-auto w-full flex-col items-start justify-start">
            {uniqueArtists.map((artist) => (
              <Artist key={artist.id} {...artist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TrackInfo = memo(
  ({ name, artists }: { name: string; artists: ArtistInSong[] }) => {
    return (
      <div className="flex h-fit w-full flex-col items-start justify-center overflow-hidden text-ellipsis px-4 py-2 sm:h-full sm:max-w-[250px] sm:px-0">
        <h2 className="line-clamp-1 w-[80%] flex-shrink-0 text-wrap text-2xl font-bold text-white sm:w-full sm:text-sm">
          {cleanString(name)}
        </h2>
        <div className="my-1 line-clamp-1 flex w-[80%] items-center justify-start space-x-2 overflow-hidden whitespace-nowrap sm:my-0 sm:w-auto">
          {artists.map((artist) => {
            const str = cleanString(artist.name);
            return (
              <p
                key={artist.id}
                className="text-base text-neutral-400 sm:text-xs"
              >
                {str}
              </p>
            );
          })}
        </div>
      </div>
    );
  },
);
TrackInfo.displayName = "TrackInfo";

const PlayButton = () => {
  const id = useBoundStore((state) => state.nowPlaying.track?.id);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  return (
    <button
      type="button"
      onClick={() => {
        setIsPlaying(!isPlaying);
      }}
      style={{
        border: "none",
        outline: "none",
      }}
      className={`h-auto w-auto rounded-full border-none bg-neutral-100 p-2 outline-none disabled:cursor-not-allowed disabled:bg-neutral-600 sm:p-1`}
      disabled={!id}
    >
      <img
        src={isPlaying ? pause : play}
        alt="play/pause"
        className={`h-10 w-10 sm:h-[25px] sm:w-[25px]`}
      />
    </button>
  );
};

const PlayerOptions = ({ track }: { track: TrackDetails | null }) => {
  const userPlaylists = useBoundStore((state) => state.library.userPlaylists);
  const setCreationTrack = useBoundStore((state) => state.setCreationTrack);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
  const removeFavorite = useBoundStore((state) => state.removeFavorite);
  const favorites = useBoundStore((state) => state.favorites);
  const isFavorited = useMemo(
    () => favorites.songs?.some((song) => song.id === track?.id),
    [favorites],
  );
  const playlist: UserPlaylist | undefined = useMemo(
    () =>
      userPlaylists.find((obj) => {
        return obj.songs.find((song) => {
          return song.id === track?.id;
        });
      }),
    [userPlaylists, track?.id],
  ); //Provides the playlist of the track

  return (
    <div className="absolute -bottom-[48px] right-0 z-20 flex h-auto w-auto flex-shrink-0 items-center justify-end space-x-5 bg-black bg-inherit p-3 px-4 sm:static sm:w-16 sm:space-x-3 sm:bg-transparent sm:p-0 sm:pr-0.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          track && setCreationTrack(track);
          setRevealCreation(true);
        }}
        className="border bg-transparent p-0 disabled:cursor-not-allowed disabled:invert-[0.5]"
        disabled={!track}
      >
        <img
          src={playlist?.id ? tick : add}
          alt="tick"
          className="h-6 w-6 sm:h-[20px] sm:w-[20px]"
        />
      </button>
      <button
        type="button"
        onClick={(e) =>
          track &&
          toggleFavorite({
            e,
            track,
            isFavorited,
            setFavoriteSong,
            removeFavorite,
            startTransition,
          })
        }
        style={{
          border: "none",
          outline: "none",
        }}
        className="mx-3 border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
        disabled={!track?.id}
      >
        <img
          src={isFavorited ? favorited : favorite}
          alt="favorite"
          className="h-7 w-7 bg-transparent sm:h-[22px] sm:w-[22px]"
        />
      </button>
    </div>
  );
};

const Controls = memo(
  ({ isReplay, setIsReplay, songIndex, id }: RootStateType["control"]) => {
    const isShuffling = useBoundStore((state) => state.isShuffling);
    const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
    const queueSongs = useBoundStore((state) => state.nowPlaying.queue?.songs);
    const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);

    const handlePreviousTrack = () => {
      if (songIndex > 0 && queueSongs) {
        setNowPlaying(queueSongs[songIndex - 1]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    const handleNextTrack = () => {
      if (queueSongs && songIndex < queueSongs.length) {
        setNowPlaying(queueSongs[songIndex + 1]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    return (
      <div className="-ml-2 -mt-4 flex w-full max-w-[400px] flex-shrink-0 items-center justify-center space-x-[10%] sm:m-0 sm:space-x-5">
        <button
          type="button"
          className="bg-transparent p-0 disabled:cursor-not-allowed disabled:invert-[0.5]"
          onClick={(e) => {
            setIsShuffling(!isShuffling);
            e.stopPropagation();
          }}
          title="shuffle-button"
          disabled={queueSongs?.length === 0}
        >
          <svg
            width="64px"
            height="64px"
            viewBox="0 0 24 24"
            fill="none"
            className="-mt-0.5 h-[43px] w-[43px] bg-transparent sm:mt-0 sm:h-[30px] sm:w-[30px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                d="M16.4697 9.46967C16.1768 9.76256 16.1768 10.2374 16.4697 10.5303C16.7626 10.8232 17.2374 10.8232 17.5303 10.5303L16.4697 9.46967ZM19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967C19.2374 7.17678 18.7626 7.17678 18.4697 7.46967L19.5303 8.53033ZM18.4697 8.53033C18.7626 8.82322 19.2374 8.82322 19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967L18.4697 8.53033ZM17.5303 5.46967C17.2374 5.17678 16.7626 5.17678 16.4697 5.46967C16.1768 5.76256 16.1768 6.23744 16.4697 6.53033L17.5303 5.46967ZM19 8.75C19.4142 8.75 19.75 8.41421 19.75 8C19.75 7.58579 19.4142 7.25 19 7.25V8.75ZM16.7 8L16.6993 8.75H16.7V8ZM12.518 10.252L13.1446 10.6642L13.1446 10.6642L12.518 10.252ZM10.7414 11.5878C10.5138 11.9338 10.6097 12.3989 10.9558 12.6266C11.3018 12.8542 11.7669 12.7583 11.9946 12.4122L10.7414 11.5878ZM11.9946 12.4122C12.2222 12.0662 12.1263 11.6011 11.7802 11.3734C11.4342 11.1458 10.9691 11.2417 10.7414 11.5878L11.9946 12.4122ZM10.218 13.748L9.59144 13.3358L9.59143 13.3358L10.218 13.748ZM6.041 16V16.75H6.04102L6.041 16ZM5 15.25C4.58579 15.25 4.25 15.5858 4.25 16C4.25 16.4142 4.58579 16.75 5 16.75V15.25ZM11.9946 11.5878C11.7669 11.2417 11.3018 11.1458 10.9558 11.3734C10.6097 11.6011 10.5138 12.0662 10.7414 12.4122L11.9946 11.5878ZM12.518 13.748L13.1446 13.3358L13.1446 13.3358L12.518 13.748ZM16.7 16V15.25H16.6993L16.7 16ZM19 16.75C19.4142 16.75 19.75 16.4142 19.75 16C19.75 15.5858 19.4142 15.25 19 15.25V16.75ZM10.7414 12.4122C10.9691 12.7583 11.4342 12.8542 11.7802 12.6266C12.1263 12.3989 12.2222 11.9338 11.9946 11.5878L10.7414 12.4122ZM10.218 10.252L9.59143 10.6642L9.59144 10.6642L10.218 10.252ZM6.041 8L6.04102 7.25H6.041V8ZM5 7.25C4.58579 7.25 4.25 7.58579 4.25 8C4.25 8.41421 4.58579 8.75 5 8.75V7.25ZM17.5303 13.4697C17.2374 13.1768 16.7626 13.1768 16.4697 13.4697C16.1768 13.7626 16.1768 14.2374 16.4697 14.5303L17.5303 13.4697ZM18.4697 16.5303C18.7626 16.8232 19.2374 16.8232 19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697L18.4697 16.5303ZM19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697C19.2374 15.1768 18.7626 15.1768 18.4697 15.4697L19.5303 16.5303ZM16.4697 17.4697C16.1768 17.7626 16.1768 18.2374 16.4697 18.5303C16.7626 18.8232 17.2374 18.8232 17.5303 18.5303L16.4697 17.4697ZM17.5303 10.5303L19.5303 8.53033L18.4697 7.46967L16.4697 9.46967L17.5303 10.5303ZM19.5303 7.46967L17.5303 5.46967L16.4697 6.53033L18.4697 8.53033L19.5303 7.46967ZM19 7.25H16.7V8.75H19V7.25ZM16.7007 7.25C14.7638 7.24812 12.956 8.22159 11.8914 9.8398L13.1446 10.6642C13.9314 9.46813 15.2676 8.74861 16.6993 8.75L16.7007 7.25ZM11.8914 9.83979L10.7414 11.5878L11.9946 12.4122L13.1446 10.6642L11.8914 9.83979ZM10.7414 11.5878L9.59144 13.3358L10.8446 14.1602L11.9946 12.4122L10.7414 11.5878ZM9.59143 13.3358C8.80541 14.5306 7.47115 15.25 6.04098 15.25L6.04102 16.75C7.97596 16.7499 9.78113 15.7767 10.8446 14.1602L9.59143 13.3358ZM6.041 15.25H5V16.75H6.041V15.25ZM10.7414 12.4122L11.8914 14.1602L13.1446 13.3358L11.9946 11.5878L10.7414 12.4122ZM11.8914 14.1602C12.956 15.7784 14.7638 16.7519 16.7007 16.75L16.6993 15.25C15.2676 15.2514 13.9314 14.5319 13.1446 13.3358L11.8914 14.1602ZM16.7 16.75H19V15.25H16.7V16.75ZM11.9946 11.5878L10.8446 9.83979L9.59144 10.6642L10.7414 12.4122L11.9946 11.5878ZM10.8446 9.8398C9.78113 8.2233 7.97596 7.25005 6.04102 7.25L6.04098 8.75C7.47115 8.75004 8.80541 9.46939 9.59143 10.6642L10.8446 9.8398ZM6.041 7.25H5V8.75H6.041V7.25ZM16.4697 14.5303L18.4697 16.5303L19.5303 15.4697L17.5303 13.4697L16.4697 14.5303ZM18.4697 15.4697L16.4697 17.4697L17.5303 18.5303L19.5303 16.5303L18.4697 15.4697Z"
                fill="currentColor"
                className={`${queueSongs && queueSongs.length > 0 ? (isShuffling ? "fill-emerald-500" : "fill-white") : "fill-neutral-500"} ease duration-250 transition-colors`}
              />
            </g>
          </svg>
        </button>
        <button
          type="button"
          onClick={handlePreviousTrack}
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
          disabled={!queueSongs}
        >
          <img
            src={previous}
            alt="previous"
            className="h-10 w-10 bg-transparent sm:h-[28px] sm:w-[28px]"
          />
        </button>
        <PlayButton />
        <button
          type="button"
          onClick={handleNextTrack}
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
          disabled={!queueSongs}
        >
          <img
            src={next}
            alt="next"
            className="h-10 w-10 bg-transparent sm:h-[28px] sm:w-[28px]"
          />
        </button>
        <button
          type="button"
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
          onClick={() => setIsReplay(!isReplay)}
          disabled={!id}
        >
          <svg
            width="64px"
            height="64px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="previousAltIconTitle"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000000"
            className={`-mt-1 h-[35px] w-[35px] bg-transparent sm:-mt-0.5 sm:h-6 sm:w-6 ${isReplay ? "text-emerald-500" : "text-white"} ease duration-250 transition-colors`}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <title id="previousAltIconTitle">Previous</title>
              <path d="M8 4L4 8L8 12" />
              <path d="M4 8H14.5C17.5376 8 20 10.4624 20 13.5V13.5C20 16.5376 17.5376 19 14.5 19H5" />
            </g>
          </svg>
        </button>
      </div>
    );
  },
);

const VolumeControl = memo(
  ({ name, id, volume, setVolume }: RootStateType["volume"]) => {
    const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
    const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
    const handleVolumeControl = () => {
      if (!isPlaying && volume > 0) {
        setIsPlaying(true);
      }
    };
    return (
      <div className="-ml-2 mr-auto flex h-fit w-[95%] flex-shrink-0 flex-row-reverse items-center justify-end sm:mx-0 sm:ml-0 sm:mr-1.5 sm:mt-1.5 sm:w-auto sm:flex-row">
        <input
          type="range"
          name="song-volume"
          id="volumeSlider"
          min={0}
          className="h-auto w-full cursor-pointer appearance-none shadow-inner shadow-neutral-950 transition-all ease-linear disabled:cursor-not-allowed"
          max={1}
          step={0.1}
          aria-label="Volume"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          onMouseUp={handleVolumeControl}
          disabled={name === ""}
        />
        <img
          src={
            volume < PLAYER_CONSTANTS.VOLUME_THRESHOLDS.MUTE
              ? mute
              : volume < PLAYER_CONSTANTS.VOLUME_THRESHOLDS.MEDIUM
                ? vol
                : high
          }
          alt="volume"
          className={`mx-2 h-10 w-10 bg-transparent sm:-mr-2 sm:h-7 sm:w-7 ${
            id === "" ? "invert-[0.4]" : ""
          } disabled:cursor-not-allowed disabled:bg-neutral-900`}
        />
      </div>
    );
  },
);

const Artist = (artist: ArtistInSong) => {
  const navigate = useNavigate();
  const setShowPlayer = useBoundStore((state) => state.setShowPlayer);

  return (
    <div
      role={"link"}
      onClick={() => {
        setShowPlayer(false);
        navigate(`/artists/${artist.id}`);
      }}
      className="mb-2 flex w-full items-center justify-between bg-black pr-4 hover:cursor-pointer"
    >
      <div className="flex w-auto items-center justify-start">
        <img
          src={artist.image[0]?.url || artistfallback}
          alt="artist-image"
          className="mr-4 h-[50px] w-[50px] rounded-sm"
        />
        <p className="font-thin text-white">{artist.name}</p>
      </div>
      <FollowButton artist={artist} />
    </div>
  );
};
