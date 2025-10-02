import { describe, expect, test } from "vitest";
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

describe("Testing greeting", () => {
  test("greeting variable should be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("greeting");
  });
  test("changeGreeting action should set new greeting", () => {
    const str = "Hello!";
    act(() => {
      useBoundStore.getState().changeGreeting(str);
    });
    expect(useBoundStore.getState().greeting).toBe(str);
  });
});

describe("Testing recents", () => {
  test("recents variable should be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("recents");
    expect(useBoundStore.getState().recents).toHaveProperty("activity");
    expect(useBoundStore.getState().recents).toHaveProperty("history");
  });
  test("setHistory action should bring up new listening history", () => {
    act(() => {
      useBoundStore.getState().setHistory(sampleTrack);
      useBoundStore.getState().setHistory({ ...sampleTrack, id: "kC25VqoDjc" });
      useBoundStore.getState().setHistory({ ...sampleTrack, id: "kC25VqoDjc" });
    });
    expect(useBoundStore.getState().recents.history[0].id).toBe("kC25VqoDjc");
  });
  test("setActivity action should bring up the recent activity", () => {
    const activity = "Added new playlist HipHits";
    act(() => {
      useBoundStore.getState().setActivity(activity);
    });
    expect(useBoundStore.getState().recents.activity).toContain(activity);
  });
});

describe("Testing search", () => {
  test("search variable should be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("search");
  });

  test("topQuery variable should be present in search", () => {
    expect(useBoundStore.getState().search).toHaveProperty("topQuery");
  });
  test("songs variable should be present in search", () => {
    expect(useBoundStore.getState().search).toHaveProperty("songs");
  });
  test("albums variable should be present in search", () => {
    expect(useBoundStore.getState().search).toHaveProperty("albums");
  });
  test("artists variable should be present in search", () => {
    expect(useBoundStore.getState().search).toHaveProperty("artists");
  });
  test("playlists variable should be present in search", () => {
    expect(useBoundStore.getState().search).toHaveProperty("playlists");
  });

  test("setSearch should set data based on query results", () => {
    act(() => {
      useBoundStore.getState().setSearch(sampleSearchResults);
    });
    expect(useBoundStore.getState().search).toMatchObject(sampleSearchResults);
  });
});

