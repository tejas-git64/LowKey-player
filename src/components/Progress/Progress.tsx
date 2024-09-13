import { useState } from "react";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../utils/utils";
import WaveSurfer from "wavesurfer.js";

export default function Progress({
  formatTime,
  seconds,
  progressRef,
  wavesurfer,
}: {
  formatTime: (seconds: number) => string;
  seconds: number;
  wavesurfer: WaveSurfer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progressRef: any;
}) {
  const { nowPlaying } = useBoundStore();
  const [currentTime, setCurrentTime] = useState("0:00");

  wavesurfer.on("audioprocess", () => setCurrentTime(formatTime(seconds)));

  return (
    <div className="flex w-full items-center justify-between">
      <p className="pr-2 text-[12px] text-white">{currentTime}</p>
      <div ref={progressRef}></div>
      <p className="pl-2 text-[12px] text-white">
        {nowPlaying.track?.duration
          ? secondsToHMS(Number(nowPlaying.track?.duration))
          : ""}
      </p>
    </div>
  );
}
