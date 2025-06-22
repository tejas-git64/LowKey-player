import { TrackDetails } from "../types/GlobalTypes";

const handleCollectionPlayback = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.KeyboardEvent<Element>,
  collection: { id: string; name: string; image: any; songs: TrackDetails[] },
  isPlaying: boolean,
  setQueue: Function,
  setNowPlaying: Function,
  setIsPlaying: Function,
) => {
  e.stopPropagation();
  if (!isPlaying) {
    setQueue({
      id: collection.id,
      name: collection.name,
      image: collection.image || false,
      songs: collection.songs,
    });
    setNowPlaying(collection.songs[0]);
    setIsPlaying(true);
  } else {
    setIsPlaying(false);
  }
};
export default handleCollectionPlayback;
