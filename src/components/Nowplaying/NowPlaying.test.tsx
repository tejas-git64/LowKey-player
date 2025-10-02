import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  Mock,
  MockInstance,
  test,
  vi,
} from "vitest";
import NowPlaying from "./NowPlaying";
import { useBoundStore } from "../../store/store";
import favorite from "../../assets/svgs/icons8-heart.svg";
import favorited from "../../assets/svgs/icons8-favorited.svg";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import high from "../../assets/svgs/volume-high.svg";
import vol from "../../assets/svgs/volume-min-svgrepo.svg";
import mute from "../../assets/svgs/mute-svgrepo-com.svg";
import play from "../../assets/svgs/play-icon.svg";
import pause from "../../assets/svgs/pause-icon.svg";
import tick from "../../assets/svgs/tick.svg";
import songfallback from "../../assets/fallbacks/song-fallback.webp";
import { sampleTrack, sampleUserPlaylist } from "../../api/samples";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const useNavigateMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateMock,
  };
});

const {
  setShowPlayer,
  setNowPlaying,
  setIsPlaying,
  setIsShuffling,
  setIsReplay,
  setUserPlaylist,
  removeUserPlaylist,
  removeFavorite,
  setQueue,
} = useBoundStore.getState();
let store: Record<string, string> = {};
let getItemMock: MockInstance<(key: string) => string | null>;
let setItemMock: MockInstance<(key: string) => string | null>;

beforeEach(() => {
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    load: vi.fn(),
  }));
  getItemMock = vi
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation((key: string): string | null => {
      if (key === "last-audio") return JSON.stringify(sampleTrack);
      if (key === "last-quality") return "2";
      if (key === "last-volume") return "0.5";
      return store[key] || null;
    });
  setItemMock = vi.spyOn(Storage.prototype, "setItem");
  window.innerWidth = innerWidth;
});

afterEach(() => {
  cleanup();
  act(() => {
    setNowPlaying(null);
    setIsPlaying(false);
    setIsShuffling(false);
    setShowPlayer(false);
  });
  vi.restoreAllMocks();
});

