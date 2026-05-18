import { PlaylistOfList } from "../../types/GlobalTypes";
import fallback from "/fallbacks/playlist-fallback.webp";
import { useEffect, useMemo, useRef } from "react";

export default function Playlist({
  id,
  image,
  name,
  i,
  fadeOutNavigate,
}: PlaylistOfList & { i: number; fadeOutNavigate: (str: string) => void }) {
  const playlistImgEl = useRef<HTMLImageElement>(null);

  const { newImage } = useMemo(() => {
    let newImage = fallback;
    if (image) {
      const obj = image.find((img) => img.quality === "150x150");
      newImage = obj?.url || fallback;
    }
    return { newImage };
  }, [image]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (playlistImgEl.current) {
        playlistImgEl.current.classList.remove("image-fadeout");
        playlistImgEl.current.classList.add("image-fadein");
      }
    }, i * 50);
    return () => clearTimeout(timer);
  }, [i]);

  return (
    <button
      data-testid="playlist"
      className="group mr-4 flex h-[180px] w-[150px] flex-shrink-0 cursor-pointer list-none flex-col items-center overflow-hidden outline-none"
      onClick={() => fadeOutNavigate(`/playlists/${id}`)}
    >
      <div className="h-[150px] w-[150px] overflow-hidden">
        <img
          ref={playlistImgEl}
          src={newImage}
          alt={name}
          loading="eager"
          fetchPriority="high"
          width={150}
          height={150}
          className="image-fadeout scale-105 shadow-md shadow-black brightness-100 transition-all ease-linear group-hover:scale-100 group-hover:brightness-90 group-focus:scale-100 group-focus:brightness-90"
          onError={(e) => (e.currentTarget.src = fallback)}
        />
      </div>
      <p className="mt-2 line-clamp-1 text-ellipsis whitespace-pre-line text-center text-xs text-neutral-400 transition-colors ease-linear group-hover:text-white group-focus:text-white">
        {name}
      </p>
    </button>
  );
}
