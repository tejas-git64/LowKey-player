import { PlaylistOfList } from "../../types/GlobalTypes";
import fallback from "../../assets/fallbacks/playlist-fallback.webp";
import { useNavigate } from "react-router-dom";

export default function Playlist({ id, image, name }: PlaylistOfList) {
  const navigate = useNavigate();
  return (
    <>
      <li
        key={id}
        className="group mr-4 flex h-[180px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center"
        onClick={() => navigate(`/playlists/${id}`, { replace: true })}
      >
        <img
          src={image[1]?.url || fallback}
          alt="user-profile"
          className="h-[150px] w-[150px] rounded-none shadow-md shadow-black brightness-100 transition-all ease-linear group-hover:rounded-xl group-hover:brightness-90"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
        <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs text-neutral-400 transition-colors ease-linear group-hover:text-white sm:text-sm">
          {name}
        </p>
      </li>
    </>
  );
}
