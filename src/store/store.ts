import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  AlbumById,
  PlaylistById,
  TrackDetails,
  ActivityType,
  LocalLibrary,
  RecentTypes,
} from "../types/GlobalTypes";
import { subscribeWithSelector } from "zustand/middleware";
import { librarySlice, LibrarySliceType } from "./librarySlice";
import { favoritesSlice, FavoritesSliceType } from "./favoritesSlice";
import { playerSlice, PlayerSliceType } from "./playerSlice";
import { RecentSliceType, recentsSlice } from "./recentsSlice";
import { searchSlice, SearchSliceType } from "./searchSlice";
import { saveToLocalStorage } from "../helpers/saveToLocalStorage";

export type StoreType = {
  greeting: string;
  changeGreeting: (str: string) => void;
  notifications: boolean;
  setNotifications: (show: boolean) => void;
} & LibrarySliceType &
  FavoritesSliceType &
  PlayerSliceType &
  RecentSliceType &
  SearchSliceType;

export const useBoundStore = create<StoreType>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => {
        const savedLibrary = {
          albums: [],
          playlists: [],
          userPlaylists: [],
          followings: [],
        } as LocalLibrary;
        const savedFavorites = {
          songs: [] as TrackDetails[],
          albums: [] as AlbumById[],
          playlists: [] as PlaylistById[],
        };
        const savedRecents = {
          history: [] as TrackDetails[],
          activity: [] as ActivityType[],
        };
        const localLibrary = localStorage.getItem("local-library");
        const localFavorites = localStorage.getItem("local-favorites");
        const localRecents = localStorage.getItem("last-recents");
        if (localLibrary !== null) {
          const { albums, followings, playlists, userPlaylists }: LocalLibrary =
            JSON.parse(localLibrary);
          savedLibrary.albums = albums;
          savedLibrary.playlists = playlists;
          savedLibrary.followings = followings;
          savedLibrary.userPlaylists = userPlaylists;
        }
        if (localFavorites !== null) {
          const {
            songs,
            albums,
            playlists,
          }: {
            songs: TrackDetails[];
            albums: AlbumById[];
            playlists: PlaylistById[];
          } = JSON.parse(localFavorites);
          savedFavorites.albums = albums;
          savedFavorites.playlists = playlists;
          savedFavorites.songs = songs;
        }
        if (localRecents !== null) {
          const { history, activity }: RecentTypes = JSON.parse(localRecents);
          if (history !== null) {
            savedRecents.history = history;
          }
          savedRecents.activity = activity as ActivityType[];
        }

        return {
          greeting: "",
          changeGreeting: (str: string) =>
            set(() => ({
              greeting: str,
            })),
          notifications: false,
          setNotifications: (show: boolean) =>
            set((state) => {
              state.notifications = show;
            }),
          ...playerSlice(set),
          ...favoritesSlice(savedFavorites, set, get),
          ...librarySlice(savedLibrary, set, get),
          ...recentsSlice(savedRecents, set),
          ...searchSlice(set),
        };
      }),
    ),
  ),
);

//Subscribers
//Saves library playlists
useBoundStore.subscribe(
  (s) => s.library?.playlists,
  (playlists) => {
    saveToLocalStorage("local-library", {
      playlists,
    });
  },
);

//Saves library albums
useBoundStore.subscribe(
  (s) => s.library?.albums,
  (albums) => {
    saveToLocalStorage("local-library", {
      albums,
    });
  },
);

//Saves library user playlists
useBoundStore.subscribe(
  (s) => s.library?.userPlaylists,
  (userPlaylists) => {
    saveToLocalStorage("local-library", {
      userPlaylists,
    });
  },
);

//Saves library user playlists
useBoundStore.subscribe(
  (s) => s.library?.followings,
  (followings) => {
    saveToLocalStorage("local-library", {
      followings,
    });
  },
);

//Saves song favorites
useBoundStore.subscribe(
  (s) => s.favorites?.songs,
  (songs) => {
    saveToLocalStorage("local-favorites", {
      songs,
    });
  },
);

//Saves album favorites
useBoundStore.subscribe(
  (s) => s.favorites?.albums,
  (albums) => {
    saveToLocalStorage("local-favorites", {
      albums,
    });
  },
);

//Saves playlist favorites
useBoundStore.subscribe(
  (s) => s.favorites?.playlists,
  (playlists) => {
    saveToLocalStorage("local-favorites", {
      playlists,
    });
  },
);

//Saves recent history
useBoundStore.subscribe(
  (s) => s.recents?.history,
  (history) => {
    saveToLocalStorage("last-recents", {
      history,
    });
  },
);

//Saves recent activity
useBoundStore.subscribe(
  (s) => s.recents?.activity,
  (activity) => {
    saveToLocalStorage("last-recents", {
      activity,
    });
  },
);
