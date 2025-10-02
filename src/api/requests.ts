import { useBoundStore } from "../store/store";
import { PlaylistById } from "../types/GlobalTypes";
import { defaultSearchData } from "../utils/utils";

//Get widget data
export async function getWidgetData() {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/playlists?id=1265154514`,
    );
    const { data } = await res.json();
    return data || null;
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
    const { data } = await res.json();
    return data?.results || null;
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
    const { data } = await res.json();
    return data || null;
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
    const { data } = await res.json();
    return data || null;
  } catch (err) {
    console.error(err);
  }
};

//search query
export const getSearchResults = async (query: string) => {
  if (query !== "" && query.length >= 2) {
    try {
      const res = await fetch(
        `https://lowkey-backend.vercel.app/api/search?query=${query}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          useBoundStore.getState().setSearch(data.data);
        } else {
          useBoundStore.getState().setSearch(defaultSearchData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};

//artist details
export const getArtistDetails = async (id: string) => {
  try {
    const res = await fetch(
      `https://lowkey-backend.vercel.app/api/artists/${id}`,
    );
    const { data } = await res.json();
    return data || null;
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
    const { data } = await res.json();
    return data?.albums || null;
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
    const { data } = await res.json();
    return data?.songs || null;
  } catch (err) {
    console.error(err);
  }
};
