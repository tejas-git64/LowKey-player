import { memo, useMemo } from "react";
import { useBoundStore } from "../../store/store";
import { ArtistInSong } from "../../types/GlobalTypes";

export const FollowButton = memo(({ artist }: { artist: ArtistInSong }) => {
  const setFollowing = useBoundStore((state) => state.setFollowing);
  const removeFollowing = useBoundStore((state) => state.removeFollowing);
  const followings = useBoundStore((state) => state.library.followings);
  const isFollowing = useMemo(
    () => followings.some((a) => a.id === artist.id),
    [followings],
  );

  const handleFollowing = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (isFollowing) {
      removeFollowing(artist.id);
    } else {
      setFollowing(artist);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFollowing}
      className={`mx-3 rounded-sm ${isFollowing ? "px-0.5 text-emerald-500" : "border-none bg-white px-3"} py-0.5 text-sm font-semibold text-black`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
});
