import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import Song from "./Song";
import fallback from "../../assets/fallbacks/song-fallback.webp";
import notfav from "../../assets/svgs/icons8-heart.svg";
import fav from "../../assets/svgs/icons8-favorited.svg";
import add from "../../assets/svgs/icons8-addplaylist-28.svg";
import tick from "../../assets/svgs/tick.svg";
import { sampleTrack, sampleUserPlaylist } from "../../api/samples";
import { MemoryRouter } from "react-router-dom";
import { useBoundStore } from "../../store/store";

const useNavigateMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useNavigate: () => useNavigateMock,
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Song", () => {
  test("should render", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("song")).toBeInTheDocument();
  });
  test("should set the track and isPlaying status onClick", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    const song = screen.getByTestId("song");
    fireEvent.click(song);
    expect(useBoundStore.getState().nowPlaying.track).toEqual(sampleTrack);
    expect(useBoundStore.getState().nowPlaying.isPlaying).toBe(true);
  });
  test("should contain the track image if available", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    const image = screen.getByAltText("img") as HTMLImageElement;
    expect(image.src).toContain("image%20url");
  });
  test("should contain fallback as track image if not available", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    const image = screen.getByAltText("img") as HTMLImageElement;
    fireEvent.error(image);
    expect(image.src).toContain(fallback);
  });
  test("should contain fallback as track image if not available", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    const image = screen.getByAltText("img") as HTMLImageElement;
    fireEvent.error(image);
    expect(image.src).toContain(fallback);
  });
  test("should contain respective classes when it is a widget song", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={true} track={sampleTrack} />
      </MemoryRouter>,
    );
    const name = screen.getByTestId("name");
    const playingGif = screen.getByTestId("playing");
    const artists = screen.getByTestId("artists");
    const duration = screen.getByTestId("duration");
    expect(name).toHaveClass(
      "w-[10vw] sm:w-[18vw] md:w-[20vw] xmd:w-[22vw] lg:mr-[1vw] lg:w-[22vw] xl:w-[12.5vw] xxl:w-[13.5vw] 2xl:w-[15vw] 2xl:max-w-60",
    );
    expect(playingGif).toHaveClass(
      "mx-[1vw] flex-shrink-0 sm:hidden xmd:mx-2 xmd:block lg:hidden xlg:mx-4 xlg:block xxl:mx-5 2xl:mx-6 2xl:block",
    );
    expect(artists).toHaveClass(
      "hidden flex-shrink-0 xlg:flex xlg:w-[3.5vw] xl:w-[5vw] xxl:w-[8.5vw] 2xl:w-[10vw] 2xl:max-w-40",
    );
    expect(duration).toHaveClass(
      "mr-[1vw] w-10 flex-shrink-0 sm:ml-[4vw] sm:mr-2 md:mx-[2vw] xmd:mx-[3vw] lg:mx-[1vw] xlg:ml-[1.5vw] xxl:mx-[0.5vw] 2xl:mx-2",
    );
  });
  test("should contain respective classes when it is a widget song", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    const name = screen.getByTestId("name");
    const playingGif = screen.getByTestId("playing");
    const artists = screen.getByTestId("artists");
    const duration = screen.getByTestId("duration");
    expect(name).toHaveClass(
      "w-[40vw] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[30%] 2xl:w-60",
    );
    expect(playingGif).toHaveClass("mx-2 sm:ml-0 lg:mx-8 xl:mx-12 2xl:mx-10");
    expect(artists).toHaveClass(
      "hidden sm:mr-12 sm:inline-flex sm:w-[25%] md:mr-6 md:w-[27.5%] xmd:w-[37.5%] lg:mr-10 lg:w-[37.5%] xl:mr-[7%] xl:w-[25%] xxl:mr-[4%] xxl:w-[30%] 2xl:mr-14 2xl:w-[35%] 2xl:max-w-96",
    );
    expect(duration).toHaveClass(
      "m-[3vw] w-10 max-w-14 sm:ml-4 sm:mr-[2%] sm:block md:mx-[5%] xmd:mx-4 lg:mx-0 xlg:mx-[2vw] xl:mr-4",
    );
  });
  test("should contain track name if available", () => {
    render(
      <MemoryRouter>
        <Song index={0} isWidgetSong={false} track={sampleTrack} />
      </MemoryRouter>,
    );
    const name = screen.getByTestId("name") as HTMLParagraphElement;
    expect(name.textContent).toBe("Track3");
  });
  test("should contain track name if available", () => {
    render(
      <MemoryRouter>
        <Song
          index={0}
          isWidgetSong={false}
          track={{ ...sampleTrack, name: "" }}
        />
      </MemoryRouter>,
    );
    const name = screen.getByTestId("name") as HTMLParagraphElement;
    expect(name.textContent).toBe("Unknown track");
  });
  describe("favorite button", () => {
    test("should favorite the track onClick", async () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const favoriteBtn = screen.getByTestId(
        "favorite-btn",
      ) as HTMLButtonElement;
      act(() => {
        fireEvent.click(favoriteBtn);
      });
      expect(useBoundStore.getState().favorites.songs).toContainEqual(
        sampleTrack,
      );
      act(() => {
        useBoundStore.getState().removeFavorite(sampleTrack.id);
      });
    });
    test("should contain fav as image if favorited", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const favoriteBtn = screen.getByTestId(
        "favorite-btn",
      ) as HTMLButtonElement;
      act(() => {
        fireEvent.click(favoriteBtn);
      });
      expect((screen.getByAltText("fav-icon") as HTMLImageElement).src).toBe(
        fav,
      );
      act(() => {
        useBoundStore.getState().removeFavorite(sampleTrack.id);
      });
    });
    test("should contain notFav as image if not favorited", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      expect((screen.getByAltText("fav-icon") as HTMLImageElement).src).toBe(
        notfav,
      );
    });
  });
  describe("playlist button", () => {
    test("should set the track as creation track and revealCreation to true onClick", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const playlistBtn = screen.getByTestId(
        "playlist-btn",
      ) as HTMLButtonElement;
      act(() => {
        fireEvent.click(playlistBtn);
      });
      expect(useBoundStore.getState().creationTrack).toBe(sampleTrack);
      expect(useBoundStore.getState().revealCreation).toBe(true);
    });
    test("should contain tick as image if added to a playlist", () => {
      act(() => {
        useBoundStore.getState().setUserPlaylist(sampleUserPlaylist);
      });
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const playlistIcon = screen.getByAltText(
        "playlist-icon",
      ) as HTMLImageElement;
      expect(playlistIcon.src).toBe(tick);
      act(() => {
        useBoundStore.getState().removeUserPlaylist(sampleUserPlaylist.id);
      });
    });
    test("should contain add as image if not added to a playlist", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const playlistIcon = screen.getByAltText(
        "playlist-icon",
      ) as HTMLImageElement;
      expect(playlistIcon.src).toBe(add);
    });
  });
  describe("Artist", () => {
    test("should render", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const artist = screen.getByTestId("artist");
      expect(artist).toBeInTheDocument();
    });
    test("should navigate to the artist page onClick", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const artist = screen.getByTestId("artist");
      fireEvent.click(artist);
      expect(useNavigateMock).toHaveBeenCalledWith("/artists/1431");
    });
    test("should contain the artist's name", () => {
      render(
        <MemoryRouter>
          <Song index={0} isWidgetSong={false} track={sampleTrack} />
        </MemoryRouter>,
      );
      const artist = screen.getByTestId("artist") as HTMLParagraphElement;
      expect(artist.textContent).toBe("Artist name");
    });
    test("should contain 'Unknown Artist' as name if not available", () => {
      render(
        <MemoryRouter>
          <Song
            index={0}
            isWidgetSong={false}
            track={{
              ...sampleTrack,
              artists: {
                ...sampleTrack.artists,
                primary: [{ ...sampleTrack.artists.primary[0], name: "" }],
              },
            }}
          />
        </MemoryRouter>,
      );
      const artist = screen.getByTestId("artist") as HTMLParagraphElement;
      expect(artist.textContent).toBe("Unknown Artist");
    });
  });
});
