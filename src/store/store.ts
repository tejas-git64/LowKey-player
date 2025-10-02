import { create } from "zustand";
import {
  AlbumById,
  PlaylistById,
  SongQueue,
  SearchType,
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
  recents: {
    history: TrackDetails[];
    activity: string[];
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
  revealCreation: boolean;
  creationTrack: TrackDetails | null;
  notifications: boolean;
  setHistory: (data: TrackDetails) => void;
  setActivity: (message: string) => void;
  setSearch: (data: SearchType) => void;
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
  setToUserPlaylist: (song: TrackDetails, id: number) => void;
  setUserPlaylist: (playlist: UserPlaylist) => void;
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
      recents: {
        history: [],
        activity: [],
      },
      setHistory: (data: TrackDetails) =>
        set(
          produce((state) => {
            const existingIndex = state.recents.history.findIndex(
              (song: TrackDetails) => song.id === data?.id,
            );
            if (existingIndex !== -1) {
              state.recents.history.splice(existingIndex, 1);
            }
            state.recents.history.unshift(data);
          }),
        ),
      setActivity: (message: string) =>
        set(
          produce((state) => {
            state.recents.activity = Array.from(
              new Set([message, ...state.recents.activity]),
            );
          }),
        ),
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
        set((state) => ({
          nowPlaying: {
            ...state.nowPlaying,
            track: data,
          },
        })),
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
            if (
              !state.library.followings.some(
                (p: PlaylistById) => p.id === data.id,
              )
            ) {
              state.library.followings.unshift(data);
            }
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
            if (
              !state.favorites.albums.some(
                (p: PlaylistById) => p.id === data.id,
              )
            ) {
              state.library.albums.unshift(data);
            }
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
            if (
              !state.library.playlists.some(
                (p: PlaylistById) => p.id === data.id,
              )
            ) {
              state.library.playlists.unshift(data);
            }
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
      setUserPlaylist: (playlist: UserPlaylist) => {
        set(
          produce((state) => {
            if (
              !state.library.userPlaylists.some(
                (p: UserPlaylist) => p.id === playlist.id,
              )
            ) {
              state.library.userPlaylists.unshift(playlist);
            }
          }),
        );
      },
      setToUserPlaylist: (track: TrackDetails, id: number) => {
        set(
          produce((state) => {
            const playlist = state.library.userPlaylists.find(
              (p: UserPlaylist) => p.id === id,
            );
            if (
              !playlist ||
              playlist.songs.some((s: TrackDetails) => s.id === track.id)
            ) {
              return state;
            }
            return {
              library: {
                ...state.library,
                userPlaylists: state.library.userPlaylists.map(
                  (p: UserPlaylist) =>
                    p.id === id ? { ...p, songs: [...p.songs, track] } : p,
                ),
              },
            };
          }),
        );
      },
      removeFromUserPlaylist: (id: number, songid: string) =>
        set(
          produce((state) => ({
            library: {
              ...state.library,
              userPlaylists: state.library.userPlaylists.map(
                (u: UserPlaylist) =>
                  u.id === id
                    ? { ...u, songs: u.songs.filter((s) => s.id !== songid) }
                    : u,
              ),
            },
          })),
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
