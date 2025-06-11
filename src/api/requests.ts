import { useBoundStore } from "../store/store";
import { defaultSearchData } from "../utils/utils";

//Get widget data
export async function getWidgetData() {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/playlists?id=47599074`,
    {
      method: "GET",
      mode: "cors",
    },
  );
  return res.json();
}

//get timely music data
export async function getTimelyData(id: number, timely: string) {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/playlists?id=${id}`,
  );
  const playlist = await res.json();
  switch (true) {
    case timely === "viral":
      useBoundStore.getState().setViral(playlist.data);
      break;
    case timely === "weekly":
      useBoundStore.getState().setWeekly(playlist.data);
      break;
    case timely === "monthly":
      useBoundStore.getState().setMonthly(playlist.data);
      break;
    case timely === "latest":
      useBoundStore.getState().setLatest(playlist.data);
      break;
  }
}

//Genre query
export const getPlaylist = async (genre: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/search/playlists?query=${genre}`,
  );
  const playlist = await res.json();
  useBoundStore.getState().setGenres(genre, playlist.data.results);
};

//Playlist page request
export const getPlaylistData = async (id: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/playlists?id=${id}`,
  );
  if (id !== "") {
    return res.json();
  }
};
//Album page request
export const getAlbumData = async (id: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/albums?id=${id}`,
  );
  if (id !== "") {
    return res.json();
  }
};

//search query
export const getSearchResults = async (query: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/search?query=${query}`,
  );
  const searchresults = await res.json();
  if (query !== "" && query.length >= 2) {
    if (res.ok && searchresults.data) {
      useBoundStore.getState().setSearch(searchresults.data);
    } else {
      useBoundStore.getState().setSearch(defaultSearchData);
    }
  } else {
    useBoundStore.getState().setSearch(defaultSearchData);
  }
};

//artist details
export const getArtistDetails = async (id: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/artists/${id}`,
  );
  if (id !== "") {
    if (res.ok) {
      return res.json();
    }
  }
};

//artist albums
export const getArtistAlbums = async (id: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/artists/${id}/albums?page=0`,
  );
  if (id !== "") {
    if (res.ok) {
      return res.json();
    }
  }
};

//artist songs
export const getArtistSongs = async (id: string) => {
  const res = await fetch(
    `https://lowkey-backend.vercel.app/api/artists/${id}/songs?page=0`,
  );
  if (id !== "") {
    if (res.ok) {
      return res.json();
    }
  }
};
