import { produce, WritableDraft } from "immer";
import { ActivityType, TrackDetails } from "../types/GlobalTypes";
import { StoreType } from "./store";

export type RecentSliceType = {
  recents: {
    history: TrackDetails[];
    activity: ActivityType[];
  };
  setHistory: (data: TrackDetails) => void;
  setActivity: (message: string) => void;
};

export const recentsSlice = (
  saved: RecentSliceType["recents"],
  set: {
    (
      nextStateOrUpdater:
        | StoreType
        | Partial<StoreType>
        | ((state: WritableDraft<StoreType>) => void),
      shouldReplace?: false,
      action?: string | { type: string; [key: string]: unknown } | undefined,
    ): void;
    (
      nextStateOrUpdater:
        | StoreType
        | ((state: WritableDraft<StoreType>) => void),
      shouldReplace: true,
      action?: string | { type: string; [key: string]: unknown } | undefined,
    ): void;
  },
) => ({
  recents: {
    history: saved.history,
    activity: saved.activity,
  },
  setHistory: (data: TrackDetails) =>
    set(
      produce((state) => {
        const existingIndex = state.recents.history?.findIndex(
          (song: TrackDetails) => song.id === data?.id,
        );
        if (existingIndex !== -1) {
          state.recents.history?.splice(existingIndex, 1);
        }
        state.recents.history?.unshift(data);
      }),
    ),
  setActivity: (message: string) =>
    set(
      produce((state) => {
        const existingIndex = state.recents.activity?.findIndex(
          ({ msg }: { msg: string }) => msg === message,
        );
        if (existingIndex === -1) {
          const newActivity = {
            id: crypto.randomUUID(),
            message: message,
          };
          state.recents.activity?.unshift(newActivity);
        }
      }),
    ),
});
