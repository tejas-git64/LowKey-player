import { create } from "zustand";
import {
  AlbumById,
  AlbumType,
  ArtistType,
  ChartType,
  GlobalHome,
  Image,
  PlaylistById,
  PlaylistOfList,
  PlaylistType,
  Queue,
  SearchType,
  Song,
  TrackDetails,
  UserPlaylist,
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
      today: PlaylistById;
      weekly: PlaylistById;
      monthly: PlaylistById;
      yearly: PlaylistById;
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
  playlist: {
    id: string;
    userId: string;
    name: string;
    followerCount: string;
    songCount: string;
    fanCount: string;
    username: string;
    firstname: string;
    lastname: string;
    shares: string;
    image: Image[];
    url: string;
    songs: TrackDetails[];
  };
  album: AlbumById;
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
    queue: Queue;
  };
  favorites: {
    songs: TrackDetails[];
    albums: AlbumById[];
    playlists: PlaylistById[];
  };
  library: {
    albums: AlbumById[];
    playlists: PlaylistById[];
    followings: ArtistType[];
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
  setToday: (data: PlaylistById) => void;
  setWeekly: (data: PlaylistById) => void;
  setMonthly: (data: PlaylistById) => void;
  setYearly: (data: PlaylistById) => void;
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
  setFollowing: (song: ArtistType) => void;
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
  setQueue: (data: Queue) => void;
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
        widget: {
          id: "",
          userId: "",
          name: "",
          followerCount: "",
          songCount: "",
          fanCount: "",
          username: "",
          firstname: "",
          lastname: "",
          shares: "",
          image: [],
          url: "",
          songs: [],
        },
        timely: {
          today: {
            id: "",
            userId: "",
            name: "",
            followerCount: "",
            songCount: "",
            fanCount: "",
            username: "",
            firstname: "",
            lastname: "",
            shares: "",
            image: [],
            url: "",
            songs: [],
          },
          weekly: {
            id: "",
            userId: "",
            name: "",
            followerCount: "",
            songCount: "",
            fanCount: "",
            username: "",
            firstname: "",
            lastname: "",
            shares: "",
            image: [],
            url: "",
            songs: [],
          },
          monthly: {
            id: "",
            userId: "",
            name: "",
            followerCount: "",
            songCount: "",
            fanCount: "",
            username: "",
            firstname: "",
            lastname: "",
            shares: "",
            image: [],
            url: "",
            songs: [],
          },
          yearly: {
            id: "",
            userId: "",
            name: "",
            followerCount: "",
            songCount: "",
            fanCount: "",
            username: "",
            firstname: "",
            lastname: "",
            shares: "",
            image: [],
            url: "",
            songs: [],
          },
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
      recents: {
        history: [],
        activity: [],
      },
      playlist: {
        id: "",
        userId: "",
        name: "",
        followerCount: "",
        songCount: "",
        fanCount: "",
        username: "",
        firstname: "",
        lastname: "",
        shares: "",
        image: [],
        url: "",
        songs: [],
      },
      album: {
        id: "",
        name: "",
        year: "",
        releaseDate: "",
        songCount: "",
        url: "",
        primaryArtistsId: "",
        primaryArtists: "",
        featuredArtists: [],
        artists: [],
        image: [],
        songs: [],
      },
      artist: {
        details: {
          id: "",
          name: "",
          url: "",
          image: [],
          followerCount: "",
          fanCount: "",
          isVerified: false,
          dominantLanguage: "",
          dominantType: "",
          bio: [],
          dob: "",
          fb: "",
          twitter: "",
          wiki: "",
          availableLanguages: [],
          isRadioPresent: false,
        },
        songs: [],
        albums: [],
      },
      search: {
        topQuery: {
          results: [],
          position: 0,
        },
        songs: {
          results: [],
          position: 0,
        },
        albums: {
          results: [],
          position: 0,
        },
        artists: {
          results: [],
          position: 0,
        },
        playlists: {
          results: [],
          position: 0,
        },
      },
      nowPlaying: {
        track: {
          id: "",
          name: "",
          type: "",
          album: {
            id: "",
            name: "",
            url: "",
          },
          year: "",
          releaseDate: "",
          duration: "",
          label: "",
          artists: {
            all: [],
            featured: [],
            primary: [],
          },
          lyricsId: "",
          explicitContent: 0,
          playCount: 0,
          language: "",
          hasLyrics: "",
          url: "",
          copyright: "",
          image: [],
          downloadUrl: [],
        },
        isPlaying: false,
        isMobilePlayer: false,
        isFavorite: false,
        queue: {
          id: "",
          name: "",
          image: [],
          songs: [],
        },
      },
      favorites: {
        songs: [],
        albums: [],
        playlists: [],
      },
      library: {
        followings: [],
        albums: [],
        playlists: [],
        userPlaylists: [],
      },
      isShuffling: false,
      isReplay: false,
      isCreationMenu: false,
      revealCreation: false,
      creationTrack: null,
      notifications: false,
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
      setToday: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.today = data;
        }),
      setWeekly: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.weekly = data;
        }),
      setMonthly: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.monthly = data;
        }),
      setYearly: (data: PlaylistById) =>
        set((state) => {
          state.home.timely.yearly = data;
        }),
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
      setSearch: (data: SearchType) =>
        set((state) => {
          state.search = data;
        }),
      setPlaylist: (data: PlaylistById) =>
        set((state) => {
          state.playlist = data;
        }),
      setAlbum: (data: AlbumById) =>
        set((state) => {
          state.album = data;
        }),
      setArtistDetails: (data: ArtistType | null) =>
        set((state) => {
          state.artist.details = data;
        }),
      setArtistAlbums: (data: AlbumType[]) =>
        set((state) => {
          state.artist.albums = data;
        }),
      setArtistSongs: (data: TrackDetails[]) =>
        set((state) => {
          state.artist.songs = data;
        }),
      setNowPlaying: (data: TrackDetails | null) =>
        set((state) => {
          state.nowPlaying.track = data;
        }),
      setQueue: (data: Queue) =>
        set(
          produce((state) => {
            state.nowPlaying.queue = data;
          }),
        ),
      setIsPlaying: (status: boolean) =>
        set((state) => {
          state.nowPlaying.isPlaying = status;
        }),
      setShowPlayer: (isShow: boolean) =>
        set((state) => {
          state.nowPlaying.isMobilePlayer = isShow;
        }),
      setIsShuffling: (isShuffled: boolean) =>
        set((state) => {
          state.isShuffling = isShuffled;
        }),
      setIsReplay: (replay: boolean) =>
        set((state) => {
          state.isReplay = replay;
        }),
      setFavoriteSong: (song: TrackDetails) => {
        set(
          produce((state) => {
            state.favorites.songs.push(song);
          }),
        );
        get().setActivity(`Added ${song.name} to favorites 💘`);
      },
      setFavoriteAlbum: (data: AlbumById) => {
        set(
          produce((state) => {
            state.favorites.albums.push(data);
          }),
        );
        get().setActivity(`Added ${data.name} to favorites 💘`);
      },
      setFavoritePlaylist: (data: PlaylistById) => {
        set(
          produce((state) => {
            state.favorites.playlists.push(data);
          }),
        );
        get().setActivity(`Added ${data.name} to favorites 💘`);
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
      setFollowing: (data: ArtistType) => {
        set(
          produce((state) => {
            state.library.followings.unshift(data);
          }),
        );
        get().setActivity(`Started following ${data.name} ✨`);
      },
      setLibraryAlbum: (data: AlbumById) => {
        set(
          produce((state) => {
            state.library.albums.unshift(data);
          }),
        );
        get().setActivity(`Added ${data.name} to Library 📚`);
      },
      setLibraryPlaylist: (data: PlaylistById) => {
        set(
          produce((state) => {
            state.library.playlists.unshift(data);
          }),
        );
        get().setActivity(`Added ${data.name} to Library 📚`);
      },
      removeFollowing: (id: string) =>
        set(
          produce((state) => {
            state.library.followings = state.library.followings.filter(
              (following: ArtistType) => following.id !== id,
            );
          }),
        ),
      removeLibraryAlbum: (id: string) =>
        set(
          produce((state) => {
            state.library.albums = state.library.albums.filter(
              (album: AlbumById) => album.id !== id,
            );
          }),
        ),
      removeLibraryPlaylist: (id: string) =>
        set(
          produce((state) => {
            state.library.playlists = state.library.playlists.filter(
              (playlist: PlaylistById) => playlist.id !== id,
            );
          }),
        ),
      setCreationMenu: (show: boolean) =>
        set((state) => {
          state.isCreationMenu = show;
        }),
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
      setRevealCreation: (isRevealed: boolean) =>
        set((state) => {
          state.revealCreation = isRevealed;
        }),
      setCreationTrack: (song: TrackDetails) =>
        set((state) => {
          state.creationTrack = song;
        }),
      setNotifications: (show: boolean) =>
        set((state) => {
          state.notifications = show;
        }),
    })),
  ),
);
