import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from "vitest";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { MemoryRouter, useLocation, useParams } from "react-router-dom";
import { AlbumById, ArtistType, TrackDetails } from "../../types/GlobalTypes";
import { sampleAlbum, sampleArtist, sampleTrack } from "../../api/samples";
import artistfallback from "../../assets/fallbacks/artist-fallback.png";
import albumfallback from "../../assets/fallbacks/playlist-fallback.webp";
import ArtistPage, {
  ArtistAlbums,
  ArtistInfo,
  ArtistSongs,
} from "./ArtistPage";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistSongs,
} from "../../api/requests";
import {
  mockedArtistData,
  mockedArtistAlbumData,
  mockedArtistSongData,
  mockedDataProps,
} from "../../mocks/mocks.test";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Mock),
    useParams: vi.fn(),
  };
});
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Mock),
    useQuery: vi.fn(),
  };
});
const id = "652969";
const mockedUseQuery = vi.mocked(useQuery);
const mockedUseParams = vi.mocked(useParams);

beforeEach(() => {
  vi.useFakeTimers();
  globalThis.fetch = vi.fn();
  mockedUseParams.mockReturnValue({ id: id });
  mockedUseQuery.mockImplementation((options) => {
    const queryKey = options.queryKey[0];

    switch (queryKey) {
      case "artistdetails":
        return mockedArtistData as unknown as UseQueryResult<ArtistType>;

      case "artistalbums":
        return mockedArtistAlbumData as UseQueryResult<AlbumById[]>;

      case "artistsongs":
        return mockedArtistSongData as UseQueryResult<TrackDetails[]>;

      default:
        return {
          promise: Promise.resolve([sampleAlbum] as AlbumById[]),
          refetch: vi.fn(),
          data: [sampleAlbum],
          ...mockedDataProps,
        } as UseQueryResult<AlbumById[]>;
    }
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ArtistPage", () => {
  test("should render", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/artists/${id}`]}>
          <ArtistPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    vi.advanceTimersByTime(150);
    const artistPage = screen.getByTestId("artist-page");

    expect(artistPage).toBeInTheDocument();
    expect(artistPage).toHaveClass("home-fadein");
    expect(artistPage).not.toHaveClass("home-fadeout");
  });
  describe("ArtistInfo", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistInfo id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("artist-info")).toBeInTheDocument();
    });
    test("getArtistDetails should call url and return response", async () => {
      const mockApiResponse = { data: sampleArtist };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getArtistDetails(id);

      expect(fetch).toHaveBeenCalledWith(
        `https://lowkey-backend.vercel.app/api/artists/${id}`,
      );
      expect(result).toEqual(sampleArtist);
    });
    describe("artist image", () => {
      test("should render", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={[`/artists/${id}`]}>
              <ArtistInfo id={id} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        expect(screen.getByAltText("artist-image")).toHaveClass(
          "image-fadeout",
        );
        fireEvent.load(screen.getByAltText("artist-image"));
        expect(screen.getByAltText("artist-image")).toHaveClass("image-fadein");
      });
      test("should be artistfallback onError", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={[`/artists/${id}`]}>
              <ArtistInfo id={id} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        const image = screen.getByAltText("artist-image");
        fireEvent.error(image);
        expect((image as HTMLImageElement).src).toContain(artistfallback);
      });
      describe("getArtistImage", () => {
        test("should return the image url if found", () => {
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={[`/artists/${id}`]}>
                <ArtistInfo id={id} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          const image = screen.getByAltText("artist-image");
          fireEvent.load(image);
          expect(image).toBeInTheDocument();
          expect(sampleArtist.image).toBeDefined();
          expect((image as HTMLImageElement).src).toContain("artist-image-url");
        });
        test("should return artistfallback if image is not found", () => {
          mockedUseQuery.mockReturnValue({
            ...mockedArtistData,
            data: { ...sampleArtist, image: [] },
          } as unknown as UseQueryResult<ArtistType>);
          render(
            <QueryClientProvider client={new QueryClient()}>
              <MemoryRouter initialEntries={[`/artists/${id}`]}>
                <ArtistInfo id={id} />
              </MemoryRouter>
            </QueryClientProvider>,
          );
          const image = screen.getByAltText("artist-image");
          fireEvent.load(image);
          expect((image as HTMLImageElement).src).toContain(artistfallback);
        });
      });
      test("handleImageLoad should toggle fadein classes", () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={[`/artists/${id}`]}>
              <ArtistInfo id={id} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
        vi.advanceTimersByTime(150);

        const artistInfo = screen.getByTestId("artist-info");
        const artistImage = screen.getByAltText("artist-image");
        const artistTitle = screen.getByTestId("artist-title");

        expect(artistInfo).toHaveClass("home-fadeout");
        expect(artistImage).toHaveClass("image-fadeout");
        expect(artistTitle).toHaveClass("song-fadeout");
        expect(artistInfo).not.toHaveClass("home-fadein");
        expect(artistImage).not.toHaveClass("image-fadein");
        expect(artistTitle).not.toHaveClass("song-fadein");

        fireEvent.load(artistImage);

        waitFor(() => {
          expect(artistInfo).toHaveClass("home-fadein");
          expect(artistImage).toHaveClass("image-fadein");
          expect(artistTitle).toHaveClass("song-fadein");
          expect(artistInfo).not.toHaveClass("home-fadeout");
          expect(artistImage).not.toHaveClass("image-fadeout");
          expect(artistTitle).not.toHaveClass("song-fadeout");
        });
      });
    });
    test('should show name if present else "Unknown Artist"', () => {
      const { unmount } = render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistInfo id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("artist-title").textContent).toBe(
        "Artist name",
      );
      unmount();

      mockedUseQuery.mockReturnValue({
        ...mockedArtistData,
        data: {} as ArtistType,
      } as unknown as UseQueryResult<ArtistType>);

      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistInfo id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(screen.getByTestId("artist-title").textContent).toBe(
        "Unknown Artist",
      );
    });
  });
  describe("ArtistAlbums", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistAlbums id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("artist-albums")).toBeInTheDocument();
    });
    test("getArtistAlbums should call url and return response", async () => {
      const mockAlbums = [sampleAlbum];
      const mockApiResponse = { data: { albums: mockAlbums } };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getArtistAlbums(id);

      expect(fetch).toHaveBeenCalledWith(
        `https://lowkey-backend.vercel.app/api/artists/${id}/albums?page=0`,
      );
      expect(result).toEqual(mockAlbums);
    });
    test("should render individual Albums if data is present", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistAlbums id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.getByTestId("artist-album")).toBeInTheDocument();
    });
    test("should navigate to the albums path with its id", () => {
      const { result } = renderHook(() => useLocation(), {
        wrapper: MemoryRouter,
      });
      const path = result.current.pathname;
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]} initialIndex={0}>
            <ArtistAlbums id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      waitFor(() => {
        expect(path).toBe(`/artists/${id}`);
      });

      const listitem = screen.getByTestId("artist-album");
      expect(listitem).toBeInTheDocument();

      fireEvent.click(listitem);

      waitFor(() => {
        expect(path).toBe(`/albums/${id}`);
      });
    });
    test("should not render individual Albums if data is not present", () => {
      mockedUseQuery.mockReturnValue({
        ...mockedArtistAlbumData,
        data: undefined,
      } as UseQueryResult<AlbumById[]>);
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistAlbums id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(screen.queryByTestId("albums-container")).toBeNull();
    });
    test("getAlbumImage should get the image url if available else return albumfallback", () => {
      const { unmount } = render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistAlbums id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const image = screen.getByAltText("artist-album-image");
      expect(image).toBeInTheDocument();
      expect((image as HTMLImageElement).src).toContain("image%20url");

      unmount();

      mockedUseQuery.mockReturnValue({
        ...mockedArtistAlbumData,
        data: [{ ...sampleAlbum, image: [] }],
      } as UseQueryResult<AlbumById[]>);

      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistAlbums id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const newImage = screen.getByAltText("artist-album-image");
      expect(newImage).toBeInTheDocument();
      waitFor(() => {
        expect((newImage as HTMLImageElement).src).toContain(albumfallback);
      });
    });
  });
  describe("ArtistSongs", () => {
    test("should render", () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={[`/artists/${id}`]}>
            <ArtistSongs id={id} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      vi.advanceTimersByTime(150);
      expect(screen.getByTestId("artist-songs")).toBeInTheDocument();
    });
    test("getArtistSongs should call url and return response", async () => {
      const mockSongs = [sampleTrack];
      const mockApiResponse = { data: { songs: mockSongs } };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getArtistSongs(id);

      expect(fetch).toHaveBeenCalledWith(
        `https://lowkey-backend.vercel.app/api/artists/${id}/songs?page=0`,
      );
      expect(result).toEqual(mockSongs);
    });
  });
});
