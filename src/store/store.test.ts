import { afterEach, describe, expect, test, vi } from "vitest";
import { useBoundStore } from "./store";
import {
  sampleAlbum,
  sampleArtistInSong,
  samplePlaylist,
  sampleSearchResults,
  sampleSongQueue,
  sampleTrack,
  sampleUserPlaylist,
} from "../api/samples";
import { act } from "@testing-library/react";

afterEach(() => {
  localStorage.clear();
});

async function importStoreWithStorage(
  storedValues: Record<string, unknown>,
) {
  localStorage.clear();
  for (const [key, value] of Object.entries(storedValues)) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  vi.resetModules();
  const freshStoreModule = await import("./store");
  return freshStoreModule.useBoundStore;
}

describe("Testing store localStorage hydration", () => {
  test("hydrates library data from localStorage", async () => {
    const freshStore = await importStoreWithStorage({
      "local-library": {
        albums: [sampleAlbum],
        followings: [sampleArtistInSong],
        playlists: [samplePlaylist],
        userPlaylists: [sampleUserPlaylist],
      },
    });

    expect(freshStore.getState().library.albums).toEqual([sampleAlbum]);
    expect(freshStore.getState().library.followings).toEqual([
      sampleArtistInSong,
    ]);
    expect(freshStore.getState().library.playlists).toEqual([samplePlaylist]);
    expect(freshStore.getState().library.userPlaylists).toEqual([
      sampleUserPlaylist,
    ]);
  });

  test("hydrates favorites data from localStorage", async () => {
    const freshStore = await importStoreWithStorage({
      "local-favorites": {
        songs: [sampleTrack],
        albums: [sampleAlbum],
        playlists: [samplePlaylist],
      },
    });

    expect(freshStore.getState().favorites.songs).toEqual([sampleTrack]);
    expect(freshStore.getState().favorites.albums).toEqual([sampleAlbum]);
    expect(freshStore.getState().favorites.playlists).toEqual([
      samplePlaylist,
    ]);
  });

  test("hydrates recents data from localStorage", async () => {
    const recentActivity = {
      id: "activity-id",
      message: "Added Track3 to a playlist",
    };
    const freshStore = await importStoreWithStorage({
      "last-recents": {
        history: [sampleTrack],
        activity: [recentActivity],
      },
    });

    expect(freshStore.getState().recents.history).toEqual([sampleTrack]);
    expect(freshStore.getState().recents.activity).toEqual([recentActivity]);
  });

  test("keeps recents history empty if stored history is null", async () => {
    const recentActivity = {
      id: "activity-id",
      message: "Added Track3 to a playlist",
    };
    const freshStore = await importStoreWithStorage({
      "last-recents": {
        history: null,
        activity: [recentActivity],
      },
    });

    expect(freshStore.getState().recents.history).toEqual([]);
    expect(freshStore.getState().recents.activity).toEqual([recentActivity]);
  });
});

describe("Testing greeting", () => {
  test("greeting variable should be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("greeting");
  });
  test("changeGreeting action should set new greeting", async () => {
    const str = "Hello!";
    act(() => {
      useBoundStore.getState().changeGreeting(str);
    });
    expect(useBoundStore.getState().greeting).toBe(str);
  });
});

describe("Testing recents", () => {
  test("recents variable should be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("recents");
    expect(useBoundStore.getState().recents).toHaveProperty("activity");
    expect(useBoundStore.getState().recents).toHaveProperty("history");
  });
  test("setHistory action should bring up new listening history", async () => {
    act(() => {
      useBoundStore.getState().setHistory(sampleTrack);
      useBoundStore.getState().setHistory({ ...sampleTrack, id: "kC25VqoDjc" });
      useBoundStore.getState().setHistory({ ...sampleTrack, id: "kC25VqoDjc" });
    });
    expect(useBoundStore.getState().recents.history[0].id).toBe("kC25VqoDjc");
  });
  test("setActivity action should bring up the recent activity", async () => {
    const activity = "Added new playlist HipHits";
    act(() => {
      useBoundStore.getState().setActivity(activity);
    });
    const obj = useBoundStore
      .getState()
      .recents.activity.find((a) => a.message === activity);
    if (obj !== undefined) expect(obj.message).toBe(activity);
  });
});

