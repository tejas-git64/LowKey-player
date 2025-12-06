import { TrackDetails } from "../types/GlobalTypes";
import songfallback from "/fallbacks/song-fallback.webp";

export const getTrackImage = (
  images: TrackDetails["image"] | undefined,
  isMobile: boolean,
) => {
  if (!images) return songfallback;
  return isMobile
    ? images[2]?.url || songfallback
    : images[0]?.url || songfallback;
};
