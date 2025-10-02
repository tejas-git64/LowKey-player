import {
  describe,
  test,
  expect,
  vi,
  afterEach,
  beforeEach,
  Mock,
} from "vitest";
import * as api from "./requests";
import { useBoundStore } from "../store/store";
import { defaultSearchData } from "../utils/utils";
import {
  sampleAlbum,
  sampleArtist,
  samplePlaylist,
  sampleTrack,
} from "./samples";
import { waitFor } from "@testing-library/react";

const {
  getAlbumData,
  getArtistAlbums,
  getArtistDetails,
  getArtistSongs,
  getPlaylist,
  getPlaylistData,
  getSearchResults,
  getTimelyData,
  getWidgetData,
} = api;

const errorObj: Error = {
  name: "NetworkError",
  stack: expect.any(String),
  message: "Failed to fetch",
};

beforeEach(() => {
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function fetchSuccessWithData(fn: () => any, sampleResponse: any) {
  const mockPayload = sampleResponse;
  const mockApiResponse = { data: mockPayload };

  (fetch as Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse),
  });
  const res = await fn();
  waitFor(() => {
    expect(res).toEqual(mockPayload);
  });
}

async function fetchSuccessWithNull(fn: () => any) {
  const mockNullResponse = { message: "no data found" };

  (fetch as Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockNullResponse),
  });
  const failedRes = await fn();
  expect(failedRes).toBeNull();
}

async function fetchRejection(fn: () => Promise<any>) {
  globalThis.fetch = vi.fn().mockRejectedValueOnce(errorObj);
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const result = await fn();
  expect(result).toBeUndefined();

  expect(consoleSpy).toHaveBeenCalledWith(errorObj);
  consoleSpy.mockRestore();
}

describe("Testing APIs", () => {
  test("Requesting widget response", async () => {
    fetchSuccessWithData(getWidgetData, samplePlaylist);
    fetchSuccessWithNull(getWidgetData);
  });
  test("Widget request rejection", async () => {
    fetchRejection(getWidgetData);
  });

  test("Requesting timely data response", async () => {
    const viral = { data: samplePlaylist };
    const weekly = { data: samplePlaylist };
    const monthly = { data: samplePlaylist };
    const latest = { data: samplePlaylist };
    const response = {
      viral: viral.data,
      weekly: weekly.data,
      monthly: monthly.data,
      latest: latest.data,
    };

    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(response),
    });
    const res = await getTimelyData();
    waitFor(() => {
      expect(res).toMatchObject({
        viral: res?.viral,
        weekly: res?.weekly,
        monthly: res?.monthly,
        latest: res?.latest,
      });
    });
  });
  test("Rejection of request", async () => {
    fetchRejection(getTimelyData);
  });

  test("Requesting playlists by genres response", () => {
    fetchSuccessWithData(() => getPlaylist("pop"), samplePlaylist);
    fetchSuccessWithNull(() => getPlaylist("pop"));
  });

  test("Expecting playlists by genres error", async () => {
    fetchRejection(() => getPlaylist("edm"));
  });

  test("Requesting playlists by id", async () => {
    fetchSuccessWithData(() => getPlaylistData("02361"), samplePlaylist);
    fetchSuccessWithNull(() => getPlaylistData("02361"));
  });
  test("Expecting playlists by id error", async () => {
    fetchRejection(() => getPlaylistData(""));
  });

  test("Requesting albums by id", async () => {
    fetchSuccessWithData(() => getAlbumData("01311"), sampleAlbum);
    fetchSuccessWithNull(() => getAlbumData("01311"));
  });
  test("Expecting albums by id error", async () => {
    fetchRejection(() => getAlbumData(""));
  });

  describe("Testing getSearchResults", () => {
    const mockSetSearch = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
      useBoundStore.setState({ setSearch: mockSetSearch });
    });

    test("fetches and sets search results when data.data exists", async () => {
      const mockData = { data: [{ id: "1", title: "Song" }] };
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        }),
      ) as any;

      await getSearchResults("some query");
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("some query"));
      expect(mockSetSearch).toHaveBeenCalledWith(mockData.data);
    });

    test("sets default data when data.data is not present", async () => {
      const mockData = {};
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        }),
      ) as any;

      await getSearchResults("validQuery");
      expect(mockSetSearch).toHaveBeenCalledWith(defaultSearchData);
    });

    test("does not fetch when query is empty or less than 2 chars", async () => {
      global.fetch = vi.fn();

      await getSearchResults("");
      await getSearchResults("a");
      expect(fetch).not.toHaveBeenCalled();
    });

    test("handles fetch error gracefully", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const error = new Error("fetch failed");
      global.fetch = vi.fn(() => Promise.reject(error)) as any;

      await getSearchResults("validQuery");
      expect(consoleSpy).toHaveBeenCalledWith(error);
      consoleSpy.mockRestore();
    });
  });
  test("Expecting results by query error", async () => {
    fetchRejection(() => getSearchResults("Eminem"));
  });

  test("Requesting artists by id", async () => {
    fetchSuccessWithData(() => getArtistDetails("931242"), sampleArtist);
    fetchSuccessWithNull(() => getArtistDetails("931242"));
  });
  test("Expecting artists by id error", async () => {
    fetchRejection(() => getArtistDetails(""));
  });

  test("Requesting albums by artist id", async () => {
    const mockPayload = [sampleAlbum];
    const mockApiResponse = { data: { albums: mockPayload } };

    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    const res = await getArtistAlbums("19661");
    expect(res).toEqual(mockPayload);

    fetchSuccessWithNull(() => getArtistAlbums("19661"));
  });
  test("Expecting albums by artist id error", async () => {
    fetchRejection(() => getArtistAlbums(""));
  });

  test("Requesting songs by artist id", async () => {
    const mockPayload = [sampleTrack];
    const mockApiResponse = { data: { songs: mockPayload } };

    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    const res = await getArtistSongs("19661");
    expect(res).toEqual(mockPayload);

    fetchSuccessWithNull(() => getArtistSongs("19661"));
  });
  test("Expecting songs by artist id error", async () => {
    fetchRejection(() => getArtistSongs(""));
  });
});
