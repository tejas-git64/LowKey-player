export type Song = {
  quality: string;
  url: string;
};

export type Image = {
  quality: string;
  url: string;
};

export type AlbumType = {
  id: string;
  name: string;
  year: string;
  type: string;
  playCount: string;
  language: string;
  explicitContent: string;
  songCount: string;
  url: string;
  primaryArtists: [
    {
      id: string;
      name: string;
      url: string;
      image: boolean;
      type: string;
      role: string;
    },
  ];
  featuredArtists: [];
  artists: [
    {
      id: string;
      name: string;
      url: string;
      image: boolean;
      type: string;
      role: string;
    },
  ];
  image: Image[];
  songs: TrackDetails[];
};

export type PlaylistType = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  type: string;
  image: Image[];
  url: string;
  songCount: string;
  firstname: string;
  followerCount: string;
  lastUpdated: string;
  explicitContent: string;
};

export type PlaylistOfList = {
  id: string;
  userId: string;
  name: string;
  songCount: string;
  username: string;
  firstname: string;
  lastname: string;
  language: string;
  image: Image[];
  url: string;
  songs: Song[];
};

export type ChartType = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  image: Image[];
  url: string;
  firstname: string;
  explicitContent: string;
  language: string;
};

export type ArtistType = {
  id: string;
  name: string;
  url: string;
  image: Image[];
  followerCount: string;
  fanCount: string;
  isVerified: false;
  dominantLanguage: string;
  dominantType: string;
  bio: [];
  dob: string;
  fb: string;
  twitter: string;
  wiki: string;
  availableLanguages: string[];
  isRadioPresent: boolean;
};

export type Track = {
  id: string;
  name: string;
  type: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  year: string;
  releaseDate: string;
  duration: string;
  label: string;
  primaryArtists: [
    {
      id: string;
      name: string;
      url: string;
      image: Image[];
      type: string;
      role: string;
    },
  ];
  featuredArtists: [];
  explicitContent: string;
  playCount: string;
  language: string;
  url: string;
  image: Image[];
};

export type ArtistInSong = {
  id: string;
  name: string;
  role: string;
  image: Image[];
  type: string;
  url: string;
};

export type TrackDetails = {
  id: string;
  name: string;
  type: string;
  year: string;
  releaseDate: string;
  duration: string;
  label: string;
  explicitContent: number;
  playCount: number;
  language: string;
  hasLyrics: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lyricsId: any;
  url: string;
  copyright: string;
  artists: {
    primary: ArtistInSong[];
    featured: ArtistInSong[];
    all: ArtistInSong[];
  };
  album: {
    id: string;
    name: string;
    url: string;
  };
  image: Image[];
  downloadUrl: Song[];
};

export type GlobalHome = {
  albums: AlbumType[];
  charts: ChartType[];
  playlists: PlaylistType[];
  trending: {
    songs: Song[];
    albums: AlbumType[];
  };
};

export type SectionType = {
  genre: string;
};

export type PlaylistById = {
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

export type AlbumById = {
  id: string;
  name: string;
  year: string;
  releaseDate: string;
  songCount: string;
  url: string;
  primaryArtistsId: string;
  primaryArtists: string;
  featuredArtists: [];
  artists: [];
  image: Image[];
  songs: TrackDetails[];
};

export type ActivityType = {
  message: string;
};

export type QueryResult = {
  id: string;
  title: string;
  image: Image[];
  url: string;
  type: string;
  description: string;
  position: number;
};

export type TopQuerySearch = {
  results: QueryResult[];
  position: number;
};

export type SongAlbumResult = {
  id: string;
  title: string;
  image: Image[];
  album: string;
  url: string;
  type: string;
  description: string;
  position: number;
  primaryArtists: string;
  singers: string;
  language: string;
};

export type SongAlbumSearch = {
  results: SongAlbumResult[];
  position: number;
};

export type AlbumResult = {
  id: string;
  title: string;
  image: Image[];
  url: string;
  type: string;
  description: string;
  position: number;
};

export type ArtistSearch = {
  results: AlbumResult[];
  position: number;
};

export type PlaylistResult = {
  id: string;
  title: string;
  image: Image[];
  url: string;
  type: string;
  language: string;
  description: string;
  position: number;
};

export type PlaylistSearch = {
  results: PlaylistResult[];
  position: number;
};

export type SearchType = {
  topQuery: TopQuerySearch;
  songs: SongAlbumSearch;
  albums: SongAlbumSearch;
  artists: ArtistSearch;
  playlists: PlaylistSearch;
};

export type UserPlaylist = {
  name: string;
  id: number;
  songs: TrackDetails[];
};

export type Queue = {
  id: string;
  name: string;
  image: boolean | Image[];
  songs: TrackDetails[];
};
