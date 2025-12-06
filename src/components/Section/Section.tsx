import { PlaylistOfList } from "../../types/GlobalTypes";
import Playlist from "../Playlist/Playlist";
import { memo, useEffect, useRef, useState } from "react";
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

    const { data, isLoading } = useQuery({
      queryKey: ["section", genre],
      queryFn: () => getPlaylist(genre),
      enabled: isIntersecting,
      refetchOnReconnect: "always",
      _optimisticResults: "isRestoring",
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
    });

    const sectionData = data ?? null;

    useEffect(() => {
      if (sectionRef.current) {
        const observer = new IntersectionObserver(
          ([entry]) => setIsIntersecting(entry.isIntersecting),
          {
            rootMargin: "200px",
            threshold: 0.4,
          },
        );
        observer.observe(sectionRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }, []);

    if (isLoading) return <SectionLoading />;

    return (
      <div
        data-testid={genre}
        ref={sectionRef}
        className="flex h-auto w-full flex-col overflow-x-hidden bg-transparent py-2"
      >
        <h1 className="mb-2 px-4 text-left text-xl font-semibold capitalize text-white">
          {genre}
        </h1>
        <div
          data-testid="playlist-container"
          role="list"
          className="flex h-[180px] w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap px-4"
        >
          {sectionData?.map((playlist: PlaylistOfList, i: number) => (
            <div
              data-testid="playlist-item"
              key={playlist.id}
              role="listitem"
              onClick={() => fadeOutNavigate(`/playlists/${playlist.id}`)}
              className="h-full w-auto"
            >
              {playlist && (
                <Playlist
                  i={i}
                  {...playlist}
                  fadeOutNavigate={fadeOutNavigate}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
Section.displayName = "Section";
export default Section;
