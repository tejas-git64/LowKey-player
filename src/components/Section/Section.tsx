import { PlaylistOfList } from "../../types/GlobalTypes";
import Playlist from "../Playlist/Playlist";
import { memo, Suspense, useEffect, useRef, useState } from "react";
import SectionLoading from "./Loading";
import { getPlaylist } from "../../api/requests";
import { useQuery } from "@tanstack/react-query";

const Section = memo(
  ({
    genre,
    fadeOutNavigate,
  }: {
    genre: string;
    fadeOutNavigate: (str: string) => void;
  }) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    const { data } = useQuery({
      queryKey: ["genre-playlists", genre],
      queryFn: () => getPlaylist(genre),
      enabled: isIntersecting,
      refetchOnReconnect: "always",
      _optimisticResults: "isRestoring",
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
    });

    useEffect(() => {
      if (!sectionRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => setIsIntersecting(entry.isIntersecting),
        {
          rootMargin: "100px",
          threshold: 0.4,
        },
      );
      observer.observe(sectionRef.current);
      return () => {
        observer?.disconnect();
      };
    }, []);

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
            {data?.map((playlist: PlaylistOfList, i: number) => (
              <div
                key={playlist.id}
                onClick={() => fadeOutNavigate(`/playlists/${playlist.id}`)}
                className="h-full w-auto"
              >
                <Playlist
                  i={i}
                  {...playlist}
                  fadeOutNavigate={fadeOutNavigate}
                />
              </div>
            ))}
          </ul>
        </div>
      </Suspense>
    );
  },
);

export default Section;
