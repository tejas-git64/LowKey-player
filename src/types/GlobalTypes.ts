export type Song = {
  quality: string;
  link: string;
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
  songs: TrackDetails[];
};

export type PlaylistType = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  type: string;
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
  url: string;
  songs: Song[];
};

export type ChartType = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
  url: string;
  firstname: string;
  explicitContent: string;
  language: string;
};

export type ArtistType = {
  id: string;
  name: string;
  url: string;
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
      image:
        | [
            {
              quality: string;
              link: string;
            },
            {
              quality: string;
              link: string;
            },
            {
              quality: string;
              link: string;
            },
          ]
        | boolean;
      type: string;
      role: string;
    },
  ];
  featuredArtists: [];
  explicitContent: string;
  playCount: string;
  language: string;
  url: string;
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
};

export type TrackDetails = {
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
  primaryArtists: string;
  primaryArtistsId: string;
  featuredArtists: string;
  featuredArtistsId: string;
  explicitContent: number;
  playCount: number;
  language: string;
  hasLyrics: string;
  url: string;
  copyright: string;
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
  downloadUrl: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
};

export type GlobalHome = {
  albums: AlbumType[];
  charts: ChartType[];
  playlists: PlaylistType[];
  trending: {
    songs: [
      {
        quality: string;
        link: string;
      },
      {
        quality: string;
        link: string;
      },
      {
        quality: string;
        link: string;
      },
      {
        quality: string;
        link: string;
      },
      {
        quality: string;
        link: string;
      },
    ];
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
  songs: TrackDetails[];
};

export type ActivityType = {
  message: string;
};

export type QueryResult = {
  id: string;
  title: string;
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
  image: [
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
    {
      quality: string;
      link: string;
    },
  ];
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
  image:
    | [
        {
          quality: string;
          link: string;
        },
        {
          quality: string;
          link: string;
        },
        {
          quality: string;
          link: string;
        },
      ]
    | boolean;
  songs: TrackDetails[];
};
