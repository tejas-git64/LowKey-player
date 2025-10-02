import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanString } from "./cleanString";
import { getTrackImage } from "./getTrackImage";
import { saveToLocalStorage } from "./saveToLocalStorage";
import { animateScreen } from "./animateScreen";
import handleCollectionPlayback from "./handleCollectionPlayback";
import { samplePlaylist, sampleTrack } from "../api/samples";
import { useBoundStore } from "../store/store";
import { toggleFavorite } from "./toggleFavorite";
import React from "react";
import { act, waitFor } from "@testing-library/react";
import secondsToHMS from "./secondsToHMS";

const initialState = useBoundStore.getState();

afterEach(() => {
  useBoundStore.setState(initialState, true);
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("getTrackImage", () => {
  test("Should resolve images", () => {
    const fallback = "/src/assets/fallbacks/song-fallback.webp";
    const images = [
      {
        url: "https://c.saavncdn.com/795/Pardesiya-From-Param-Sundari-Hindi-2025-20250729184535-50x50.jpg",
        quality: "50x50",
      },
      {
        url: "https://c.saavncdn.com/795/Pardesiya-From-Param-Sundari-Hindi-2025-20250729184535-50x50.jpg",
        quality: "150x150",
      },
      {
        url: "https://c.saavncdn.com/795/Pardesiya-From-Param-Sundari-Hindi-2025-20250729184535-50x50.jpg",
        quality: "500x500",
      },
    ];
    expect(getTrackImage(images, true)).toBe(images[2].url);
    expect(getTrackImage(images.slice(0, 1), false)).toBe(images[0].url);

    expect(getTrackImage(undefined, true)).toBe(fallback);
    expect(getTrackImage([], true)).toBe(fallback);
    expect(getTrackImage([], false)).toBe(fallback);
  });
});

describe("cleanString", () => {
  test("Should sanitize strings", () => {
    const str = "Song title (From &quot;random artist)";
    expect(cleanString(str)).toBe("Song title (From random artist)");
  });
});

describe("saveToLocalStorage", () => {
  const storageKey = "testKey";
  let getItemSpy: unknown | any;
  let setItemSpy: unknown | any;
  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    setItemSpy = vi.spyOn(Storage.prototype, "setItem");
  });

  // Restore the original methods after EACH test
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
  });

  test("Should merge updates with existing data", () => {
    const updates = { b: 3, c: 4 };
    const expected = { a: 1, b: 3, c: 4 };

    localStorage.setItem(storageKey, JSON.stringify({ a: 1, b: 2 }));
    act(() => {
      saveToLocalStorage(storageKey, updates);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(expected),
    );

    expect(getItemSpy).toHaveBeenCalledWith(storageKey);
    expect(JSON.parse(localStorage.getItem(storageKey) || "{}")).toEqual(
      expected,
    );
  });

  test("Should set updates directly if JSON.parse throws an error", () => {
    const updates = { x: 5 };

    localStorage.setItem(storageKey, "invalid JSON");
    act(() => {
      saveToLocalStorage(storageKey, updates);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(updates),
    );

    expect(JSON.parse(localStorage.getItem(storageKey) || "{}")).toEqual(
      updates,
    );
  });

  test("Should set updates if no previous data exists", () => {
    const updates = { key: "value" };
    act(() => {
      saveToLocalStorage(storageKey, updates);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(updates),
    );
    expect(JSON.parse(localStorage.getItem(storageKey) || "{}")).toEqual(
      updates,
    );
  });
});

test("animateScreen should animate screens", () => {
  const ref = {
    current: null as HTMLDivElement | null,
  };
  const div = document.createElement("div");
  div.classList.add("home-fadeout");
  vi.useFakeTimers();

  ref.current = div;
  animateScreen(ref);

  expect(ref.current?.classList).toContain("home-fadeout");
  expect(ref.current?.classList).not.toContain("home-fadein");

  vi.runAllTimers();

  expect(ref.current?.classList).not.toContain("home-fadeout");
  expect(ref.current?.classList).toContain("home-fadein");

  vi.useRealTimers();
});

describe("handleCollectionPlayback", () => {
  const setQueue = useBoundStore.getState().setQueue;
  const setNowPlaying = useBoundStore.getState().setNowPlaying;
  const setIsPlaying = useBoundStore.getState().setIsPlaying;
  const startTransition = vi.fn((callback) => callback());
  const event = {
    stopPropagation: () => {},
  } as React.MouseEvent<HTMLButtonElement, MouseEvent>;

  test("playback does not toggles if the track is in queue", () => {
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
    act(() => {
      handleCollectionPlayback(
        event,
        samplePlaylist,
        startTransition,
        true,
        true,
        setQueue,
        setNowPlaying,
        setIsPlaying,
      );
    });
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
  });
  test("should set states with transitions", () => {
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
    act(() => {
      handleCollectionPlayback(
        event,
        samplePlaylist,
        startTransition,
        true,
        false,
        setQueue,
        setNowPlaying,
        setIsPlaying,
      );
    });
    expect(startTransition).toHaveBeenCalledWith(expect.any(Function));
  });
  describe("changes in playback upon queue change", () => {
    test("queue is updated on setting a new collection", () => {
      expect(useBoundStore.getState().nowPlaying.queue).toBeNull();
      act(() => {
        handleCollectionPlayback(
          event,
          samplePlaylist,
          startTransition,
          true,
          false,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        );
      });
      waitFor(() => {
        expect(useBoundStore.getState().nowPlaying.queue).toEqual({
          id: samplePlaylist.id,
          name: samplePlaylist.name,
          image: samplePlaylist.image,
          songs: samplePlaylist.songs,
        });
      });
    });
    test("queue is updated with missing images on setting a new collection", () => {
      expect(useBoundStore.getState().nowPlaying.queue).toBeNull();
      act(() => {
        handleCollectionPlayback(
          event,
          { ...samplePlaylist, image: false },
          startTransition,
          true,
          false,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        );
      });
      expect(useBoundStore.getState().nowPlaying.queue?.image).toBeFalsy();
    });
    test("current track is set to the first track from the collection", () => {
      act(() => {
        handleCollectionPlayback(
          event,
          samplePlaylist,
          startTransition,
          true,
          false,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        );
      });
      waitFor(() => {
        expect(useBoundStore.getState().nowPlaying.track).toMatchObject(
          samplePlaylist.songs[0],
        );
      });
    });
    test("playback continues but from the collection if already playing", () => {
      useBoundStore.getState().setIsPlaying(true);
      act(() => {
        handleCollectionPlayback(
          event,
          samplePlaylist,
          startTransition,
          true,
          false,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        );
      });
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    });
    test("playback pauses if a new collection is set", () => {
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(false);
      act(() => {
        handleCollectionPlayback(
          event,
          samplePlaylist,
          startTransition,
          false,
          false,
          setQueue,
          setNowPlaying,
          setIsPlaying,
        );
      });
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    });
  });
});

describe("toggleFavorite", () => {
  test("calls startTransition and setFavoriteSong when not favorited", () => {
    const e = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    const setFavoriteSong = useBoundStore.getState().setFavoriteSong;
    const startTransition = vi.fn((cb) => cb());
    const removeFavorite = useBoundStore.getState().removeFavorite;
    act(() => {
      toggleFavorite({
        e,
        track: sampleTrack,
        isFavorited: false,
        setFavoriteSong,
        removeFavorite,
        startTransition,
      });
    });

    expect(e.stopPropagation).toHaveBeenCalled();
    expect(startTransition).toHaveBeenCalled();
    expect(useBoundStore.getState().favorites.songs).toContainEqual(
      sampleTrack,
    );
  });

  test("calls removeFavorite when already favorited", () => {
    const e = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    const setFavoriteSong = useBoundStore.getState().setFavoriteSong;
    const startTransition = vi.fn((cb) => cb());
    const removeFavorite = useBoundStore.getState().removeFavorite;
    act(() => {
      toggleFavorite({
        e,
        track: sampleTrack,
        isFavorited: true,
        setFavoriteSong,
        removeFavorite,
        startTransition,
      });
    });

    expect(e.stopPropagation).toHaveBeenCalled();
    expect(startTransition).not.toHaveBeenCalled();
    expect(useBoundStore.getState().favorites.songs).not.toContainEqual(
      sampleTrack,
    );
  });
});

describe("secondsToHMS", () => {
  test("returns only seconds when less than a minute", () => {
    expect(secondsToHMS(5)).toBe("00:05");
    expect(secondsToHMS(59)).toBe("00:59");
  });

  test("returns minutes and seconds", () => {
    expect(secondsToHMS(60)).toBe("01:00");
    expect(secondsToHMS(125)).toBe("02:05");
    expect(secondsToHMS(3599)).toBe("59:59");
  });

  test("returns hours, minutes, and seconds", () => {
    expect(secondsToHMS(3600)).toBe("01:00:00");
    expect(secondsToHMS(3661)).toBe("01:01:01");
    expect(secondsToHMS(3725)).toBe("01:02:05");
  });

  test("pads hours to two digits if less than 10", () => {
    expect(secondsToHMS(36999)).toBe("10:16:39"); // 10 hours, 16 min, 39 sec
  });

  test("returns correct format for zero seconds", () => {
    expect(secondsToHMS(0)).toBe("00:00");
  });
});
