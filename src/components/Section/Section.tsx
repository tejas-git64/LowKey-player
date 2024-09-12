import { PlaylistOfList, SectionType } from "../../types/GlobalTypes";
import Playlist from "../Playlist/Playlist";
import { useBoundStore } from "../../store/store";
import { Suspense, useEffect, useRef } from "react";
import SectionLoading from "./Loading";
import { getPlaylist } from "../../api/requests";
export default function Section({ genre }: SectionType) {
  const options = {
    // rootMargin: "240px",
    threshold: 1.0,
  };
  const playlist = useBoundStore((state) => state.home.genres[genre]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const callbackFunction = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        if (playlist.length < 1) {
          getPlaylist(genre);
        }
      }
    };
    const observer: IntersectionObserver = new IntersectionObserver(
      callbackFunction,
      options,
    );
    if (observer && sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (observer) observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PlaylistComponent = () => {
    return (
      <div
        ref={sectionRef}
        className="flex h-auto w-full flex-col overflow-x-hidden bg-transparent py-2 pb-0"
      >
        <h1 className="px-4 pb-1 text-left text-xl font-semibold capitalize text-white">
          {genre}
        </h1>
        <ul className="flex h-[200px] w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap p-4 py-2">
          {playlist.map(({ id, image, name }: PlaylistOfList) => (
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
    );
  };

  const DataComponent = () => {
    if (!playlist) {
      throw new Promise((resolve) => setTimeout(resolve, 0));
    } else {
      return <PlaylistComponent />;
    }
  };

  return (
    <Suspense fallback={<SectionLoading />}>
      <DataComponent />
    </Suspense>
  );
}
