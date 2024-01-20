import previous from "../../assets/previous.svg";
import next from "../../assets/next.svg";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import { useBoundStore } from "../../store/store";
import shuffle from "../../assets/icons8-shuffle.svg";
// import shuffling from "../../assets/icons8-shuffle-activated.svg";
import replay from "../../assets/replay.svg";
import WaveSurfer from "wavesurfer.js/dist/types.js";
// import replaying from "../../assets/replaying.svg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Controls({ wavesurfer }: any) {
  const { nowPlaying, setIsPlaying } = useBoundStore();
  const waveform: WaveSurfer = wavesurfer;

  function togglePlayPause() {
    waveform.playPause();
    waveform.isPlaying() ? setIsPlaying(true) : setIsPlaying(false);
  }

  return (
    <div className="flex w-[250px] items-center justify-around pt-0.5">
      <button
        className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
        disabled={nowPlaying.track?.id === ""}
      >
        <img
          src={shuffle}
          alt="shuffle"
          className="h-[20px] w-[20px] bg-transparent"
        />
      </button>
      <button
        className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
        disabled={nowPlaying.track?.id === ""}
      >
        <img
          src={previous}
          alt="previous"
          className="h-[28px] w-[28px] bg-transparent"
        />
      </button>
      <div>
        {nowPlaying.isPlaying ? (
          <button
            onClick={() => togglePlayPause()}
            style={{
              border: "none",
              outline: "none",
            }}
            className="rounded-full border-none bg-white p-1 outline-none"
          >
            <img
              src={pause}
              alt="pause"
              className="h-[28px] w-[28px] bg-transparent"
            />
          </button>
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            style={{
              border: "none",
              outline: "none",
            }}
            className={`rounded-full ${
              nowPlaying.track?.id === "" ? "bg-neutral-500" : "bg-white"
            } p-1 disabled:cursor-not-allowed`}
            disabled={nowPlaying.track?.id === ""}
          >
            <img
              src={play}
              alt="play"
              className="h-[28px] w-[28px] bg-transparent pl-1"
            />
          </button>
        )}
      </div>
      <button
        className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
        disabled={nowPlaying.track?.id === ""}
      >
        <img
          src={next}
          alt="previous"
          className="h-[28px] w-[28px] bg-transparent"
        />
      </button>
      <button
        className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
        disabled={nowPlaying.track?.id === ""}
      >
        <img
          src={replay}
          alt="replay"
          className="h-[23px] w-[23px] bg-transparent"
        />
      </button>
    </div>
  );
}
