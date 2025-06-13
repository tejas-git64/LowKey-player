import { RefObject, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import secondsToHMS from "../../utils/utils";
import { useBoundStore } from "../../store/store";

type WaveformType = {
  waveform: {
    isReplay: boolean;
    playCountRef: RefObject<number>;
    audioUrl: string;
    duration: number;
    volume: number;
    songIndex: number;
    queueLength: number;
    id: string;
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
    <p className="mr-6 h-full w-[10px] text-center text-sm text-white sm:mr-4 sm:text-[10px]">
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
  id,
  isMobileWidth,
  continuePlayback,
}: WaveformType["waveform"]) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const isPlaying = useBoundStore((state) => state.nowPlaying.isPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const queue = useBoundStore((state) => state.nowPlaying.queue);
  const setQueue = useBoundStore((state) => state.setQueue);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const lastTrackRef = useRef<string>("");
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!waveSurferRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current as HTMLDivElement,
        waveColor: "#666666",
        cursorColor: "#10B981",
        progressColor: "#10B981",
        interact: true,
        barHeight: isMobileWidth ? 8 : 2,
        barWidth: isMobileWidth ? 3 : 2,
        height: isMobileWidth ? 50 : 10,
        width: isMobileWidth ? 350 : 400,
        fillParent: true,
        dragToSeek: true,
        autoScroll: true,
        normalize: true,
      });
    }

    return () => {
      waveSurferRef.current?.unAll();
      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
    };
  }, [isMobileWidth]);

  useEffect(() => {
    if (!waveSurferRef.current) return;
    const isNewTrack = lastTrackRef.current !== id;

    if (!isNewTrack) {
      lastTimeRef.current = waveSurferRef.current.getCurrentTime();
    } else {
      lastTimeRef.current = 0;
    }
    waveSurferRef.current.load(audioUrl);

    const handleReady = () => {
      if (isNewTrack) {
        const storedStr = localStorage.getItem("last-waveform");
        const stored = storedStr
          ? (JSON.parse(storedStr) as WaveformType["localSave"])
          : null;
        if (stored && stored.url === audioUrl) {
          waveSurferRef.current?.seekTo(stored.time / (stored.duration || 1));
        }
      } else if (lastTimeRef.current > 0) {
        waveSurferRef.current?.seekTo(
          lastTimeRef.current / (trackDuration || 1),
        );
      }
      isPlaying
        ? waveSurferRef.current?.play()
        : waveSurferRef.current?.pause();
    };
    waveSurferRef.current.on("ready", handleReady);
    waveSurferRef.current.on("timeupdate", () => {
      setCurrentTime(
        Math.floor(waveSurferRef.current?.getCurrentTime() as number) || 0,
      );
    });
    lastTrackRef.current = id;

    const saveToLocalStorage = () => {
      localStorage.setItem(
        "last-waveform",
        JSON.stringify({
          url: audioUrl,
          time: waveSurferRef.current?.getCurrentTime() || 0,
          duration: trackDuration || "0",
        }),
      );
    };
    window.addEventListener("beforeunload", saveToLocalStorage);
    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.un("ready", handleReady);
      }
      window.removeEventListener("beforeunload", saveToLocalStorage);
    };
  }, [audioUrl, id, trackDuration]);

  useEffect(() => {
    if (!waveSurferRef.current) return;
    if (isPlaying) waveSurferRef.current.play();
    else waveSurferRef.current.pause();
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
      } else {
        console.log(songIndex);
        if (
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
    }

    waveSurferRef.current?.on("finish", handleCompletion);
    return () => {
      waveSurferRef.current?.un("finish", handleCompletion);
    };
  }, [isReplay, queue?.songs, songIndex]);

  return (
    <div className="my-10 flex w-full flex-shrink-0 items-center justify-center space-x-3 pb-0.5 sm:mb-6">
      <Progress progress={currentTime} />
      <div
        ref={waveformRef}
        id="wave"
        className="flex w-[70%] items-center justify-center overflow-hidden sm:w-[185px] lg:w-[300px] xl:max-w-[400px] 2xl:w-[500px]"
      />
      <p className="h-full flex-shrink-0 text-center text-sm text-white sm:text-[10px]">
        {trackDuration ? secondsToHMS(Number(trackDuration)) : "--:--"}
      </p>
    </div>
  );
};

export default Waveform;
