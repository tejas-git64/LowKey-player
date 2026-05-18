import { produce, WritableDraft } from "immer";
import {
  AlbumById,
  ArtistInSong,
  LocalLibrary,
  PlaylistById,
  TrackDetails,
  UserPlaylist,
} from "../types/GlobalTypes";
import { StoreType } from "./store";

export type LibrarySliceType = {
  library: {
    albums: AlbumById[];
    playlists: PlaylistById[];
    followings: ArtistInSong[];
    userPlaylists: UserPlaylist[];
  };
  setLibraryAlbum: (album: AlbumById) => void;
  removeLibraryAlbum: (id: string) => void;
  setLibraryPlaylist: (playlist: PlaylistById) => void;
  removeLibraryPlaylist: (id: string) => void;
  setToUserPlaylist: (song: TrackDetails, id: number) => void;
  setUserPlaylist: (playlist: UserPlaylist) => void;
  removeFromUserPlaylist: (id: number, songid: string) => void;
  createNewUserPlaylist: (name: string, id: number) => void;
  removeUserPlaylist: (id: number) => void;
  setFollowing: (song: ArtistInSong) => void;
  removeFollowing: (id: string) => void;
};

export const librarySlice = (
  saved: LocalLibrary,
  set: {
    (
      nextStateOrUpdater:
        | StoreType
        | Partial<StoreType>
        | ((state: WritableDraft<StoreType>) => void),
      shouldReplace?: false,
      action?: string | { type: string; [key: string]: unknown } | undefined,
    ): void;
    (
      nextStateOrUpdater:
        | StoreType
        | ((state: WritableDraft<StoreType>) => void),
      shouldReplace: true,
      action?: string | { type: string; [key: string]: unknown } | undefined,
    ): void;
  },
  get: () => StoreType,
) =>
  ({
    library: {
      albums: saved.albums,
      playlists: saved.playlists,
      followings: saved.followings,
      userPlaylists: saved.userPlaylists,
    },
    setLibraryAlbum: (data: AlbumById) => {
      set(
        produce((state) => {
          if (
            !state.favorites.albums.some((p: PlaylistById) => p.id === data.id)
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
            !state.library.playlists.some((p: PlaylistById) => p.id === data.id)
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
    removeFromUserPlaylist: (id: number, songId: string) =>
      set(
        produce((state) => {
          const playlists = state.library.userPlaylists;
          const targetIndex = playlists.findIndex(
            (p: UserPlaylist) => p.id === id,
          );
          if (targetIndex === -1) return;
          const target = playlists[targetIndex];
          const filteredSongs = target.songs.filter(
            (song: TrackDetails) => song.id !== songId,
          );
          playlists[targetIndex] = { ...target, songs: filteredSongs };
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
  }) as LibrarySliceType;
