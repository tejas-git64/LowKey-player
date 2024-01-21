import { useBoundStore } from "../../store/store";
import down from "../../assets/down.svg";
import favorite from "../../assets/icons8-heart.svg";
import favorited from "../../assets/icons8-favorited.svg";
import add from "../../assets/icons8-addplaylist-28.svg";
import replay from "../../assets/replay.svg";
import shuffle from "../../assets/icons8-shuffle.svg";
import shuffling from "../../assets/icons8-shuffle-activated.svg";
import previous from "../../assets/previous.svg";
import next from "../../assets/next.svg";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import songfallback from "../../assets/icons8-song-fallback.png";
import { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import secondsToHMS from "../../utils/utils";
import { ArtistType, TrackDetails } from "../../types/GlobalTypes";
import tick from "../../assets/icons8-tick.svg";
import artistfallback from "../../assets/icons8-artist-fallback.png";

export default function MobilePlayer() {
  const {
    library,
    nowPlaying,
    setShowPlayer,
    setIsPlaying,
    favorites,
    setFavoriteSong,
    removeFavorite,
    setNowPlaying,
    setCreationTrack,
    setRevealCreation,
    removeFromUserPlaylist,
    setFollowing,
    removeFollowing,
    isShuffling,
    setIsShuffling,
  } = useBoundStore();
  const wavesurfer = useRef<WaveSurfer | null>(null);
  // const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  let songIndex = nowPlaying.queue.songs?.findIndex(
    (song: TrackDetails) => song.id === nowPlaying.track?.id,
  ); //current index of song in queue
  const [isReady, setIsReady] = useState(false);
  const playlist = library.userPlaylists.find((obj) => {
    return obj.songs.find((song) => {
      return song.id === nowPlaying.track?.id;
    });
  });

  const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");

  function removeFromPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    playlistid: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    removeFromUserPlaylist(playlistid, nowPlaying.track?.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SongArtist = ({ artist }: any) => {
    function followArtist(
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      artist: ArtistType,
    ) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => setFollowing(artist), 300);
    }

    return (
      <li className="mb-1 flex h-[50px] w-full flex-shrink-0 items-center justify-between bg-transparent">
        <div className="flex h-full w-[80%] items-center justify-center">
          <img
            src={artist.image ? artist.image[0]?.link : artistfallback}
            onError={(e) => (e.currentTarget.src = artistfallback)}
            alt="artist-img"
            className="h-[50px] w-[50px] rounded-md"
          />
          <h2 className="mx-4 line-clamp-1 w-[270px] overflow-hidden text-ellipsis text-sm">
            {artist.name}
          </h2>
        </div>
        {library.followings.some((following) => following.id === artist.id) ? (
          <button
            type="button"
            style={{
              outline: "none",
              border: "none",
            }}
            onClick={() => removeFollowing(artist.id)}
            className={`ease w-auto rounded-lg bg-transparent p-1 px-3 text-center text-xs font-semibold text-white transition-all ease-in-out sm:mx-0 sm:mt-1.5
                `}
          >
            Following
          </button>
        ) : (
          <button
            type="button"
            style={{
              outline: "none",
              border: "none",
            }}
            onClick={(e) => followArtist(e, artist)}
            className={`ease w-auto rounded-lg bg-white p-1 px-3 text-center text-xs font-semibold text-black transition-all ease-in-out sm:mx-0
                sm:mt-1.5`}
          >
            Follow{" "}
          </button>
        )}
      </li>
    );
  };

  function handlePlay(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    wavesurfer.current?.play();
    setIsPlaying(true);
  }
  function handlePause(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    wavesurfer.current?.pause();
    setIsPlaying(false);
  }

  function revealTrackMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setCreationTrack(nowPlaying.track);
    setRevealCreation(true);
  }

  async function getArtistDetails(id: string) {
    const res = await fetch(`https://saavn.me/artists?id=${id}`);
    const artistInfo = await res.json();
    setArtists((prev) => {
      return [...prev, artistInfo.data];
    });
  }

  useEffect(() => {
    switch (true) {
      case wavesurfer.current?.isPlaying() === false &&
        nowPlaying.isPlaying === true:
        wavesurfer.current.play();
        break;
      case wavesurfer.current?.isPlaying() === true &&
        nowPlaying.isPlaying === false:
        wavesurfer.current.pause();
        break;
    }
  }, [nowPlaying.isPlaying]);

  function playOrder() {
    if (isShuffling === false) {
      setIsPlaying(true);
      songIndex && setNowPlaying(nowPlaying.queue.songs[songIndex + 1]);
    } else {
      const randomIndex = Math.floor(
        Math.random() * nowPlaying.queue.songs.length,
      );
      setNowPlaying(nowPlaying.queue.songs[randomIndex]);
    }
  }

  useEffect(() => {
    if (innerWidth < 640) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      songIndex = nowPlaying.queue.songs?.findIndex(
        (song: TrackDetails) => song.id === nowPlaying.track?.id,
      );
      setArtists([]);
      nowPlaying.track?.primaryArtistsId
        .split(",")
        .forEach((id: string) => getArtistDetails(id.trim()));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      wavesurfer.current = WaveSurfer.create({
        container: "#mobileWave",
        autoplay: true,
        autoScroll: true,
        backend: "WebAudio",
        dragToSeek: true,
        hideScrollbar: true,
        mediaControls: true,
        waveColor: "#333",
        progressColor: "#10B981",
        fillParent: true,
        barGap: 2,
        barWidth: 3,
        minPxPerSec: 3,
        normalize: true,
        height: 50,
        barRadius: 10,
      });
      wavesurfer.current?.load(nowPlaying.track?.downloadUrl[4].link);
      wavesurfer.current?.seekTo(0);
    }
    wavesurfer.current?.on("seeking", () => {
      wavesurfer.current &&
        setCurrentTime(wavesurfer.current?.getCurrentTime());
    });
    wavesurfer.current?.on("timeupdate", () => {
      wavesurfer.current &&
        setCurrentTime(wavesurfer.current?.getCurrentTime());
    });
    wavesurfer.current?.on("finish", () => {
      setIsPlaying(false);
      if (!songIndex) {
        setShowPlayer(false);
      } else {
        playOrder();
      }
    });
    wavesurfer.current?.on("redraw", () => {
      setIsReady(false);
    });
    wavesurfer.current?.on("ready", () => {
      setIsReady(true);
      setIsPlaying(true);
    });
    return () => {
      wavesurfer.current?.destroy();
      wavesurfer.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPlaying.track?.id]);

  return (
    <div
      className={`fixed left-0 z-10 flex h-full w-full flex-col items-start justify-start overflow-x-hidden overflow-y-scroll bg-black transition-all ease-in-out ${
        nowPlaying.isMobilePlayer ? "translate-y-0" : "translate-y-full"
      } sm:hidden`}
    >
      <button
        type="button"
        style={{
          border: "none",
          outline: "none",
        }}
        onClick={() => setShowPlayer(false)}
        className="absolute right-2 top-2 rounded-full bg-black p-1"
      >
        <img src={down} alt="down" className="h-[28px] w-[28px]" />
      </button>
      <img
        src={nowPlaying.track ? nowPlaying.track?.image[2]?.link : songfallback}
        onError={(e) => (e.currentTarget.src = songfallback)}
        alt="image"
        className="mx-auto h-[500px] w-[500px] rounded-xl rounded-t-lg bg-fixed"
      />
      <div className="flex h-auto w-full flex-col items-center justify-start invert-0">
        <div className="flex h-auto w-full justify-between">
          <div className="line-clamp-3 flex h-auto w-[75%] flex-col items-start text-ellipsis p-3 px-4">
            <h2 className="text-xl font-semibold text-white">
              {nowPlaying.track?.name}
            </h2>
            <p className="text-md line-clamp-1 w-full overflow-hidden whitespace-nowrap text-neutral-500">
              {nowPlaying.track?.primaryArtists}
            </p>
          </div>
          <div className="flex h-14 w-[20%] items-center justify-evenly">
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              onClick={(e) => revealTrackMenu(e)}
              className={`-ml-3 border-none bg-transparent p-0 outline-none ${
                !playlist ? "block" : "hidden"
              }`}
            >
              <img
                src={add}
                alt="add"
                className="mb-0.5 h-[25px] w-[25px] bg-transparent"
              />
            </button>
            {playlist?.id && (
              <button
                style={{
                  border: "none",
                  outline: "none",
                }}
                type="button"
                onClick={(e) => playlist && removeFromPlaylist(e, playlist?.id)}
                className="-ml-3 border bg-transparent p-0 opacity-100"
              >
                <img src={tick} alt="tick" className="h-[28px] w-[28px]" />
              </button>
            )}
            {favorites.songs?.some(
              (song) => song.id === nowPlaying.track?.id,
            ) ? (
              <button
                type="button"
                onClick={() => removeFavorite(nowPlaying.track?.id)}
                style={{
                  border: "none",
                  outline: "none",
                }}
                className="mx-3 border-none bg-transparent p-0 outline-none"
              >
                <img
                  src={favorited}
                  alt="favorite"
                  className="h-[30px] w-[30px] bg-transparent"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFavoriteSong(nowPlaying.track)}
                style={{
                  border: "none",
                  outline: "none",
                }}
                className="mx-3 border-none bg-transparent p-0 outline-none"
              >
                <img
                  src={favorite}
                  alt="favorite"
                  className="h-[30px] w-[30px] bg-transparent"
                />
              </button>
            )}
          </div>
        </div>
        {/*Progress */}
        <div className="mb-6 flex h-16 w-[90%] items-center justify-between lg:w-[500px] xl:w-[700px]">
          <p className="mr-2 h-full w-[10%] pt-9 text-[12px] text-white">
            {currentTime ? formatTime(currentTime) : "0:00"}
          </p>
          {/*Waveform*/}
          <div className="-mb-4 flex h-full w-[80%] items-center justify-center overflow-hidden pt-4 lg:w-[90%]">
            <div id="mobileWave" className="-mt-3 h-full w-full" />
          </div>
          <p className="h-full w-[10%] pl-2 pt-9 text-[12px] text-white">
            {nowPlaying.track?.duration
              ? secondsToHMS(Number(nowPlaying.track?.duration))
              : ""}
          </p>
        </div>
      </div>
      <div className="mx-auto flex w-[85%] items-center justify-around py-4 transition-all ease-out">
        {isShuffling ? (
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
            onClick={(e) => {
              e.stopPropagation();
              setIsShuffling(false);
            }}
            disabled={nowPlaying.queue.songs.length === 0}
          >
            <img
              src={shuffling}
              alt="shuffling"
              className="h-[25px] w-[25px] bg-transparent"
            />
          </button>
        ) : (
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
            onClick={(e) => {
              e.stopPropagation();
              setIsShuffling(true);
            }}
            disabled={nowPlaying.queue.songs.length === 0}
          >
            <img
              src={shuffle}
              alt="shuffle"
              className="h-[25px] w-[25px] bg-transparent"
            />
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            songIndex === 0
              ? setNowPlaying(nowPlaying.queue.songs[0])
              : setNowPlaying(nowPlaying.queue.songs[songIndex - 1])
          }
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
          style={{
            border: "none",
            outline: "none",
          }}
          disabled={nowPlaying.queue.songs.length === 0 || isReady === false}
        >
          <img
            src={previous}
            alt="previous"
            className="h-[35px] w-[35px] bg-transparent"
          />
        </button>
        <div>
          {nowPlaying.isPlaying === true ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePause(e);
              }}
              style={{
                border: "none",
                outline: "none",
              }}
              className={`h-auto w-auto rounded-full border-none bg-neutral-100 p-2.5 outline-none transition-all ease-in disabled:cursor-not-allowed disabled:bg-neutral-600`}
              disabled={isReady === false}
            >
              <img
                src={pause}
                alt="pause"
                className={`h-[28px] w-[28px] ${
                  nowPlaying.isPlaying ? "pl-0" : "pl-0.5"
                }`}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay(e);
              }}
              style={{
                border: "none",
                outline: "none",
              }}
              className={`h-auto w-auto rounded-full border-none bg-neutral-100 p-2.5 outline-none transition-all ease-in disabled:cursor-not-allowed disabled:bg-neutral-600`}
              disabled={isReady === false}
            >
              <img
                src={play}
                alt="play"
                className={`h-[28px] w-[28px] ${
                  nowPlaying.isPlaying ? "pl-0" : "pl-0.5"
                }`}
              />
            </button>
          )}
        </div>
        <button
          type="button"
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
          style={{
            border: "none",
            outline: "none",
          }}
          onClick={() =>
            songIndex === nowPlaying.queue.songs.length - 1
              ? setNowPlaying(nowPlaying.queue.songs[0])
              : setNowPlaying(nowPlaying.queue.songs[songIndex + 1])
          }
          disabled={nowPlaying.queue.songs.length === 0 || isReady === false}
        >
          <img
            src={next}
            alt="next"
            className="h-[35px] w-[35px] bg-transparent"
          />
        </button>
        <button
          type="button"
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
          style={{
            border: "none",
            outline: "none",
          }}
          disabled={true}
        >
          <img
            src={replay}
            alt="replay"
            className="h-[28px] w-[28px] bg-transparent"
          />
        </button>
      </div>
      <div className="mx-auto mt-6 w-[90%]">
        <h2 className="mb-2 text-lg font-semibold">Primary artists</h2>
        <ul className="mx-auto flex h-auto w-full flex-shrink-0 flex-col items-start justify-center rounded-xl bg-neutral-950 px-4 py-2">
          {artists?.map((artist: ArtistType) => (
            <SongArtist key={artist.id} artist={artist} />
          ))}
        </ul>
      </div>
    </div>
  );
}