describe("Testing nowPlaying", () => {
  test("nowPlaying variable should be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("nowPlaying");
  });

  describe("Testing track and its action", () => {
    test("track variable should be present in nowPlaying", () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty("track");
    });
    test("setNowPlaying should set a new track", () => {
      act(() => {
        useBoundStore.getState().setNowPlaying(sampleTrack);
      });
      expect(useBoundStore.getState().nowPlaying.track).toMatchObject(
        sampleTrack,
      );
    });
  });

  describe("Testing isPlaying and it's action", () => {
    test("isPlaying variable should be present in nowPlaying", () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty("isPlaying");
    });
    test("setIsPlaying should set a new track", () => {
      act(() => {
        useBoundStore.getState().setIsPlaying(true);
      });
      expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
    });
  });

  describe("Testing isMobilePlayer and it's action", () => {
    test("isMobilePlayer variable should be present in nowPlaying", () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty(
        "isMobilePlayer",
      );
    });
    test("setShowPlayer should toggle mobile view state", () => {
      act(() => {
        useBoundStore.getState().setShowPlayer(true);
      });
      expect(useBoundStore.getState().nowPlaying.isMobilePlayer).toBe(true);
    });
  });

  test("isFavorite variable should be present in nowPlaying", () => {
    expect(useBoundStore.getState().nowPlaying).toHaveProperty("isFavorite");
  });

  describe("Testing queue and it's action", () => {
    test("queue variable should be present in nowPlaying", () => {
      expect(useBoundStore.getState().nowPlaying).toHaveProperty("queue");
    });

    test("setQueue should set songs of a new playlist/album into the queue", () => {
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
  test("favorites variable should be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("favorites");
  });

  describe("Testing favorite songs and it's action", () => {
    test("songs variable should be present in favorites", () => {
      expect(useBoundStore.getState().favorites).toHaveProperty("songs");
    });

    test("setFavoriteSong must favorite a song if the same song id doesn't exist", () => {
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

    test("removeFavoriteSong unfavorites the same song", () => {
      act(() => {
        useBoundStore.getState().removeFavorite(sampleTrack.id);
      });
      expect(useBoundStore.getState().favorites.songs).not.toContainEqual(
        sampleTrack,
      );
    });
  });

  describe("Testing favorite albums and it's action", () => {
    test("albums variable is present in favorites", () => {
      expect(useBoundStore.getState().favorites).toHaveProperty("albums");
    });
    test("setFavoriteAlbum favorites a new album", () => {
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
    test("removeFavoriteAlbum unFavorites the same album", () => {
      act(() => {
        useBoundStore.getState().removeFavoriteAlbum(sampleAlbum.id);
      });
      expect(useBoundStore.getState().favorites.albums).not.toContainEqual(
        sampleAlbum,
      );
    });
  });

  describe("Testing favorite playlists and it's action", () => {
    test("playlists variable is present in favorites", () => {
      expect(useBoundStore.getState().favorites).toHaveProperty("playlists");
    });

    test("setFavoritePlaylist favorites a new playlist", () => {
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
    test("removeFavoritePlaylist unfavorites the same playlist", () => {
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
    test("followings variable is present in library", () => {
      expect(useBoundStore.getState().library).toHaveProperty("followings");
    });
    test("setFollowing adds a new following", () => {
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
    test("removeFollowing removes the same following", () => {
      act(() => {
        useBoundStore.getState().removeFollowing(sampleArtistInSong.id);
      });
      expect(useBoundStore.getState().library.followings).not.toContainEqual(
        sampleArtistInSong,
      );
    });
  });

  describe("Testing albums and it's action", () => {
    test("albums variable is present in library", () => {
      expect(useBoundStore.getState().library).toHaveProperty("albums");
    });
    test("setLibraryAlbum adds a new album", () => {
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
    test("removeLibraryAlbum removes the same album", () => {
      act(() => {
        useBoundStore.getState().removeLibraryAlbum(sampleAlbum.id);
      });
      expect(useBoundStore.getState().library.albums).not.toContainEqual(
        sampleAlbum,
      );
    });
  });

  describe("Testing playlists and it's action", () => {
    test("playlists variable is present in library", () => {
      expect(useBoundStore.getState().library).toHaveProperty("playlists");
    });
    test("setLibraryPlaylist adds a new playlist", () => {
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
    test("removeLibraryPlaylist removes the same playlist", () => {
      act(() => {
        useBoundStore.getState().removeLibraryPlaylist(samplePlaylist.id);
      });
      expect(useBoundStore.getState().library.playlists).not.toContainEqual(
        samplePlaylist,
      );
    });
  });

  describe("Testing userPlaylists and it's actions", () => {
    test("userPlaylists variable is present in library", () => {
      expect(useBoundStore.getState().library).toHaveProperty("userPlaylists");
    });

    test("setUserPlaylist adds a custom playlist", () => {
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
    test("removeUserPlaylist removes the same playlist", () => {
      act(() => {
        useBoundStore.getState().removeUserPlaylist(sampleUserPlaylist.id);
      });
      expect(useBoundStore.getState().library.userPlaylists).not.toContainEqual(
        sampleUserPlaylist,
      );
    });
    test("setToUserPlaylist adds a track to a custom playlist", () => {
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
    test("removeFromUserPlaylist removes the same track from the same playlist", () => {
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
    test("createNewUserPlaylist creates new custom playlist", () => {
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
  test("isShuffling must be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("isShuffling");
  });
  test("setIsShuffling sets the shuffle status", () => {
    act(() => {
      useBoundStore.getState().setIsShuffling(true);
    });
    expect(useBoundStore.getState().isShuffling).toBe(true);
  });
});

describe("Testing replay", () => {
  test("isReplay must be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("isReplay");
  });
  test("setIsReplay sets the replay status", () => {
    act(() => {
      useBoundStore.getState().setIsReplay(true);
    });
    expect(useBoundStore.getState().isReplay).toBe(true);
  });
});

describe("Testing creation modal", () => {
  test("revealCreation must be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("revealCreation");
  });
  test("setRevealCreation sets the modal visibility", () => {
    act(() => {
      useBoundStore.getState().setRevealCreation(true);
    });
    expect(useBoundStore.getState().revealCreation).toBe(true);
  });
});

describe("Testing creationTrack", () => {
  test("creationTrack must be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("creationTrack");
  });
  test("setCreationTrack sets the track to be added to custom playlists", () => {
    act(() => {
      useBoundStore.getState().setCreationTrack(sampleTrack);
    });
    expect(useBoundStore.getState().creationTrack).toMatchObject(sampleTrack);
  });
});

describe("Testing notifications", () => {
  test("notifications variable must be present", () => {
    expect(useBoundStore.getState()).toHaveProperty("notifications");
  });
  test("setNotifications reveals notifications", () => {
    act(() => {
      useBoundStore.getState().setNotifications(true);
    });
    expect(useBoundStore.getState().notifications).toBe(true);
  });
});
