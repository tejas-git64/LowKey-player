export const sampleTrack = {
  id: "X0zxHHfs",
  name: "Track3",
  type: "song",
  year: "2023",
  releaseDate: "2023-12-01",
  duration: 217,
  label: "Music label",
  explicitContent: false,
  playCount: 401865,
  language: "english",
  hasLyrics: false,
  lyricsId: null,
  url: "some url",
  copyright: "Artist name",
  album: {
    id: "50076157",
    name: "Husn",
    url: "sample album url",
  },
  artists: {
    primary: [
      {
        id: "1431",
        name: "Artist name",
        url: "artist url",
        type: "artist",
        role: "artist",
        image: [],
      },
    ],
    featured: [
      {
        id: "1431",
        name: "Artist name",
        url: "artist url",
        type: "artist",
        role: "artist",
        image: [],
      },
    ],
    all: [
      {
        id: "1431",
        name: "Artist name",
        url: "artist url",
        type: "artist",
        role: "artist",
        image: [],
      },
    ],
  },
  image: [
    {
      quality: "50x50",
      url: "image url",
    },
  ],
  downloadUrl: [
    {
      quality: "48kbps",
      url: "https://aac.saavncdn.com/745/6adf5c70c94e8de892cb34bf52a77d9c_48.mp4",
    },
  ],
};

export const sampleSearchResults = {
  topQuery: {
    results: [
      {
        id: "568648",
        title: "Some query result",
        image: [
          {
            quality: "50x50",
            url: "artist url",
          },
          {
            quality: "150x150",
            url: "artist url",
          },
        ],
        url: "some url",
        type: "artist",
        description: "Artist",
        position: 2,
      },
    ],
    position: 0,
  },
  songs: {
    results: [
      {
        id: "Ap1mYWUe",
        title: "Track1",
        image: [
          {
            quality: "50x50",
            url: "song image url",
          },
        ],
        album: "album1",
        url: "some url",
        type: "song",
        description: "title from movie/artist",
        position: 1,
        primaryArtists: "artist1",
        singers: "singer1",
        language: "english",
      },
    ],
    position: 2,
  },
  albums: {
    results: [
      {
        id: "252208",
        title: "Encore",
        image: [
          {
            quality: "50x50",
            url: "some url",
          },
          {
            quality: "150x150",
            url: "some url",
          },
        ],
        artist: "artist",
        url: "some url",
        type: "album",
        description: "description of title/album",
        year: "2016",
        songIds:
          "4Em6uaoL, i9ydMSJr, rTpH2eN4, vntXe_9X, j8hvJDPs, Z4rNko0k, y6UMHuY0",
        language: "english",
        album: "some album",
        position: 2,
        primaryArtists: "Artist2 Artist3",
        singers: "Singer 4",
      },
    ],
    position: 1,
  },
  artists: {
    results: [
      {
        id: "625094",
        title: "Encore",
        image: [
          {
            quality: "50x50",
            url: "some url",
          },
          {
            quality: "150x150",
            url: "some url",
          },
        ],
        url: "artist url",
        type: "artist",
        description: "Singer",
        position: 1,
      },
    ],
    position: 4,
  },
  playlists: {
    results: [
      {
        id: "48667929",
        title: "Some title",
        image: [
          {
            quality: "50x50",
            url: "some url",
          },
          {
            quality: "150x150",
            url: "some url",
          },
        ],
        url: "playlist url",
        type: "playlist",
        language: "english",
        description: "Some description",
        position: 2,
      },
    ],
    position: 3,
  },
};

export const sampleSongQueue = {
  id: "Rzdqqd31",
  name: "playlist 3",
  image: false,
  songs: [sampleTrack],
};

export const sampleAlbum = {
  id: "58397429",
  name: "Album 42",
  year: "2024",
  releaseDate: "12-10-23",
  songCount: "34141",
  url: "some url",
  primaryArtistsId: "012xafSl qrqWQfx xlze1Q2",
  primaryArtists: "Artist 31 Artist 10",
  featuredArtists: [],
  artists: [],
  image: [
    {
      quality: "50x50",
      url: "image url",
    },
    {
      quality: "150x150",
      url: "image url",
    },
  ],
  songs: [sampleTrack],
};

export const samplePlaylist = {
  id: "ae5fa1Ax",
  userId: "some user id",
  name: "Playlist 13",
  followerCount: "1221",
  songCount: "20",
  fanCount: "14210",
  username: "artist 1",
  firstname: "first",
  lastname: "last",
  language: "english",
  shares: "1331",
  quality: "",
  image: [
    {
      quality: "50x50",
      url: "image url",
    },
  ],
  url: "some url",
  songs: [sampleTrack],
};

export const sampleArtistInSong = {
  id: "zcA9adw1w",
  name: "sample song",
  role: "",
  image: [
    {
      quality: "50x50",
      url: "image url",
    },
  ],
  type: "song",
  url: "https://aac.saavncdn.com/745/6adf5c70c94e8de892cb34bf52a77d9c_48.mp4",
};

export const sampleUserPlaylist = {
  name: "custom playlist",
  id: 39,
  songs: [sampleTrack],
  image: [
    {
      quality: "50x50",
      url: "image url",
    },
  ],
};

export const sampleArtist = {
  id: "1431",
  name: "Artist name",
  url: "artist url",
  type: "artist",
  followerCount: null,
  fanCount: "0",
  role: "artist",
  isVerified: null,
  dominantLanguage: null,
  dominantType: null,
  bio: null,
  dob: null,
  fb: null,
  twitter: null,
  wiki: null,
  availableLanguages: [],
  isRadioPresent: null,
  image: [
    {
      quality: "50x50",
      url: "artist-image-url",
    },
    {
      quality: "150x150",
      url: "artist-image-url",
    },
  ],
  topSongs: [],
  topAlbums: [],
  singles: [],
  similarArtists: [],
};

export const samplePlaylistOfList = {
  id: "2312321",
  i: 2,
  userId: "user_01",
  name: "Playlist 21",
  songCount: "12",
  username: "some name",
  firstname: "first",
  lastname: "last",
  language: "english",
  image: [
    {
      quality: "50x50",
      url: "image url",
    },
  ],
  url: "playlist url",
  songs: [
    {
      quality: "50x50",
      url: "",
    },
  ],
};
