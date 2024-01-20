export const genres = [
  "pop",
  "hiphop",
  "love",
  "rap",
  "workout",
  "jazz",
  "rock",
  "melody",
  "lofi",
  "chill",
  "focus",
  "instrumental",
  "indie",
  "edm",
  "metal",
  "punk",
  "party",
  "folk",
  "devotional",
  "ambient",
  "sleep",
  "soul",
];

//ids for timely playlists
export const timelyData = [
  {
    id: 110858205,
    timely: "today",
  },
  {
    id: 7386899,
    timely: "weekly",
  },
  {
    id: 158206266,
    timely: "monthly",
  },
  {
    id: 1180899296,
    timely: "yearly",
  },
];

export const defaultSearchData = {
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
};

export const songData = {
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
  primaryArtists: "",
  primaryArtistsId: "",
  featuredArtists: "",
  featuredArtistsId: "",
  explicitContent: "",
  playCount: 0,
  language: "",
  hasLyrics: "",
  url: "",
  copyright: "",
  image: [
    {
      quality: "",
      link: "",
    },
    {
      quality: "",
      link: "",
    },
    {
      quality: "",
      link: "",
    },
  ],
  downloadUrl: [
    {
      quality: "",
      link: "",
    },
    {
      quality: "",
      link: "",
    },
    {
      quality: "",
      link: "",
    },
    {
      quality: "",
      link: "",
    },
    {
      quality: "",
      link: "",
    },
  ],
};

export default function secondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours !== 0 ? (hours < 10 ? "0" + hours + ":" : hours + ":") : ""}${
    minutes < 10 ? "0" + minutes : minutes
  }:${secs < 10 ? "0" + secs : secs}`;
}