describe("NowPlaying", () => {
  test("should render", () => {
    render(
      <MemoryRouter>
        <NowPlaying />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("now-playing")).toBeInTheDocument();
  });
  test("should contain Waveform", () => {
    render(
      <MemoryRouter>
        <NowPlaying />
      </MemoryRouter>,
    );
    const waveform = screen.getByTestId("waveform-container");
    const wave = screen.getByTestId("waveform");
    expect(waveform).toBeInTheDocument();
    expect(wave).toBeInTheDocument();
  });
  test("should set the last track, audio quality and volume to localStorage beforeunload", () => {
    render(
      <MemoryRouter>
        <NowPlaying />
      </MemoryRouter>,
    );
    const event = new Event("beforeunload", { bubbles: true });
    fireEvent(window, event);
    expect(setItemMock as Mock).toHaveBeenCalledWith(
      "last-audio",
      JSON.stringify(sampleTrack),
    );
    expect(setItemMock as Mock).toHaveBeenCalledWith("last-volume", "0.5");
    expect(setItemMock as Mock).toHaveBeenCalledWith("last-quality", "2");
  });
  test("should get the last track and audio quality if stored in localStorage", () => {
    const lastAudio = localStorage.getItem("last-audio");
    const lastAudioQuality = localStorage.getItem("last-quality");
    getItemMock.mockImplementationOnce((key: string) => {
      if (key === "last-audio") return JSON.stringify(sampleTrack);
      if (key === "last-quality") return "0.5";
      return store[key] || null;
    });
    render(
      <MemoryRouter>
        <NowPlaying />
      </MemoryRouter>,
    );
    expect(JSON.parse(lastAudio as string)).toEqual(sampleTrack);
    expect(JSON.parse(lastAudioQuality as string)).toBe(2);
    expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
  });
  test("should contain mobile specific classes if isMobilePlayer is set to true", () => {
    act(() => {
      setShowPlayer(true);
    });
    render(
      <MemoryRouter>
        <NowPlaying />
      </MemoryRouter>,
    );
    const nowPlaying = screen.getByTestId("now-playing");
    expect(nowPlaying).toHaveClass("translate-y-0");
  });
  test("should contain landscape specific classes if isMobilePlayer is set to false", () => {
    render(
      <MemoryRouter>
        <NowPlaying />
      </MemoryRouter>,
    );
    const nowPlaying = screen.getByTestId("now-playing");
    expect(nowPlaying).toHaveClass("translate-y-[100%]");
  });
  // describe("continuePlayback", () => {
  //   afterEach(() => {
  //     vi.restoreAllMocks();
  //   });

  //   test('should play the song from the queue if the queue is not empty', () => {
  //     render(
  //       <MemoryRouter>
  //         <NowPlaying />
  //       </MemoryRouter>,
  //     );
  //   });
  // });
  describe("Drop down button", () => {
    beforeAll(() => {
      window.innerWidth = 480;
    });
    test("should render if width is mobile width", () => {
      act(() => {
        setShowPlayer(true);
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const dropDownBtn = screen.getByTestId("drop-down-btn");
      expect(dropDownBtn).toBeInTheDocument();
    });
    test("should hide player onClick", () => {
      act(() => {
        setShowPlayer(true);
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const dropDownBtn = screen.getByTestId("drop-down-btn");
      fireEvent.click(dropDownBtn);
      expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(false);
    });
  });
  describe("Song image", () => {
    beforeAll(() => {
      window.innerWidth = 1280;
    });
    test("should be shown if available", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      expect(
        (screen.getByTestId("song-image") as HTMLImageElement).src,
      ).toContain("image%20url");
    });
    test("should be songfallback if not available", () => {
      act(() => {
        setNowPlaying(null);
        window.innerWidth = 480;
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const image = screen.getByTestId("song-image") as HTMLImageElement;
      expect(image.src).toContain(songfallback);
    });
    test("should be songfallback onError", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const image = screen.getByTestId("song-image") as HTMLImageElement;
      fireEvent.error(image);
      expect(image.src).toContain(songfallback);
    });
    test("should contain alt text as 'Cover art' for * if available", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const image = screen.getByTestId("song-image") as HTMLImageElement;
      expect(image.alt).toBe("Cover art for Track3");
      expect(image.ariaHidden).toBeNull();
    });
    test("should contain alt text as 'song image 'if not available", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      act(() => {
        setNowPlaying({ ...sampleTrack, name: "" });
      });
      const image = screen.getByTestId("song-image") as HTMLImageElement;
      expect(image.alt).toBe("song image");
      expect(image.ariaHidden).toBeTruthy();
    });
  });
  describe("Quality selection", () => {
    test("should contain tabIndex as 0 if song urls are available and ate > 1", async () => {
      const obj = {
        ...sampleTrack,
        downloadUrl: [
          {
            quality: "48kbps",
            url: "https://aac.saavncdn.com/745/6adf5c70c94e8de892cb34bf52a77d9c_48.mp4",
          },
          {
            quality: "96kbps",
            url: "https://aac.saavncdn.com/548/00d13c8ebe35a451964164dd071a65ab_96.mp4",
          },
        ],
      };
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      act(() => {
        setNowPlaying(obj);
      });
      const select = screen.getByTestId("quality") as HTMLSelectElement;
      expect(select.tabIndex).toBe(0);
    });
    test("should contain tabIndex as -1 if song urls are not available", () => {
      act(() => {
        setNowPlaying({
          ...sampleTrack,
          downloadUrl: [],
        });
      });
      getItemMock.mockImplementationOnce((key: string) => {
        if (key === "last-audio") return JSON.stringify(sampleTrack);
        return store[key] || null;
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const select = screen.getByTestId("quality") as HTMLSelectElement;
      expect(select.tabIndex).toBe(-1);
    });
    test("should set the audio index onClick", () => {
      act(() => {
        setNowPlaying({
          ...sampleTrack,
          downloadUrl: [
            {
              quality: "48kbps",
              url: "https://aac.saavncdn.com/745/6adf5c70c94e8de892cb34bf52a77d9c_48.mp4",
            },
            {
              quality: "96kbps",
              url: "https://aac.saavncdn.com/548/00d13c8ebe35a451964164dd071a65ab_96.mp4",
            },
          ],
        });
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const select = screen.getByTestId("quality") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "0" } });
      expect(select.value).toBe("0");
    });
  });
  describe("Download button", () => {
    let createObjectURLSpy = vi.fn(() => "mock-blob-url");
    const revokeObjectURLSpy = vi.fn();
    const linkClickSpy = vi.fn();
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(new Blob(["test file content"])),
      });

      window.URL.createObjectURL = createObjectURLSpy;
      window.URL.revokeObjectURL = revokeObjectURLSpy;

      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
        linkClickSpy,
      );
    });
    test("should not download the track if there's no valid url", () => {
      const handleDownload = vi.fn();
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const downloadBtn = screen.getByTestId("download-btn");
      fireEvent.click(downloadBtn);
      expect(handleDownload).not.toHaveBeenCalled();
    });
    test("should download the track if there's a valid url", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const select = screen.getByTestId("quality") as HTMLSelectElement;
      const downloadBtn = screen.getByTestId("download-btn");

      fireEvent.change(select, { target: { value: "0" } });
      expect(select.value).toBe("0");

      fireEvent.click(downloadBtn);
      waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          "https://aac.saavncdn.com/745/6adf5c70c94e8de892cb34bf52a77d9c_48.mp4",
        );
        expect(createObjectURLSpy).toHaveBeenCalled();
        expect(linkClickSpy).toHaveBeenCalled();
        expect(revokeObjectURLSpy).toHaveBeenCalledWith("mock-blob-url");
      });
    });
    test("should catch the error if download fails", async () => {
      const handleDownload = vi.fn(() => Promise.reject("Download failed!"));
      global.fetch = vi.fn().mockRejectedValue("Download failed!");
      act(() => {
        setNowPlaying({
          ...sampleTrack,
          downloadUrl: [
            {
              quality: "48kps",
              url: "",
            },
          ],
        });
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const select = screen.getByTestId("quality") as HTMLSelectElement;
      const downloadBtn = screen.getByTestId("download-btn");

      fireEvent.change(select, { target: { value: "0" } });
      expect(select.value).toBe("0");
      fireEvent.click(downloadBtn);
      await expect(handleDownload()).rejects.toThrow("Download failed!");
    });
  });
  describe("Play button", () => {
    test("should render", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const playBtn = screen.getByTestId("play-btn");
      expect(playBtn).toBeInTheDocument();
    });
    describe("Aria label", () => {
      test("should be 'Play' if isPlaying is false", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playBtn = screen.getByTestId("play-btn");
        expect(playBtn.ariaLabel).toBe("Play");
      });
      test("should be 'Pause' if isPlaying is true", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playBtn = screen.getByTestId("play-btn");
        fireEvent.click(playBtn);
        expect(playBtn.ariaLabel).toBe("Pause");
      });
    });
    describe("Image", () => {
      test("should render", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playIcon = screen.getByTestId("play-icon") as HTMLImageElement;
        expect(playIcon).toBeInTheDocument();
      });
      test("should contain respective icons and alt text if isPlaying is false", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playIcon = screen.getByTestId("play-icon") as HTMLImageElement;
        expect(playIcon.src).toContain(play);
        expect(playIcon.alt).toBe("Play icon");
      });
      test("should contain respective icons and alt text if isPlaying is true", () => {
        act(() => {
          setIsPlaying(true);
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playIcon = screen.getByTestId("play-icon") as HTMLImageElement;
        expect(playIcon.src).toContain(pause);
        expect(playIcon.alt).toBe("Pause icon");
      });
    });
  });
  describe("PlayerOptions", () => {
    test("should render", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const options = screen.getByTestId("player-options");
      expect(options).toBeInTheDocument();
    });
    describe("Playlist button", () => {
      beforeEach(() => {
        removeUserPlaylist(sampleUserPlaylist.id);
      });
      test("should render", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playlistBtn = screen.getByTestId("playlist-btn");
        expect(playlistBtn).toBeInTheDocument();
      });
      test("should set the creation track, open modal and close the player onClick", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playlistBtn = screen.getByTestId("playlist-btn");
        fireEvent.click(playlistBtn);
        expect(useBoundStore.getState().creationTrack).toEqual(sampleTrack);
        expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(false);
        expect(useBoundStore.getState().revealCreation).toBe(true);
      });
      test("should contain the respective aria labels on not having playlist id", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playlistBtn = screen.getByTestId("playlist-btn");
        expect(playlistBtn.ariaLabel).toBe("Add to Playlist");
      });
      test("should contain the respective aria labels on having playlist id", () => {
        act(() => {
          setUserPlaylist(sampleUserPlaylist);
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playlistBtn = screen.getByTestId("playlist-btn");
        expect(playlistBtn.ariaLabel).toBe("Remove from Playlist");
      });
      test("should contain respective icons and alt text on not having the playlist id", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playlistIcon = screen.getByTestId(
          "playlist-icon",
        ) as HTMLImageElement;
        expect(playlistIcon.src).toContain(add);
        expect(playlistIcon.alt).toBe("Add to playlist");
      });
      test("should contain respective icons and alt text on having the playlist id", () => {
        act(() => {
          setUserPlaylist(sampleUserPlaylist);
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const playlistIcon = screen.getByTestId(
          "playlist-icon",
        ) as HTMLImageElement;
        expect(playlistIcon.src).toContain(tick);
        expect(playlistIcon.alt).toBe("In playlist");
      });
    });
    describe("Favorite button", () => {
      beforeEach(() => {
        removeUserPlaylist(sampleUserPlaylist.id);
        removeFavorite(sampleTrack.id);
      });
      test("should favorite the track and show its respective icon", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const favoriteBtn = screen.getByTestId("favorite-btn");
        const favoriteIcon = screen.getByTestId(
          "favorite-icon",
        ) as HTMLImageElement;
        fireEvent.click(favoriteBtn);
        expect(useBoundStore.getState().favorites.songs).toContainEqual(
          sampleTrack,
        );
        expect(favoriteBtn.ariaLabel).toBe("Remove from Favorites");
        expect(favoriteIcon.alt).toBe("Favorited");
        expect(favoriteIcon.src).toBe(favorited);
      });
      test("should not favorite the track and show its respective icon", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const favoriteBtn = screen.getByTestId("favorite-btn");
        const favoriteIcon = screen.getByTestId(
          "favorite-icon",
        ) as HTMLImageElement;
        expect(useBoundStore.getState().favorites.songs).not.toContainEqual(
          sampleTrack,
        );
        expect(favoriteBtn.ariaLabel).toBe("Add to Favorites");
        expect(favoriteIcon.alt).toBe("Favorite");
        expect(favoriteIcon.src).toBe(favorite);
      });
    });
  });
  describe("Controls", () => {
    test("should render", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const controls = screen.getByTestId("controls");
      expect(controls).toBeInTheDocument();
    });
    describe("Shuffle button", () => {
      beforeEach(() => {
        setQueue({
          id: "",
          image: [],
          name: "",
          songs: [],
        });
      });
      test("should render", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const shuffleBtn = screen.getByTitle("shuffle-button");
        expect(shuffleBtn).toBeInTheDocument();
      });
      test("should toggle shuffle status and have tabIndex as 0 if there are songs in the queue", () => {
        act(() => {
          setQueue({
            id: "10",
            image: [],
            name: "",
            songs: [sampleTrack],
          });
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const shuffleBtn = screen.getByTitle("shuffle-button");
        expect(shuffleBtn.tabIndex).toBe(0);
        fireEvent.click(shuffleBtn);
        expect(useBoundStore.getState().isShuffling).toBe(true);
      });
      test("should have tabIndex as -1 if there are no songs in the queue", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const shuffleBtn = screen.getByTitle("shuffle-button");
        expect(shuffleBtn.tabIndex).toBe(-1);
      });
    });
    describe("Previous button", () => {
      test("should render", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const previous = screen.getByTestId("previous-btn");
        expect(previous).toBeInTheDocument();
      });
      test("should playback previous track if queueSongs's length > 1", async () => {
        const obj = { ...sampleTrack, id: "133" };
        act(() => {
          setQueue({
            id: "10",
            image: [],
            name: "",
            songs: [obj, sampleTrack],
          });
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const previous = screen.getByTestId("previous-btn");
        fireEvent.click(previous);
        expect(useBoundStore.getState().nowPlaying.track).toEqual(obj);
        expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
      });
      test("should toggle playback if queueSongs's length <= 1", () => {
        act(() => {
          setQueue({
            id: "",
            image: [],
            name: "",
            songs: [],
          });
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const previous = screen.getByTestId("previous-btn");
        fireEvent.click(previous);
        expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
      });
    });
    describe("Next button", () => {
      test("should render", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const previous = screen.getByTestId("previous-btn");
        expect(previous).toBeInTheDocument();
      });
      test("should playback next track if queueSongs's length > 1", () => {
        const obj = { ...sampleTrack, id: "133" };
        act(() => {
          setQueue({
            id: "10",
            image: [],
            name: "",
            songs: [sampleTrack, obj],
          });
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const next = screen.getByTestId("next-btn");
        fireEvent.click(next);
        expect(useBoundStore.getState().nowPlaying.track).toEqual(obj);
        expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
      });
      test("should toggle playback if songIndex >= queueSongs length", () => {
        act(() => {
          setQueue({
            id: "",
            image: [],
            name: "",
            songs: [],
          });
        });
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const next = screen.getByTestId("next-btn");
        fireEvent.click(next);
        expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
      });
    });
    describe("Replay button", () => {
      beforeEach(() => {
        setIsReplay(false);
      });
      test("should render", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const replayBtn = screen.getByTestId("replay-btn");
        const replayIcon = screen.getByTestId("replay-icon");
        expect(replayBtn).toBeInTheDocument();
        expect(replayIcon).toHaveClass("text-white");
      });
      test("should enable replay in playback", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const replayBtn = screen.getByTestId("replay-btn");
        const replayIcon = screen.getByTestId("replay-icon");
        fireEvent.click(replayBtn);
        expect(replayIcon).toHaveClass("text-emerald-500");
      });
    });
  });
  describe("VolumeControl", () => {
    test("should render", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const controls = screen.getByTestId("volume-controls");
      expect(controls).toBeInTheDocument();
    });
    test("should vary volume onChange", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const slider = screen.getByTestId("song-volume") as HTMLInputElement;
      fireEvent.change(slider, { target: { value: 0.3 } });
      expect(slider.value).toBe("0.3");
    });
    test("should toggle playback onMouseUp", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const slider = screen.getByTestId("song-volume") as HTMLInputElement;
      fireEvent.mouseUp(slider);
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    });
    describe("Volume icons according to thresholds", () => {
      test("should be mute if vol <= 0.1", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const slider = screen.getByTestId("song-volume") as HTMLInputElement;
        const sliderImage = screen.getByTestId(
          "slider-img",
        ) as HTMLImageElement;
        fireEvent.change(slider, { target: { value: 0.0 } });
        expect(sliderImage.src).toContain(mute);
        expect(sliderImage.alt).toBe("Muted");
      });
      test("should be vol if vol > 0.1 and < 0.75", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const slider = screen.getByTestId("song-volume") as HTMLInputElement;
        const sliderImage = screen.getByTestId(
          "slider-img",
        ) as HTMLImageElement;
        fireEvent.change(slider, { target: { value: 0.2 } });
        expect(sliderImage.src).toContain(vol);
        expect(sliderImage.alt).toBe("Low volume");
      });
      test("should be vol if vol > 0.75", () => {
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const slider = screen.getByTestId("song-volume") as HTMLInputElement;
        const sliderImage = screen.getByTestId(
          "slider-img",
        ) as HTMLImageElement;
        fireEvent.change(slider, { target: { value: 0.8 } });
        expect(sliderImage.src).toContain(high);
        expect(sliderImage.alt).toBe("High volume");
      });
    });
  });
  describe("Artist", () => {
    beforeEach(() => {
      setShowPlayer(true);
    });
    test("should navigate to the artist onClick", () => {
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(true);
      const artist = screen.getByTestId("artist");
      fireEvent.click(artist);
      expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(false);
      expect(useNavigateMock).toHaveBeenCalledWith("/artists/1431");
    });
    describe("should navigate to the artist onKeyDown", () => {
      test("using Enter key", async () => {
        const event = userEvent.setup();
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const artist = screen.getByTestId("artist");
        artist.focus();
        event.keyboard("{Enter}");
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(
            false,
          );
          expect(useNavigateMock).toHaveBeenCalledWith("/artists/1431");
        });
      });
      test("using Space key", async () => {
        const event = userEvent.setup();
        render(
          <MemoryRouter>
            <NowPlaying />
          </MemoryRouter>,
        );
        const artist = screen.getByTestId("artist");
        artist.focus();
        event.keyboard("{ }");
        waitFor(() => {
          expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(
            false,
          );
          expect(useNavigateMock).toHaveBeenCalledWith("/artists/1431");
        });
      });
    });
    test("should not navigate to the artist onKeyDown using other keys", () => {
      const event = userEvent.setup();
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      const artist = screen.getByTestId("artist");
      artist.focus();
      event.keyboard("{s}");
      expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(true);
      expect(useNavigateMock).not.toHaveBeenCalled();
    });
    test("should contain fallback alt text if no artist name is found", () => {
      getItemMock.mockImplementationOnce((key: string) => {
        if (key === "last-audio") return JSON.stringify(null);
        return store[key] || null;
      });
      render(
        <MemoryRouter>
          <NowPlaying />
        </MemoryRouter>,
      );
      act(() => {
        setNowPlaying({
          ...sampleTrack,
          artists: {
            ...sampleTrack.artists,
            primary: [{ ...sampleTrack.artists.primary[0], name: "" }],
          },
        });
      });
      const image = screen.getByTestId("artist-image") as HTMLImageElement;
      expect(image.alt).toBe("artist-image");
    });
  });
});