describe("Testing search", () => {
  test("search variable should be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("search");
  });

  test("topQuery variable should be present in search", async () => {
    expect(useBoundStore.getState().search).toHaveProperty("topQuery");
  });
  test("songs variable should be present in search", async () => {
    expect(useBoundStore.getState().search).toHaveProperty("songs");
  });
  test("albums variable should be present in search", async () => {
    expect(useBoundStore.getState().search).toHaveProperty("albums");
  });
  test("artists variable should be present in search", async () => {
    expect(useBoundStore.getState().search).toHaveProperty("artists");
  });
  test("playlists variable should be present in search", async () => {
    expect(useBoundStore.getState().search).toHaveProperty("playlists");
  });

  test("setSearch should set data based on query results", async () => {
    act(() => {
      useBoundStore.getState().setSearch(sampleSearchResults);
    });
    expect(useBoundStore.getState().search).toMatchObject(sampleSearchResults);
  });
});

describe("Testing nowPlaying", () => {
  test("nowPlaying variable should be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("nowPlaying");
  });

  describe("Testing track and its action", () => {
    test("track variable should be present in nowPlaying", async () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty("track");
    });
    test("setNowPlaying should set a new track", async () => {
      act(() => {
        useBoundStore.getState().setNowPlaying(sampleTrack);
      });
      expect(useBoundStore.getState().nowPlaying.track).toMatchObject(
        sampleTrack,
      );
    });
  });

  describe("Testing isPlaying and it's action", () => {
    test("isPlaying variable should be present in nowPlaying", async () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty("isPlaying");
    });
    test("setIsPlaying should set a new track", async () => {
      act(() => {
        useBoundStore.getState().setIsPlaying(true);
      });
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    });
  });

  describe("Testing isMobilePlayer and it's action", () => {
    test("isMobilePlayer variable should be present in nowPlaying", async () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty(
        "isMobilePlayer",
      );
    });
    test("setShowPlayer should toggle mobile view state", async () => {
      act(() => {
        useBoundStore.getState().setShowPlayer(true);
      });
      expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(true);
    });
  });

  test("isFavorite variable should be present in nowPlaying", async () => {
    expect(useBoundStore.getState().nowPlaying).toHaveProperty("isFavorite");
  });

  describe("Testing queue and it's action", () => {
    test("queue variable should be present in nowPlaying", async () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty("queue");
    });

    test("setQueue should set songs of a new playlist/album into the queue", async () => {
      act(() => {
        useBoundStore.getState().setQueue(sampleSongQueue);
      });
      expect(useBoundStore.getState().nowPlaying.queue).toMatchObject(
        sampleSongQueue,
      );
    });
  });
});

describe("Testing favorites", () => {
  test("favorites variable should be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("favorites");
  });

  describe("Testing favorite songs and it's action", () => {
    test("songs variable should be present in favorites", async () => {
      expect(useBoundStore.getState().favorites).toHaveProperty("songs");
    });

    test("setFavoriteSong must favorite a song if the same song id doesn't exist", async () => {
      act(() => {
        useBoundStore.getState().setFavoriteSong(sampleTrack);
      });
      expect(useBoundStore.getState().favorites.songs).toContainEqual(
        sampleTrack,
      );
      act(() => {
        useBoundStore.getState().setFavoriteSong(sampleTrack);
      });
      expect(useBoundStore.getState().favorites.songs).toContainEqual(
        sampleTrack,
      );
    });

    test("removeFavoriteSong unfavorites the same song", async () => {
      act(() => {
        useBoundStore.getState().removeFavorite(sampleTrack.id);
      });
      expect(useBoundStore.getState().favorites.songs).not.toContainEqual(
        sampleTrack,
      );
    });
  });

  describe("Testing favorite albums and it's action", () => {
    test("albums variable is present in favorites", async () => {
      expect(useBoundStore.getState().favorites).toHaveProperty("albums");
    });
    test("setFavoriteAlbum favorites a new album", async () => {
      act(() => {
        useBoundStore.getState().setFavoriteAlbum(sampleAlbum);
      });
      expect(useBoundStore.getState().favorites.albums).toContainEqual(
        sampleAlbum,
      );
      act(() => {
        useBoundStore.getState().setFavoriteAlbum(sampleAlbum);
      });
      expect(useBoundStore.getState().favorites.albums).toContainEqual(
        sampleAlbum,
      );
    });
    test("removeFavoriteAlbum unFavorites the same album", async () => {
      act(() => {
        useBoundStore.getState().removeFavoriteAlbum(sampleAlbum.id);
      });
      expect(useBoundStore.getState().favorites.albums).not.toContainEqual(
        sampleAlbum,
      );
    });
  });

  describe("Testing favorite playlists and it's action", () => {
    test("playlists variable is present in favorites", async () => {
      expect(useBoundStore.getState().favorites).toHaveProperty("playlists");
    });

    test("setFavoritePlaylist favorites a new playlist", async () => {
      act(() => {
        useBoundStore.getState().setFavoritePlaylist(samplePlaylist);
      });
      expect(useBoundStore.getState().favorites.playlists).toContainEqual(
        samplePlaylist,
      );
      act(() => {
        useBoundStore.getState().setFavoritePlaylist(samplePlaylist);
      });
      expect(useBoundStore.getState().favorites.playlists).toContainEqual(
        samplePlaylist,
      );
    });
    test("removeFavoritePlaylist unfavorites the same playlist", async () => {
      act(() => {
        useBoundStore.getState().removeFavoritePlaylist(samplePlaylist.id);
      });
      expect(useBoundStore.getState().favorites.playlists).not.toContainEqual(
        samplePlaylist,
      );
    });
  });
});

