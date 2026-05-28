import { TrackDetails } from "../types/GlobalTypes";
const songfallback = "/fallbacks/song-fallback.webp";

export const getTrackImage = (
  images: TrackDetails["image"] | undefined,
  isMobile: boolean,
) => {
  if (!images) return songfallback;
  return isMobile
    ? images[2]?.url || songfallback
    : images[0]?.url || songfallback;
};
