import { useBoundStore } from "../store/store";
import { PlaylistById } from "../types/GlobalTypes";
import { defaultSearchData } from "../utils/utils";

//Get widget data
export async function getWidgetData() {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/playlists?id=47599074`,
      {
        method: "GET",
        mode: "cors",
      },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
  }
}

//get timely music data
export async function getTimelyData() {
  try {
    const [res1, res2, res3, res4] = await Promise.all([
      fetch("https://lowkey-backend.vercel.app/api/playlists?id=1223482895"),
      fetch("https://lowkey-backend.vercel.app/api/playlists?id=2252904"),
      fetch("https://lowkey-backend.vercel.app/api/playlists?id=158206266"),
      fetch("https://lowkey-backend.vercel.app/api/playlists?id=1210453303"),
    ]);
    const viral = await res1.json();
    const weekly = await res2.json();
    const monthly = await res3.json();
    const latest = await res4.json();
    return {
      viral: viral.data as PlaylistById,
      weekly: weekly.data as PlaylistById,
      monthly: monthly.data as PlaylistById,
      latest: latest.data as PlaylistById,
    };
  } catch (err) {
    console.error(err);
  }
}

//Genre query
export const getPlaylist = async (genre: string) => {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/search/playlists?query=${genre}`,
    );
    const playlist = await res.json();
    return playlist.data.results;
  } catch (err) {
    console.error(err);
  }
};

//Playlist page request
export const getPlaylistData = async (id: string) => {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/playlists?id=${id}`,
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
  }
};
//Album page request
export const getAlbumData = async (id: string) => {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/albums?id=${id}`,
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
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
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/artists/${id}`,
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
  }
};

//artist albums
export const getArtistAlbums = async (id: string) => {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/artists/${id}/albums?page=0`,
    );
    const data = await res.json();
    return data.data.albums;
  } catch (err) {
    console.error(err);
  }
};

//artist songs
export const getArtistSongs = async (id: string) => {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/artists/${id}/songs?page=0`,
    );
    const data = await res.json();
    return data.data.songs;
  } catch (err) {
    console.error(err);
  }
};
