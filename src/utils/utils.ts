export const genres = [
  "indie",
  "edm",
  "metal",
  "punk",
  "party",
  "jazz",
  "love",
  "rap",
  "workout",
  "pop",
  "hiphop",
  "rock",
  "melody",
  "lofi",
  "chill",
  "focus",
  "instrumental",
  "folk",
  "devotional",
  "ambient",
  "sleep",
  "soul",
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

export const PLAYER_CONSTANTS = {
  MOBILE_BREAKPOINT: 640,
  DEFAULT_VOLUME: 0.5,
  VOLUME_THRESHOLDS: {
    MUTE: 0.1,
    MEDIUM: 0.75,
  },
};

export default function secondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours !== 0 ? (hours < 10 ? "0" + hours + ":" : hours + ":") : ""}${
    minutes < 10 ? "0" + minutes : minutes
  }:${secs < 10 ? "0" + secs : secs}`;
}
