import { produce, WritableDraft } from "immer";
import { TrackDetails, AlbumById, PlaylistById } from "../types/GlobalTypes";
import { StoreType } from "./store";

export type FavoritesSliceType = {
  favorites: {
    songs: TrackDetails[];
    albums: AlbumById[];
    playlists: PlaylistById[];
  };
  setFavoriteSong: (song: TrackDetails) => void;
  setFavoriteAlbum: (data: AlbumById) => void;
  setFavoritePlaylist: (data: PlaylistById) => void;
  removeFavorite: (id: string) => void;
  removeFavoriteAlbum: (id: string) => void;
  removeFavoritePlaylist: (id: string) => void;
};

export const favoritesSlice = (
  saved: FavoritesSliceType["favorites"],
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
    favorites: {
      songs: saved.songs,
      albums: saved.albums,
      playlists: saved.playlists,
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
  }) as FavoritesSliceType;
