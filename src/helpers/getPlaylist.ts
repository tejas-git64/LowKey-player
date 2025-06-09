import { TrackDetails, UserPlaylist } from "../types/GlobalTypes";

export function getPlaylist({
  e,
  track,
  playlist,
  removeFromUserPlaylist,
  setCreationTrack,
  setRevealCreation,
  startTransition,
}: {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  track: TrackDetails;
  playlist?: UserPlaylist;
  removeFromUserPlaylist: (playlistId: number, trackId: string) => void;
  setCreationTrack: (track: TrackDetails) => void;
  setRevealCreation: (val: boolean) => void;
  startTransition: (cb: () => void) => void;
}) {
  e.stopPropagation();
  if (!track) return;
  if (playlist) {
    removeFromUserPlaylist(playlist.id, track.id);
  } else {
    startTransition(() => {
      setCreationTrack(track);
      setRevealCreation(true);
    });
  }
}
