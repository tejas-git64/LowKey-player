import { PlaylistOfList } from "../../types/GlobalTypes";
import Playlist from "../Playlist/Playlist";
import { memo, Suspense, useEffect, useRef, useState } from "react";
import SectionLoading from "./Loading";
import { getPlaylist } from "../../api/requests";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

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

    const query = useQuery({
      queryKey: ["section", genre],
      queryFn: () => getPlaylist(genre),
      enabled: isIntersecting,
      refetchOnReconnect: "always",
      _optimisticResults: "isRestoring",
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
    }) as UseQueryResult<PlaylistOfList[] | null> | undefined;

    const data = query?.data ?? null;

    useEffect(() => {
      if (sectionRef.current) {
        const observer = new IntersectionObserver(
          ([entry]) => setIsIntersecting(entry.isIntersecting),
          {
            rootMargin: "100px",
            threshold: 0.4,
          },
        );
        observer.observe(sectionRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }, []);

    return (
      <Suspense fallback={<SectionLoading />}>
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
            className="flex h-[180px] w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap px-4"
          >
            {data?.map((playlist: PlaylistOfList, i: number) => (
              <div
                data-testid="playlist-item"
                key={playlist.id}
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
      </Suspense>
    );
  },
);

export default Section;