describe("Testing library", () => {
  describe("Testing followings and it's action", () => {
    test("followings variable is present in library", async () => {
      expect(useBoundStore.getState().library).toHaveProperty("followings");
    });
    test("setFollowing adds a new following", async () => {
      act(() => {
        useBoundStore.getState().setFollowing(sampleArtistInSong);
      });
      expect(useBoundStore.getState().library.followings).toContainEqual(
        sampleArtistInSong,
      );
      act(() => {
        useBoundStore.getState().setFollowing(sampleArtistInSong);
      });
      expect(useBoundStore.getState().library.followings).toContainEqual(
        sampleArtistInSong,
      );
    });
    test("removeFollowing removes the same following", async () => {
      act(() => {
        useBoundStore.getState().removeFollowing(sampleArtistInSong.id);
      });
      expect(useBoundStore.getState().library.followings).not.toContainEqual(
        sampleArtistInSong,
      );
    });
  });

  describe("Testing albums and it's action", () => {
    test("albums variable is present in library", async () => {
      expect(useBoundStore.getState().library).toHaveProperty("albums");
    });
    test("setLibraryAlbum adds a new album", async () => {
      act(() => {
        useBoundStore.getState().setLibraryAlbum(sampleAlbum);
      });
      expect(useBoundStore.getState().library.albums).toContainEqual(
        sampleAlbum,
      );
      act(() => {
        useBoundStore.getState().setLibraryAlbum(sampleAlbum);
      });
      expect(useBoundStore.getState().library.albums).toContainEqual(
        sampleAlbum,
      );
    });
    test("removeLibraryAlbum removes the same album", async () => {
      act(() => {
        useBoundStore.getState().removeLibraryAlbum(sampleAlbum.id);
      });
      expect(useBoundStore.getState().library.albums).not.toContainEqual(
        sampleAlbum,
      );
    });
  });

  describe("Testing playlists and it's action", () => {
    test("playlists variable is present in library", async () => {
      expect(useBoundStore.getState().library).toHaveProperty("playlists");
    });
    test("setLibraryPlaylist adds a new playlist", async () => {
      act(() => {
        useBoundStore.getState().setLibraryPlaylist(samplePlaylist);
      });
      expect(useBoundStore.getState().library.playlists).toContainEqual(
        samplePlaylist,
      );
      act(() => {
        useBoundStore.getState().setLibraryPlaylist(samplePlaylist);
      });
      expect(useBoundStore.getState().library.playlists).toContainEqual(
        samplePlaylist,
      );
    });
    test("removeLibraryPlaylist removes the same playlist", async () => {
      act(() => {
        useBoundStore.getState().removeLibraryPlaylist(samplePlaylist.id);
      });
      expect(useBoundStore.getState().library.playlists).not.toContainEqual(
        samplePlaylist,
      );
    });
  });

  describe("Testing userPlaylists and it's actions", () => {
    test("userPlaylists variable is present in library", async () => {
      expect(useBoundStore.getState().library).toHaveProperty("userPlaylists");
    });

    test("setUserPlaylist adds a custom playlist", async () => {
      act(() => {
        useBoundStore.getState().setUserPlaylist(sampleUserPlaylist);
      });
      expect(useBoundStore.getState().library.userPlaylists).toContainEqual(
        sampleUserPlaylist,
      );
      act(() => {
        useBoundStore.getState().setUserPlaylist(sampleUserPlaylist);
      });
      expect(useBoundStore.getState().library.userPlaylists).toContainEqual(
        sampleUserPlaylist,
      );
    });
    test("removeUserPlaylist removes the same playlist", async () => {
      act(() => {
        useBoundStore.getState().removeUserPlaylist(sampleUserPlaylist.id);
      });
      expect(useBoundStore.getState().library.userPlaylists).not.toContainEqual(
        sampleUserPlaylist,
      );
    });
    test("setToUserPlaylist adds a track to a custom playlist", async () => {
      act(() => {
        useBoundStore.getState().setUserPlaylist(sampleUserPlaylist);
      });

      const newTrack = { ...sampleTrack, id: "LxW02jq1" };

      act(() => {
        useBoundStore
          .getState()
          .setToUserPlaylist(newTrack, sampleUserPlaylist.id);
      });
      expect(
        useBoundStore.getState().library.userPlaylists[0].songs,
      ).toContainEqual(newTrack);

      const prevUserPlaylists = useBoundStore.getState().library.userPlaylists;
      act(() => {
        useBoundStore.getState().setToUserPlaylist(sampleTrack, 310212);
      });
      expect(useBoundStore.getState().library.userPlaylists).toMatchObject(
        prevUserPlaylists,
      );
    });
    test("removeFromUserPlaylist removes the same track from the same playlist", async () => {
      const customObj = { ...sampleUserPlaylist, id: 92424 };
      act(() => {
        useBoundStore.getState().setUserPlaylist(customObj);
      });
      expect(useBoundStore.getState().library.userPlaylists).toContainEqual(
        customObj,
      );

      act(() => {
        useBoundStore
          .getState()
          .removeFromUserPlaylist(sampleUserPlaylist.id, String(customObj.id));
      });
      expect(
        useBoundStore.getState().library.userPlaylists[0].songs,
      ).not.toContainEqual(customObj);
    });
    test("createNewUserPlaylist creates new custom playlist", async () => {
      act(() => {
        useBoundStore.getState().createNewUserPlaylist("Monday blues", 13);
      });
      expect(useBoundStore.getState().library.userPlaylists).toContainEqual({
        id: 13,
        name: "Monday blues",
        songs: [],
      });
    });
  });
});

