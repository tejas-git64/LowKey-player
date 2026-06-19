import { RefObject, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../helpers/secondsToHMS";
import { saveToLocalStorage } from "../../helpers/saveToLocalStorage";

type WaveformType = {
  waveform: {
    isReplay: boolean;
    playCountRef: RefObject<number>;
    audioUrl: string;
    duration: number;
    volume: number;
    songIndex: number;
    queueLength: number;
    isMobileWidth: boolean;
    continuePlayback: () => void;
  };
  localSave: {
    url: string;
    time: number;
    duration: number;
  };
};

const Progress = ({ progress }: { progress: number }) => {
  return (
    <p className="mr-6 h-full w-[10px] text-center text-xs text-white sm:text-[10px]">
      {secondsToHMS(progress)}
    </p>
  );
};

const Waveform = ({
  isReplay,
  playCountRef,
  audioUrl,
  duration: trackDuration,
  volume,
  songIndex,
  isMobileWidth,
  continuePlayback,
}: WaveformType["waveform"]) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const id = useBoundStore((state) => state.nowPlaying.track?.id);
  const setQueue = useBoundStore((state) => state.setQueue);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const lastTrackRef = useRef<string>("");
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    waveSurferRef.current ??= WaveSurfer.create({
      container: waveformRef.current as HTMLDivElement,
      waveColor: "#666666",
      cursorColor: "#10B981",
      progressColor: "#10B981",
      interact: true,
      barHeight: isMobileWidth ? 1 : 3,
      barWidth: isMobileWidth ? 3 : 2,
      height: isMobileWidth ? 50 : 10,
      width: isMobileWidth ? "65dvw" : "25vw",
      dragToSeek: true,
      normalize: true,
      autoScroll: true,
      hideScrollbar: true,
    });

    return () => {
      waveSurferRef.current?.unAll();
      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
    };
  }, [isMobileWidth]);

  useEffect(() => {
    const isNewTrack = lastTrackRef.current !== id;
    const secureUrl = audioUrl.startsWith("https")
      ? audioUrl
      : audioUrl.replace("http", "https");
    const storedStr = localStorage.getItem("last-waveform");
    const stored = storedStr
      ? (JSON.parse(storedStr) as WaveformType["localSave"])
      : null;
    if (waveSurferRef.current) {
      if (isNewTrack) waveSurferRef.current.load(secureUrl);
      const handleReady = () => {
        if (isNewTrack && id) {
          lastTrackRef.current = id;
          if (stored?.url === secureUrl) {
            waveSurferRef.current?.seekTo(stored.time / (stored.duration || 1));
          }
        } else if (lastTimeRef.current > 0) {
          waveSurferRef.current?.seekTo(
            lastTimeRef.current / (trackDuration || 1),
          );
        }
        if (isPlaying) {
          waveSurferRef.current?.play();
        } else {
          waveSurferRef.current?.pause();
        }
      };
      if (isNewTrack) {
        lastTimeRef.current = 0;
      } else {
        lastTimeRef.current = waveSurferRef.current.getCurrentTime();
      }

      waveSurferRef.current.on("ready", handleReady);
      waveSurferRef.current.on("timeupdate", () => {
        setCurrentTime(
          Math.floor(waveSurferRef.current?.getCurrentTime() as number),
        );
      });
      return () => {
        waveSurferRef.current?.un("ready", handleReady);
      };
    }
  }, [audioUrl, id, isPlaying, trackDuration]);

  useEffect(() => {
    const saveState = () => {
      saveToLocalStorage("last-waveform", {
        url: audioUrl,
        time: waveSurferRef.current?.getCurrentTime() || 0,
        duration: trackDuration || "0",
      });
    };
    globalThis.addEventListener("beforeunload", saveState);
    return () => {
      globalThis.removeEventListener("beforeunload", saveState);
    };
  }, [trackDuration, audioUrl]);

  useEffect(() => {
    if (waveSurferRef.current) {
      if (isPlaying) waveSurferRef.current.play();
      else waveSurferRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    waveSurferRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    const queueSongs = queue?.songs;
    function handleCompletion() {
      if (isReplay) {
        playCountRef.current += 1;
        if (playCountRef.current <= 1) {
          waveSurferRef.current?.seekTo(0);
          waveSurferRef.current?.play();
        } else {
          playCountRef.current = 0;
          continuePlayback();
        }
      } else if (
        songIndex !== -1 &&
        queueSongs &&
        songIndex < queueSongs.length - 1
      ) {
        setQueue({
          ...queue,
          songs: queueSongs.filter((_, idx) => idx !== songIndex),
        });
        continuePlayback();
      } else {
        setIsPlaying(false);
      }
    }

    waveSurferRef.current?.on("finish", handleCompletion);
    return () => {
      waveSurferRef.current?.un("finish", handleCompletion);
    };
  }, [
    continuePlayback,
    isReplay,
    playCountRef,
    queue,
    setIsPlaying,
    setQueue,
    songIndex,
  ]);

  return (
    <div
      data-testid="waveform-container"
      className="my-10 flex w-full flex-shrink-0 items-center justify-center space-x-3 pb-0.5 sm:mb-6"
    >
      <Progress progress={currentTime} />
      <div
        ref={waveformRef}
        id="wave"
        data-testid="waveform"
        className="flex w-[70%] items-center justify-center overflow-hidden sm:w-[23vw] md:w-[30vw] lg:w-[40vw] xl:max-w-[400px] 2xl:w-[420px]"
      />
      <p
        data-testid="duration"
        className="h-full flex-shrink-0 text-center text-xs text-white sm:text-[10px]"
      >
        {trackDuration ? secondsToHMS(Number(trackDuration)) : "--:--"}
      </p>
    </div>
  );
};

export default Waveform;
