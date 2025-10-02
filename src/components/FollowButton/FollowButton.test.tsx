import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { FollowButton } from "./FollowButton";
import { sampleArtist } from "../../api/samples";
import { useBoundStore } from "../../store/store";

afterEach(() => {
  cleanup();
});

describe("FollowButton", () => {
  test("should render", () => {
    render(<FollowButton artist={sampleArtist} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
  describe("handleFollowing", () => {
    test("should follow artist if not already", () => {
      render(<FollowButton artist={sampleArtist} />);
      expect(screen.getByRole("button")).toHaveTextContent("Follow");
      fireEvent.click(screen.getByRole("button"));
      expect(useBoundStore.getState().library.followings).toContain(
        sampleArtist,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Following");
    });
    test("should unfollow artist if already following", () => {
      render(<FollowButton artist={sampleArtist} />);
      expect(screen.getByRole("button")).toHaveTextContent("Follow");

      fireEvent.click(screen.getByRole("button"));
      expect(useBoundStore.getState().library.followings).not.toContain(
        sampleArtist,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Follow");
    });
  });
});
