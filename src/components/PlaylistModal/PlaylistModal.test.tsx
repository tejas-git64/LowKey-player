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
import { sampleTrack, sampleUserPlaylist } from "../../api/samples";

const ref = createRef<HTMLDivElement | null>();

const { setRevealCreation, setCreationTrack, setToUserPlaylist } =
  useBoundStore.getState();

afterEach(() => {
  act(() => {
    const playlist = useBoundStore.getState().library.userPlaylists[0];
    playlist && useBoundStore.getState().removeUserPlaylist(playlist.id);
  });
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
  test("should toggle display styles if revealCreation toggles", () => {
    expect(useBoundStore.getState().revealCreation).toBe(false);
    render(<PlaylistModal ref={ref} />);

    const playlistModal = screen.getByTestId("playlist-modal");
    expect(playlistModal).toHaveClass("hidden");
    act(() => {
      setRevealCreation(true);
    });
    waitFor(() => {
      expect(useBoundStore.getState().revealCreation).toBe(true);
      expect(ref.current).toBeInTheDocument();
      expect(ref.current?.classList).toHaveClass("flex");
      expect(ref.current?.style.overflow).toBe("hidden");
    });
  });
  test("should hide the modal on clicking the close button", () => {
    render(<PlaylistModal ref={ref} />);
    fireEvent.click(screen.getByTestId("close-btn"));
    waitFor(() => {
      expect(screen.getByTestId("playlist-modal")).not.toBeInTheDocument();
    });
  });
  describe("input element", () => {
    test("should set the playlist name onChange", () => {
      render(<PlaylistModal ref={ref} />);
      const input = screen.getByPlaceholderText(
        "Playlist name here..",
      ) as HTMLInputElement;
      input.value = "new name";
      act(() => {
        fireEvent.change(
          screen.getByPlaceholderText(
            "Playlist name here..",
          ) as HTMLInputElement,
        );
      });
      expect(
        (
          screen.getByPlaceholderText(
            "Playlist name here..",
          ) as HTMLInputElement
        ).value,
      ).toBe("new name");
    });
    describe("should create a new playlist onKeyDown", () => {
      test("using Enter key", () => {
        render(<PlaylistModal ref={ref} />);
        expect(useBoundStore.getState().library.userPlaylists.length).toBe(0);
        const input = screen.getByPlaceholderText(
          "Playlist name here..",
        ) as HTMLInputElement;
        input.value = "new playlist";
        fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });
        waitFor(() => {
          if (input.value)
            expect(useBoundStore.getState().library.userPlaylists[0].name).toBe(
              input.value,
            );
        });
      });
      test("should alert if a playlist already exists", () => {
        render(<PlaylistModal ref={ref} />);
        const input = screen.getByPlaceholderText(
          "Playlist name here..",
        ) as HTMLInputElement;
        input.value = "Jukebox";
        userEvent.keyboard("{Enter}");
        act(() => {
          useBoundStore.getState().createNewUserPlaylist(input.value, 12);
        });
        input.value = "Jukebox";
        userEvent.keyboard("{Enter}");
        expect(useBoundStore.getState().library.userPlaylists.length).toBe(1);
        waitFor(() => {
          expect(alert).toHaveBeenCalledWith(
            `Playlist ${input.value} already exists`,
          );
        });
      });
    });
    test("should not to create playlist if other keys are pressed", () => {
      render(<PlaylistModal ref={ref} />);
      const input = screen.getByPlaceholderText(
        "Playlist name here..",
      ) as HTMLInputElement;
      input.value = "Jukebox";
      userEvent.keyboard("f");
      expect(useBoundStore.getState().library.userPlaylists.length).toBe(0);
    });
  });
  test("create playlist button should create a new playlist on click", () => {
    render(<PlaylistModal ref={ref} />);
    const btn = screen.getByTestId("create-playlist-btn");
    const input = screen.getByPlaceholderText(
      "Playlist name here..",
    ) as HTMLInputElement;
    input.value = "new playlist";
    fireEvent.click(btn);
    waitFor(() => {
      expect(useBoundStore.getState().library.userPlaylists[0].name).toBe(
        input.value,
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
          const checkbox = document.getElementById(`new-playlist-${123}`);
          if (checkbox) {
            userEvent.click(checkbox);
            userEvent.click(checkbox);
            waitFor(() => {
              expect(mockRemoveFromUserPlaylist).toHaveBeenCalledWith(
                sampleTrack,
                8,
              );
              expect(checkbox).not.toBeChecked();
            });
          }
        });

        test("does nothing when creationTrack is null", async () => {
          render(<PlaylistModal ref={ref} />);
          act(() => {
            useBoundStore.getState().createNewUserPlaylist("Hmmm", 13);
          });
          const checkbox = document.getElementById(`new-playlist-${13}`);
          if (checkbox) {
            act(() => {
              userEvent.click(checkbox);
            });
            waitFor(() => {
              expect(mockSetToUserPlaylist).not.toHaveBeenCalled();
              expect(mockRemoveFromUserPlaylist).not.toHaveBeenCalled();
              expect(checkbox).not.toBeChecked();
            });
          }
        });
      });
      test("unchecked if the creation track is in not that playlist", () => {
        render(<PlaylistModal ref={ref} />);
        act(() => {
          useBoundStore.getState().createNewUserPlaylist("Monday", 84);
        });
        waitFor(() => {
          const checkbox = document.getElementById(
            "new-playlist-84",
          ) as HTMLInputElement;
          expect(checkbox.checked).toBe(false);
        });
      });
      test("set the creation track to it's playlist if checked", () => {
        render(<PlaylistModal ref={ref} />);
        const newTrack = {
          ...sampleTrack,
          id: "12",
        };
        act(() => {
          useBoundStore.getState().createNewUserPlaylist("Bruhhh", 19);
          setCreationTrack(newTrack);
        });
        const checkbox = document.getElementById(
          "new-playlist-19",
        ) as HTMLInputElement;
        expect(useBoundStore.getState().creationTrack).toBeDefined();
        expect(checkbox).toBeInTheDocument();
        fireEvent.change(checkbox);
        waitFor(() => {
          if (checkbox.checked) {
            expect(
              useBoundStore.getState().library.userPlaylists[0].songs,
            ).toContainEqual(newTrack);
          }
        });
      });
      test("remove the creation track from it's playlist if unchecked", () => {
        render(<PlaylistModal ref={ref} />);
        const newTrack = {
          ...sampleUserPlaylist,
          id: 42,
        };
        act(() => {
          setCreationTrack(sampleTrack);
          useBoundStore.getState().createNewUserPlaylist("Okaayyy", 15);
          setToUserPlaylist(sampleTrack, 15);
        });
        waitFor(() => {
          expect(useBoundStore.getState().creationTrack).toBeDefined();
        });

        const checkbox = document.getElementById(
          "new-playlist-15",
        ) as HTMLInputElement;
        expect(checkbox.checked).toBe(true);

        fireEvent.change(checkbox);

        waitFor(() => {
          expect(checkbox.checked).toBe(false);
          expect(
            useBoundStore.getState().library.userPlaylists[0].songs,
          ).not.toContainEqual(newTrack);
        });
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
