import { create } from "zustand";
import {
  AlbumById,
  AlbumType,
  ArtistType,
  ChartType,
  GlobalHome,
  PlaylistById,
  PlaylistOfList,
  PlaylistType,
  SongQueue,
  SearchType,
  Song,
  TrackDetails,
  UserPlaylist,
  ArtistInSong,
} from "../types/GlobalTypes";
import { immer } from "zustand/middleware/immer";
import { produce } from "immer";
import { devtools } from "zustand/middleware";

export type StoreType = {
  greeting: string;
  changeGreeting: (str: string) => void;
  home: {
    widget: PlaylistById | null;
    timely: {
      viral: PlaylistById | null;
      weekly: PlaylistById | null;
      monthly: PlaylistById | null;
      latest: PlaylistById | null;
    };
    default: {
      albums: AlbumType[];
      charts: ChartType[];
      playlists: PlaylistType[];
      trending: {
        songs: Song[];
        albums: AlbumType[];
      };
    };
    genres: {
      [key: string]: PlaylistOfList[];
      pop: PlaylistOfList[];
      hiphop: PlaylistOfList[];
      love: PlaylistOfList[];
      rap: PlaylistOfList[];
      workout: PlaylistOfList[];
      jazz: PlaylistOfList[];
      rock: PlaylistOfList[];
      melody: PlaylistOfList[];
      lofi: PlaylistOfList[];
      chill: PlaylistOfList[];
      focus: PlaylistOfList[];
      instrumental: PlaylistOfList[];
      indie: PlaylistOfList[];
      edm: PlaylistOfList[];
      metal: PlaylistOfList[];
      punk: PlaylistOfList[];
      party: PlaylistOfList[];
      folk: PlaylistOfList[];
      devotional: PlaylistOfList[];
      ambient: PlaylistOfList[];
      sleep: PlaylistOfList[];
      soul: PlaylistOfList[];
    };
  };
  recents: {
    history: TrackDetails[];
    activity: string[];
  };
  playlist: PlaylistById | null;
  album: AlbumById | null;
  artist: {
    details: ArtistType | null;
    songs: TrackDetails[];
    albums: AlbumType[];
  };
  search: SearchType;
  nowPlaying: {
    track: TrackDetails | null;
    isPlaying: boolean;
    isMobilePlayer: boolean;
    isFavorite: boolean;
    queue: SongQueue | null;
  };
  favorites: {
    songs: TrackDetails[];
    albums: AlbumById[];
    playlists: PlaylistById[];
  };
  library: {
    albums: AlbumById[];
    playlists: PlaylistById[];
    followings: ArtistInSong[];
    userPlaylists: UserPlaylist[];
  };
  isShuffling: boolean;
  isReplay: boolean;
  isCreationMenu: boolean;
  revealCreation: boolean;
  creationTrack: TrackDetails | null;
  notifications: boolean;
  setWidgetData: (data: PlaylistById) => void;
  setDefault: (data: GlobalHome) => void;
  setGenres: (genre: string, data: PlaylistOfList[]) => void;
  setViral: (data: PlaylistById) => void;
  setWeekly: (data: PlaylistById) => void;
  setMonthly: (data: PlaylistById) => void;
  setLatest: (data: PlaylistById) => void;
  setHistory: (data: TrackDetails) => void;
  setActivity: (message: string) => void;
  setSearch: (data: SearchType) => void;
  setPlaylist: (data: PlaylistById) => void;
  setAlbum: (data: AlbumById) => void;
  setArtistDetails: (data: ArtistType | null) => void;
  setArtistAlbums: (data: AlbumType[]) => void;
  setArtistSongs: (data: TrackDetails[]) => void;
  setNowPlaying: (data: TrackDetails | null) => void;
  setIsPlaying: (status: boolean) => void;
  setShowPlayer: (isShow: boolean) => void;
  setIsShuffling: (isShuffled: boolean) => void;
  setIsReplay: (replay: boolean) => void;
  setFavoriteSong: (song: TrackDetails) => void;
  setFavoriteAlbum: (data: AlbumById) => void;
  setFavoritePlaylist: (data: PlaylistById) => void;
  removeFavorite: (id: string) => void;
  removeFavoriteAlbum: (id: string) => void;
  removeFavoritePlaylist: (id: string) => void;
  setFollowing: (song: ArtistInSong) => void;
  setLibraryAlbum: (data: AlbumById) => void;
  setLibraryPlaylist: (data: PlaylistById) => void;
  removeFollowing: (id: string) => void;
  removeLibraryAlbum: (id: string) => void;
  removeLibraryPlaylist: (id: string) => void;
  setCreationMenu: (show: boolean) => void;
  setToUserPlaylist: (song: TrackDetails, id: number) => void;
  removeFromUserPlaylist: (id: number, songid: string) => void;
  createNewUserPlaylist: (name: string, id: number) => void;
  removeUserPlaylist: (id: number) => void;
  setRevealCreation: (isRevealed: boolean) => void;
  setCreationTrack: (song: TrackDetails) => void;
  setQueue: (data: SongQueue) => void;
  setNotifications: (show: boolean) => void;
};

