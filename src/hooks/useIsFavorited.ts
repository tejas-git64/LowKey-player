import { useMemo } from "react";
import { useBoundStore } from "../store/store";

export default function useIsFavorited(id: string) {
  const songs = useBoundStore((state) => state.favorites.songs);
  const { isFavorited } = useMemo(() => {
    return {
      isFavorited: Boolean(songs.some((song) => song.id === id)),
    };
  }, [songs, id]);
  return isFavorited;
}