describe("Testing shuffle", () => {
  test("isShuffling must be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("isShuffling");
  });
  test("setIsShuffling sets the shuffle status", async () => {
    act(() => {
      useBoundStore.getState().setIsShuffling(true);
    });
    expect(useBoundStore.getState().isShuffling).toBe(true);
  });
});

describe("Testing replay", () => {
  test("isReplay must be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("isReplay");
  });
  test("setIsReplay sets the replay status", async () => {
    act(() => {
      useBoundStore.getState().setIsReplay(true);
    });
    expect(useBoundStore.getState().isReplay).toBe(true);
  });
});

describe("Testing creation modal", () => {
  test("revealCreation must be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("revealCreation");
  });
  test("setRevealCreation sets the modal visibility", async () => {
    act(() => {
      useBoundStore.getState().setRevealCreation(true);
    });
    expect(useBoundStore.getState().revealCreation).toBe(true);
  });
});

describe("Testing creationTrack", () => {
  test("creationTrack must be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("creationTrack");
  });
  test("setCreationTrack sets the track to be added to custom playlists", async () => {
    act(() => {
      useBoundStore.getState().setCreationTrack(sampleTrack);
    });
    expect(useBoundStore.getState().creationTrack).toMatchObject(sampleTrack);
  });
});

describe("Testing notifications", () => {
  test("notifications variable must be present", async () => {
    expect(useBoundStore.getState()).toHaveProperty("notifications");
  });
  test("setNotifications reveals notifications", async () => {
    act(() => {
      useBoundStore.getState().setNotifications(true);
    });
    expect(useBoundStore.getState().notifications).toBe(true);
  });
});

