import { PlaylistOfList } from "../../types/GlobalTypes";
import Playlist from "../Playlist/Playlist";
import { useBoundStore } from "../../store/store";
import { memo, Suspense, useEffect, useRef, useState } from "react";
import SectionLoading from "./Loading";
import { getPlaylist } from "../../api/requests";

const Section = memo(({ genre }: { genre: string }) => {
  const playlists = useBoundStore((state) => state.home.genres[genre]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    let observer = null;
    if (!isFetched) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (playlists.length === 0 && entry.isIntersecting) {
            setIsFetched(true);
            getPlaylist(genre);
          }
        },
        {
          rootMargin: "100px",
          threshold: 0.4,
        },
      );
      observer.observe(sectionRef.current);
    }
    return () => {
      observer?.disconnect();
    };
  }, [isFetched]);

  return (
    <Suspense fallback={<SectionLoading />}>
      <div
        ref={sectionRef}
        className="flex h-auto w-full flex-col overflow-x-hidden bg-transparent py-2"
      >
        <h1 className="mb-2 px-4 text-left text-xl font-semibold capitalize text-white">
          {genre}
        </h1>
        <ul className="flex h-[180px] w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap px-4">
          {playlists.map(({ id, image, name }: PlaylistOfList) => (
            <Playlist
              id={id}
              key={id}
              userId={""}
              name={name}
              songCount={""}
              username={""}
              firstname={""}
              lastname={""}
              language={""}
              image={image}
              url={""}
              songs={[]}
            />
          ))}
        </ul>
      </div>
    </Suspense>
  );
});

export default Section;
