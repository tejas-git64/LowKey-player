import { useBoundStore } from "../store/store";
import { defaultSearchData } from "../utils/utils";

//Get widget data
export async function getWidgetData() {
  const res = await fetch(`https://saavn.me/playlists?id=1039424150`);
  return res.json();
}

//get default home data
export async function getMusic() {
  const res = await fetch("https://saavn.me/modules?language=english,hindi");
  return res.json();
}

//get timely music data
export async function getTimelyData(id: number, timely: string) {
  const res = await fetch(`https://saavn.me/playlists?id=${id}`);
  const playlist = await res.json();
  switch (true) {
    case timely === "today":
      useBoundStore.getState().setToday(playlist.data);
      break;
    case timely === "weekly":
      useBoundStore.getState().setWeekly(playlist.data);
      break;
    case timely === "monthly":
      useBoundStore.getState().setMonthly(playlist.data);
      break;
    case timely === "yearly":
      useBoundStore.getState().setYearly(playlist.data);
      break;
  }
}

//Genre query
export const getPlaylist = async (genre: string) => {
  const res = await fetch(`https://saavn.me/search/playlists?query=${genre}`);
  const playlist = await res.json();
  useBoundStore.getState().setGenres(genre, playlist.data.results);
};

//Playlist page request
export const getPlaylistData = async (id: string) => {
  const res = await fetch(`https://saavn.me/playlists?id=${id}`);
  if (id !== "") {
    return res.json();
  }
};
//Album page request
export const getAlbumData = async (id: string) => {
  const res = await fetch(`https://saavn.me/albums?id=${id}`);
  if (id !== "") {
    return res.json();
  }
};

//search query
export const getSearchResults = async (query: string) => {
  const res = await fetch(`https://saavn.me/search/all?query=${query}`);
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
  const res = await fetch(`https://saavn.me/artists?id=${id}`);
  if (id !== "") {
    if (res.ok) {
      return res.json();
    }
  }
};

//artist albums
export const getArtistAlbums = async (id: string) => {
  const res = await fetch(`https://saavn.me/artists/${id}/albums?page=1`);
  if (id !== "") {
    if (res.ok) {
      return res.json();
    }
  }
};

//artist songs
export const getArtistSongs = async (id: string) => {
  const res = await fetch(`https://saavn.me/artists/${id}/songs?page=1`);
  if (id !== "") {
    if (res.ok) {
      return res.json();
    }
  }
};
