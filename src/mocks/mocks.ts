import { vi } from "vitest";
import {
  samplePlaylist,
  samplePlaylistOfList,
  sampleAlbum,
  sampleArtist,
  sampleTrack,
} from "../api/samples";
import {
  PlaylistById,
  PlaylistOfList,
  AlbumById,
  TrackDetails,
} from "../types/GlobalTypes";

export const mockedDataProps = {
  isEnabled: true,
  isPending: false,
  isFetching: false,
  isError: false,
  isSuccess: true,
  status: "success",
  fetchStatus: "idle",
  error: null,
  isPaused: false,
  isFetched: true,
  isFetchedAfterMount: true,
  dataUpdatedAt: 123,
  errorUpdatedAt: 123,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  isLoading: false,
  isInitialLoading: false,
  isPlaceholderData: false,
  isRefetchError: false,
  isRefetching: false,
  isStale: false,
  isLoadingError: false,
};

export const mockedNullDataProps = {
  isSuccess: false,
  error: null,
  isEnabled: true,
  isLoadingError: false,
  isPending: true,
  isFetching: false,
  isError: false,
  status: "pending",
  fetchStatus: "idle",
  isPaused: false,
  isFetched: true,
  isFetchedAfterMount: true,
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  isPlaceholderData: false,
  isRefetchError: false,
  isRefetching: false,
  isStale: false,
  isLoading: false,
  isInitialLoading: false,
};

export const mockedWidgetData = {
  ...mockedDataProps,
  data: samplePlaylist as PlaylistById,
  promise: Promise.resolve(samplePlaylist as PlaylistById),
  refetch: vi.fn(),
};
export const obj = {
  viral: samplePlaylist as PlaylistById,
  weekly: samplePlaylist as PlaylistById,
  monthly: samplePlaylist as PlaylistById,
  latest: samplePlaylist as PlaylistById,
};
export const mockedTimelyData = {
  data: obj,
  promise: Promise.resolve(obj),
  refetch: vi.fn(),
  ...mockedDataProps,
};
export const mockedSectionData = {
  data: [samplePlaylistOfList] as PlaylistOfList[],
  promise: Promise.resolve([samplePlaylistOfList] as PlaylistOfList[]),
  refetch: vi.fn(),
  ...mockedDataProps,
};
export const mockedAlbumSuccessData = {
  data: sampleAlbum as AlbumById,
  promise: Promise.resolve(sampleAlbum as AlbumById),
  refetch: vi.fn(),
  ...mockedDataProps,
};
export const mockedArtistData = {
  data: sampleArtist,
  promise: Promise.resolve(sampleArtist),
  refetch: vi.fn(),
  ...mockedDataProps,
};

export const mockedArtistAlbumData = {
  data: [sampleAlbum] as AlbumById[],
  promise: Promise.resolve([sampleAlbum] as AlbumById[]),
  refetch: vi.fn(),
  ...mockedDataProps,
};

export const mockedArtistSongData = {
  data: [sampleTrack] as TrackDetails[],
  promise: Promise.resolve([sampleTrack] as TrackDetails[]),
  refetch: vi.fn(),
  ...mockedDataProps,
};
export const mockedPlaylistSuccessData = {
  data: samplePlaylist as PlaylistById,
  promise: Promise.resolve(samplePlaylist as PlaylistById),
  refetch: vi.fn(),
  ...mockedDataProps,
};
export const mockedNullDataResult = {
  data: null,
  promise: Promise.resolve(null),
  refetch: vi.fn(),
  ...mockedNullDataProps,
};
