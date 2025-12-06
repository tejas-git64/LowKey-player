import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import PlaylistModal from "./PlaylistModal";
import { useBoundStore } from "../../store/store";
import { createRef } from "react";
import userEvent from "@testing-library/user-event";
import { sampleTrack } from "../../api/samples";
import Layout from "../../pages/Layout/Layout";
import { MemoryRouter } from "react-router-dom";

const ref = createRef<HTMLDivElement | null>();

const { setRevealCreation, setCreationTrack, setToUserPlaylist } =
  useBoundStore.getState();

afterEach(() => {
  act(() => {
    const playlist = useBoundStore.getState().library.userPlaylists[0];
    if (playlist) useBoundStore.getState().removeUserPlaylist(playlist.id);
  });
  vi.useRealTimers();
  cleanup();
});

afterAll(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("Playlist Modal", () => {
  test("should render", () => {
    render(<PlaylistModal ref={ref} />);
    expect(screen.getByTestId("playlist-modal")).toBeInTheDocument();
  });
  test("should toggle display styles if revealCreation toggles", async () => {
    expect(useBoundStore.getState().revealCreation).toBe(false);
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    const playlistModal = screen.getByTestId(
      "playlist-modal",
    ) as HTMLDivElement;
    expect(playlistModal).toHaveClass("hidden");
    act(() => {
      setRevealCreation(true);
    });
    await waitFor(() => {
      expect(useBoundStore.getState().revealCreation).toBe(true);
      const modal = screen.getByTestId("playlist-modal");
      expect(modal).not.toBeNull();
      expect(modal).toHaveClass("flex");
    });
  });
  test("should hide the modal on clicking the close button", () => {
    render(<PlaylistModal ref={ref} />);
    act(() => {
      fireEvent.click(screen.getByTestId("close-btn"));
    });
    waitFor(() => {
      expect(screen.getByTestId("playlist-modal")).not.toBeInTheDocument();
    });
  });
  describe("input element", () => {
    test("should set the playlist name onChange", () => {
      render(<PlaylistModal ref={ref} />);
      const input = screen.getByPlaceholderText("Playlist name here..");
      (input as HTMLInputElement).value = "new name";
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("Playlist name here.."));
      });
      const newInput = screen.getByPlaceholderText("Playlist name here..");
      expect((newInput as HTMLInputElement).value).toBe("new name");
    });
    describe("should create a new playlist onKeyDown", () => {
      test("using Enter key", async () => {
        render(<PlaylistModal ref={ref} />);
        expect(useBoundStore.getState().library.userPlaylists.length).toBe(0);
        const input = screen.getByPlaceholderText(
          "Playlist name here..",
        ) as HTMLInputElement;
        await userEvent.type(input, "new playlist{enter}");
        expect(input.value).toBe("");
        expect(
          useBoundStore.getState().library.userPlaylists.length,
        ).toBeGreaterThan(0);
      });
      test("should alert if a playlist already exists", async () => {
        const alertMock = vi
          .spyOn(globalThis, "alert")
          .mockImplementation(() => {});
        render(<PlaylistModal ref={ref} />);
        const input = screen.getByPlaceholderText("Playlist name here..");
        (input as HTMLInputElement).value = "Jukebox";
        userEvent.keyboard("{Enter}");
        act(() => {
          useBoundStore
            .getState()
            .createNewUserPlaylist((input as HTMLInputElement).value, 12);
        });
        await userEvent.type(input, "Jukebox{enter}");
        expect(useBoundStore.getState().library.userPlaylists.length).toBe(1);

        await userEvent.clear(input);
        await userEvent.type(input, "Jukebox{enter}");

        expect(useBoundStore.getState().library.userPlaylists.length).toBe(1);
        expect(alertMock).toHaveBeenCalledWith(
          "Playlist Jukebox already exists",
        );
      });
    });
    test("should not to create playlist if other keys are pressed", () => {
      render(<PlaylistModal ref={ref} />);
      const input = screen.getByPlaceholderText("Playlist name here..");
      (input as HTMLInputElement).value = "Jukebox";
      userEvent.keyboard("f");
      expect(useBoundStore.getState().library.userPlaylists.length).toBe(0);
    });
  });
  test("create playlist button should create a new playlist on click", () => {
    render(<PlaylistModal ref={ref} />);
    const btn = screen.getByTestId("create-playlist-btn");
    const input = screen.getByPlaceholderText("Playlist name here..");
    (input as HTMLInputElement).value = "new playlist";
    act(() => {
      fireEvent.click(btn);
    });
    waitFor(() => {
      expect(useBoundStore.getState().library.userPlaylists[0].name).toBe(
        (input as HTMLInputElement).value,
      );
    });
  });
  describe("userplaylists", () => {
    test("should render container only if a creation track exists", () => {
      render(<PlaylistModal ref={ref} />);
      act(() => {
        setCreationTrack(sampleTrack);
      });
      waitFor(() => {
        expect(
          screen.getByTestId("userplaylists-container"),
        ).toBeInTheDocument();
      });
    });
    test("should contain the respective playlist name", () => {
      render(<PlaylistModal ref={ref} />);
      act(() => {
        useBoundStore.getState().createNewUserPlaylist("Something", 21);
      });
      waitFor(() => {
        expect(screen.getByText("Something")).toBeInTheDocument();
      });
    });
    describe("should have it's input checkbox", () => {
      test("checked if the creation track is in that playlist", () => {
        render(<PlaylistModal ref={ref} />);
        act(() => {
          useBoundStore.getState().createNewUserPlaylist("Huhhhh", 121);
          setCreationTrack(sampleTrack);
        });
        waitFor(() => {
          const checkbox = document.getElementById(
            "new-playlist-121",
          ) as HTMLInputElement;
          expect(checkbox.checked).toBe(true);
        });
      });
      describe("setPlaylist function behavior", () => {
        const mockSetToUserPlaylist = vi.fn();
        const mockRemoveFromUserPlaylist = vi.fn();
        beforeEach(() => {
          mockSetToUserPlaylist.mockClear();
          mockRemoveFromUserPlaylist.mockClear();
        });

        test("calls setToUserPlaylist when checked and creationTrack exists", async () => {
          render(<PlaylistModal ref={ref} />);
          act(() => {
            useBoundStore.getState().createNewUserPlaylist("Bruh", 12);
          });
          const checkbox = document.getElementById(`new-playlist-${12}`);
          if (checkbox) {
            act(() => {
              userEvent.click(checkbox);
            });
            waitFor(() => {
              expect(mockSetToUserPlaylist).toHaveBeenCalledWith(
                sampleTrack,
                9,
              );
              expect(mockRemoveFromUserPlaylist).not.toHaveBeenCalled();
              expect(checkbox).toBeChecked();
            });
          }
        });

        test("calls removeFromUserPlaylist when unchecked and creationTrack exists", async () => {
          render(<PlaylistModal ref={ref} />);
          act(() => {
            useBoundStore.getState().createNewUserPlaylist("Bruh", 123);
          });
          const checkbox = document.getElementById(
            `new-playlist-${123}`,
          ) as HTMLElement;

          userEvent.click(checkbox);
          userEvent.click(checkbox);
          waitFor(() => {
            expect(mockRemoveFromUserPlaylist).toHaveBeenCalledWith(
              sampleTrack,
              8,
            );
            expect(checkbox).not.toBeChecked();
          });
        });

        test("does nothing when creationTrack is null", async () => {
          render(<PlaylistModal ref={ref} />);
          act(() => {
            useBoundStore.getState().createNewUserPlaylist("Hmmm", 13);
          });
          const checkbox = document.getElementById(
            `new-playlist-${13}`,
          ) as HTMLElement;

          act(() => {
            userEvent.click(checkbox);
          });
          waitFor(() => {
            expect(mockSetToUserPlaylist).not.toHaveBeenCalled();
            expect(mockRemoveFromUserPlaylist).not.toHaveBeenCalled();
            expect(checkbox).not.toBeChecked();
          });
        });
      });
      test("unchecked if the creation track is in not that playlist", () => {
        render(<PlaylistModal ref={ref} />);
        act(() => {
          useBoundStore.getState().createNewUserPlaylist("Monday", 84);
        });

        const checkbox = document.getElementById(
          "new-playlist-84",
        ) as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
      });
      test("set the creation track to it's playlist if checked", async () => {
        const newTrack = {
          ...sampleTrack,
          id: "12",
        };
        render(<PlaylistModal ref={ref} />);
        act(() => {
          setCreationTrack(newTrack);
          useBoundStore.getState().createNewUserPlaylist("Bruhhh", 19);
          useBoundStore.getState().setRevealCreation(true);
        });
        expect(useBoundStore.getState().creationTrack).toEqual(newTrack);
        expect(useBoundStore.getState().creationTrack).toBeDefined();
        const checkbox = document.getElementById(
          "new-playlist-19",
        ) as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
        await userEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
        expect(
          useBoundStore.getState().library.userPlaylists[0].songs,
        ).toContainEqual(newTrack);
      });
      test("remove the creation track from it's playlist if unchecked", async () => {
        const newTrack = {
          ...sampleTrack,
          id: "42",
        };
        render(<PlaylistModal ref={ref} />);
        act(() => {
          setCreationTrack(newTrack);
          useBoundStore.getState().createNewUserPlaylist("Okaayyy", 15);
          setToUserPlaylist(newTrack, 15);
        });
        const checkbox = document.getElementById(
          "new-playlist-15",
        ) as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
        expect(useBoundStore.getState().creationTrack).toEqual(newTrack);

        await userEvent.click(checkbox);

        expect(checkbox.checked).toBe(false);
        expect(
          useBoundStore.getState().library.userPlaylists[0].songs,
        ).not.toContainEqual(newTrack);
      });
    });
  });
  test("should render all existing playlists", () => {
    render(<PlaylistModal ref={ref} />);
    expect(screen.getByText("No current playlists")).toBeInTheDocument();
    act(() => {
      useBoundStore.getState().createNewUserPlaylist("Finally", 100);
    });
    waitFor(() => {
      expect(screen.getByTestId("userplaylists").childElementCount).toBe(1);
      expect(screen.getAllByTestId("custom playlist").length).toBe(1);
    });
  });
});
