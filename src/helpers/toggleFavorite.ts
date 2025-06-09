import { TrackDetails } from "../types/GlobalTypes";

export function toggleFavorite({
  e,
  track,
  isFavorited,
  setFavoriteSong,
  removeFavorite,
  startTransition,
}: {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  track: TrackDetails;
  isFavorited: boolean;
  setFavoriteSong: (track: TrackDetails) => void;
  removeFavorite: (id: string) => void;
  startTransition: (cb: () => void) => void;
}) {
  e.stopPropagation();
  if (!track) return;
  if (!isFavorited) {
    startTransition(() => setFavoriteSong(track));
  } else {
    removeFavorite(track.id);
  }
}
