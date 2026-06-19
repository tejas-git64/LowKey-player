import { memo, useMemo } from "react";
import { useBoundStore } from "../../store/store";
import { ArtistInSong } from "../../types/GlobalTypes";

const FollowButton = memo(({ artist }: { artist: ArtistInSong }) => {
  const setFollowing = useBoundStore((state) => state.setFollowing);
  const removeFollowing = useBoundStore((state) => state.removeFollowing);
  const followings = useBoundStore((state) => state.library.followings);
  const isFollowing = useMemo(
    () => followings.some((a) => a.id === artist.id),
    [followings, artist.id],
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
      tabIndex={0}
      onClick={handleFollowing}
      className={`rounded-sm ${isFollowing ? "text-emerald-500 ring-emerald-500" : "bg-neutral-300 ring-transparent hover:bg-white"} transition-ring px-3 py-1 text-sm font-semibold text-black outline-none ring-2 transition-colors duration-150 ease-in focus:ring-2 focus:ring-emerald-500`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
});
FollowButton.displayName = "FollowButton";

export default FollowButton;