export const useBoundStore = create<StoreType>()(
  devtools(
    immer((set, get) => ({
      greeting: "",
      changeGreeting: (str: string) =>
        set(() => ({
          greeting: str,
        })),
      home: {
        widget: null,
        timely: {
          viral: null,
          weekly: null,
          monthly: null,
          latest: null,
        },
        default: {
          albums: [],
          charts: [],
          playlists: [],
          trending: {
            songs: [],
            albums: [],
          },
        },
        genres: {
          pop: [],
          hiphop: [],
          love: [],
          rap: [],
          workout: [],
          jazz: [],
          rock: [],
          melody: [],
          lofi: [],
          chill: [],
          focus: [],
          instrumental: [],
          indie: [],
          edm: [],
          metal: [],
          punk: [],
          party: [],
          folk: [],
          devotional: [],
          ambient: [],
          sleep: [],
          soul: [],
        },
      },
      setWidgetData: (data: PlaylistById) =>
        set((state) => {
          state.home.widget = data;
        }),
      setDefault: (data: GlobalHome) =>
        set((state) => {
          state.home.default = data;
        }),
      setGenres: (genre, data) =>
        set((state) => {
          state.home.genres[genre] = data;
        }),
      setViral: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.viral = data;
        }),
      setWeekly: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.weekly = data;
        }),
      setMonthly: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.monthly = data;
        }),
      setLatest: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.latest = data;
        }),
      recents: {
        history: [],
        activity: [],
      },
      setHistory: (data: TrackDetails) =>
        set(
          produce((state) => {
            state.recents.history.unshift(data);
          }),
        ),
      setActivity: (message: string) =>
        set(
          produce((state) => {
            state.recents.activity.unshift(message);
          }),
        ),
      playlist: null,
      setPlaylist: (data: PlaylistById) =>
        set((state) => {
          state.playlist = data;
        }),
      album: null,
      setAlbum: (data: AlbumById) =>
        set((state) => {
          state.album = data;
        }),
      artist: {
        details: null,
        songs: [],
        albums: [],
      },
      setArtistDetails: (data: ArtistType | null) =>
        set((state) => {
          state.artist.details = data;
        }),
      setArtistSongs: (data: TrackDetails[]) =>
        set((state) => {
          state.artist.songs = data;
        }),
      setArtistAlbums: (data: AlbumType[]) =>
        set((state) => {
          state.artist.albums = data;
        }),
      search: {
        topQuery: null,
        songs: null,
        albums: null,
        artists: null,
        playlists: null,
      },
      setSearch: (data: SearchType) =>
        set((state) => {
          state.search = data;
        }),
      nowPlaying: {
        track: null,
        isPlaying: false,
        isMobilePlayer: false,
        isFavorite: false,
        queue: null,
      },
      setNowPlaying: (data: TrackDetails | null) =>
        set((state) => {
          state.nowPlaying.track = data;
        }),
      setIsPlaying: (status: boolean) =>
        set((state) => {
          state.nowPlaying.isPlaying = status;
        }),
      setShowPlayer: (isShow: boolean) =>
        set((state) => {
          state.nowPlaying.isMobilePlayer = isShow;
        }),
      setQueue: (data: SongQueue) =>
        set(
          produce((state) => {
            state.nowPlaying.queue = data;
          }),
        ),
      favorites: {
        songs: [],
        albums: [],
        playlists: [],
      },
      setFavoriteSong: (song: TrackDetails) => {
        set(
          produce((state) => {
            if (
              !state.favorites.songs.some((s: TrackDetails) => s.id === song.id)
            ) {
              state.favorites.songs.push(song);
              get().setActivity(`Added ${song.name} to favorites 💘`);
            }
          }),
        );
      },
      setFavoriteAlbum: (data: AlbumById) => {
        set(
          produce((state) => {
            if (
              !state.favorites.albums.some((a: AlbumById) => a.id === data.id)
            ) {
              state.favorites.albums.push(data);
              get().setActivity(`Added ${data.name} to favorites 💘`);
            }
          }),
        );
      },
      setFavoritePlaylist: (data: PlaylistById) => {
        set(
          produce((state) => {
            if (
              !state.favorites.playlists.some(
                (p: PlaylistById) => p.id === data.id,
              )
            ) {
              state.favorites.playlists.push(data);
              get().setActivity(`Added ${data.name} to favorites 💘`);
            }
          }),
        );
      },
      removeFavorite: (id: string) =>
        set(
          produce((state) => {
            state.favorites.songs = state.favorites.songs.filter(
              (song: TrackDetails) => song.id !== id,
            );
          }),
        ),
      removeFavoriteAlbum: (id: string) =>
        set(
          produce((state) => {
            state.favorites.albums = state.favorites.albums.filter(
              (album: { id: string }) => album.id !== id,
            );
          }),
        ),
      removeFavoritePlaylist: (id: string) =>
        set(
          produce((state) => {
            state.favorites.playlists = state.favorites.playlists.filter(
              (playlist: { id: string }) => playlist.id !== id,
            );
          }),
        ),
      library: {
        followings: [],
        albums: [],
        playlists: [],
        userPlaylists: [],
      },
      setFollowing: (data: ArtistInSong) => {
        set(
          produce((state) => {
            state.library.followings.unshift(data);
          }),
        );
        get().setActivity(`Started following ${data.name} ✨`);
      },
      removeFollowing: (id: string) =>
        set(
          produce((state) => {
            state.library.followings = state.library.followings.filter(
              (following: ArtistInSong) => following.id !== id,
            );
          }),
        ),
      setLibraryAlbum: (data: AlbumById) => {
        set(
          produce((state) => {
            state.library.albums.unshift(data);
          }),
        );
        get().setActivity(`Added ${data.name} to Library 📚`);
      },
      removeLibraryAlbum: (id: string) =>
        set(
          produce((state) => {
            state.library.albums = state.library.albums.filter(
              (album: AlbumById) => album.id !== id,
            );
          }),
        ),
      setLibraryPlaylist: (data: PlaylistById) => {
        set(
          produce((state) => {
            state.library.playlists.unshift(data);
          }),
        );
        get().setActivity(`Added ${data.name} to Library 📚`);
      },
      removeLibraryPlaylist: (id: string) =>
        set(
          produce((state) => {
            state.library.playlists = state.library.playlists.filter(
              (playlist: PlaylistById) => playlist.id !== id,
            );
          }),
        ),
      setToUserPlaylist: (song: TrackDetails, id: number) => {
        set(
          produce((state) => {
            const object: UserPlaylist = state.library.userPlaylists.find(
              (playlist: UserPlaylist) => playlist.id === id,
            );
            object.songs.unshift(song);
          }),
        );
      },
      removeFromUserPlaylist: (id: number, songid: string) =>
        set(
          produce((state) => {
            const object = state.library.userPlaylists.find(
              (playlist: UserPlaylist) => playlist.id === id,
            );
            object.songs = object.songs.filter(
              (song: TrackDetails) => song.id !== songid,
            );
          }),
        ),
      createNewUserPlaylist: (name: string, id: number) => {
        set(
          produce((state) => {
            const playlist = {
              name: name,
              id: id,
              songs: [],
            };
            state.library.userPlaylists.unshift(playlist);
          }),
        );
        get().setActivity(`Created "${name}" as playlist 🎶`);
      },
      removeUserPlaylist: (id: number) =>
        set(
          produce((state) => {
            state.library.userPlaylists = state.library.userPlaylists.filter(
              (playlist: UserPlaylist) => playlist.id !== id,
            );
          }),
        ),
      isShuffling: false,
      setIsShuffling: (isShuffled: boolean) =>
        set((state) => {
          state.isShuffling = isShuffled;
        }),
      isReplay: false,
      setIsReplay: (replay: boolean) =>
        set((state) => {
          state.isReplay = replay;
        }),
      isCreationMenu: false,
      setCreationMenu: (show: boolean) =>
        set((state) => {
          state.isCreationMenu = show;
        }),
      revealCreation: false,
      setRevealCreation: (isRevealed: boolean) =>
        set((state) => {
          state.revealCreation = isRevealed;
        }),
      creationTrack: null,
      setCreationTrack: (song: TrackDetails) =>
        set((state) => {
          state.creationTrack = song;
        }),
      notifications: false,
      setNotifications: (show: boolean) =>
        set((state) => {
          state.notifications = show;
        }),
    })),
  ),
);
