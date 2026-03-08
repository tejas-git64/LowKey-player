import { WritableDraft } from "immer";
import { SearchType } from "../types/GlobalTypes";
import { StoreType } from "./store";

export type SearchSliceType = {
  search: SearchType;
  setSearch: (data: SearchType) => void;
};

export const searchSlice = (set: {
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
}) =>
  ({
    search: {
      topQuery: null,
      songs: null,
      albums: null,
      artists: null,
      playlists: null,
    },
    setSearch: (data: SearchType) =>
      set((state) => {
        state.search = data;
      }),
  }) as SearchSliceType;
