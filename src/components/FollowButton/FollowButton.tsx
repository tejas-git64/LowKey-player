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
      className={`w-[85px] rounded-sm ${isFollowing ? "text-emerald-500 outline outline-1" : "bg-neutral-300 outline-none hover:bg-white"} transition-outline duration-1500 px-3 py-1.5 text-sm font-semibold text-black transition-colors ease-in`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
});
