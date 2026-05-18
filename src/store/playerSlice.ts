import { produce, WritableDraft } from "immer";
import { TrackDetails, SongQueue } from "../types/GlobalTypes";
import { StoreType } from "./store";

export type PlayerSliceType = {
  nowPlaying: {
    track: TrackDetails | null;
    isPlaying: boolean;
    isMobilePlayer: boolean;
    isFavorite: boolean;
    queue: SongQueue | null;
  };
  isShuffling: boolean;
  isReplay: boolean;
  revealCreation: boolean;
  creationTrack: TrackDetails | null;
  setNowPlaying: (data: TrackDetails | null) => void;
  setIsPlaying: (status: boolean) => void;
  setShowPlayer: (isShow: boolean) => void;
  setIsShuffling: (isShuffled: boolean) => void;
  setIsReplay: (replay: boolean) => void;
  setRevealCreation: (isRevealed: boolean) => void;
  setCreationTrack: (song: TrackDetails) => void;
  setQueue: (data: SongQueue) => void;
};

export const playerSlice = (set: {
  (
    nextStateOrUpdater:
      | StoreType
      | Partial<StoreType>
      | ((state: WritableDraft<StoreType>) => void),
    shouldReplace?: false,
    action?: string | { type: string; [key: string]: unknown } | undefined,
  ): void;
  (
    nextStateOrUpdater: StoreType | ((state: WritableDraft<StoreType>) => void),
    shouldReplace: true,
    action?: string | { type: string; [key: string]: unknown } | undefined,
  ): void;
}) => ({
  nowPlaying: {
    track: null,
    isPlaying: false,
    isMobilePlayer: false,
    isFavorite: false,
    queue: null,
  },
  setNowPlaying: (data: TrackDetails | null) =>
    set((state) => ({
      nowPlaying: {
        ...state.nowPlaying,
        track: data,
      },
    })),
  setIsPlaying: (status: boolean) =>
    set((state) => {
      state.nowPlaying.isPlaying = status;
    }),
  setShowPlayer: (isShow: boolean) =>
    set((state) => {
      state.nowPlaying.isMobilePlayer = isShow;
    }),
  setQueue: (data: SongQueue) =>
    set(
      produce((state) => {
        state.nowPlaying.queue = data;
      }),
    ),
  isShuffling: false,
  setIsShuffling: (isShuffled: boolean) =>
    set((state) => {
      state.isShuffling = isShuffled;
    }),
  isReplay: false,
  setIsReplay: (replay: boolean) =>
    set((state) => {
      state.isReplay = replay;
    }),
  revealCreation: false,
  setRevealCreation: (isRevealed: boolean) =>
    set((state) => {
      state.revealCreation = isRevealed;
    }),
  creationTrack: null,
  setCreationTrack: (song: TrackDetails) =>
    set((state) => {
      state.creationTrack = song;
    }),
});
