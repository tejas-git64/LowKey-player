/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../utils/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Progress({
  formatTime,
  seconds,
  progressRef,
  wavesurfer,
}: any) {
  const { nowPlaying } = useBoundStore();
  const [currentTime, setCurrentTime] = useState("0:00");
  // const onUrlChange = useCallback(() => {
  //   setUrlIndex((index) => (index + 1) % audioUrls`.length);
  // }, []);

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
