import { TrackDetails } from "../types/GlobalTypes";

const handleCollectionPlayback = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.KeyboardEvent<Element>,
  collection: { id: string; name: string; image: any; songs: TrackDetails[] },
  startTransition: (cb: () => void) => void,
  isPlaying: boolean,
  inQueue: boolean,
  setQueue: Function,
  setNowPlaying: Function,
  setIsPlaying: Function,
) => {
  e.stopPropagation();
  if (inQueue) setIsPlaying(!isPlaying);
  else {
    startTransition(() => {
      setQueue({
        id: collection.id,
        name: collection.name,
        image: collection.image || false,
        songs: collection.songs,
      });
      setNowPlaying(collection.songs[0]);
    });
    if (isPlaying) return;
    setIsPlaying(!isPlaying);
  }
};
export default handleCollectionPlayback;
