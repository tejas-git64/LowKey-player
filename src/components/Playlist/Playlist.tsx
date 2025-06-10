import { PlaylistOfList } from "../../types/GlobalTypes";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import { useNavigate } from "react-router-dom";

export default function Playlist({ id, image, name }: PlaylistOfList) {
  const navigate = useNavigate();
  return (
    <>
      <li
        key={id}
        className="mr-4 flex h-[180px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center"
        onClick={() => navigate(`/playlists/${id}`, { replace: true })}
      >
        <img
          src={image ? image[1].url : fallback}
          alt="user-profile"
          className="h-[150px] w-[150px] shadow-md shadow-black"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs font-semibold text-neutral-400">
          {name}
        </p>
      </li>
    </>
  );
}
