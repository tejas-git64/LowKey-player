import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import SongFallback from "./SongFallback";

describe("SongFallback", () => {
  test("should render", () => {
    render(<SongFallback isWidgetSong={true} />);
    expect(screen.getByTestId("song-fallback")).toBeInTheDocument();
  });
  test("should contain respective classes when it is a widget song", () => {
    render(<SongFallback isWidgetSong={true} />);
    const name = screen.getByTestId("name");
    const artists = screen.getByTestId("artists");
    const duration = screen.getByTestId("duration");
    expect(name).toHaveClass(
      "w-[10vw] sm:w-[18vw] md:w-[20vw] xmd:w-[22vw] lg:mr-[1vw] lg:w-[22vw] xl:w-[12.5vw] xxl:w-[13.5vw] 2xl:w-[15vw] 2xl:max-w-60",
    );
    expect(artists).toHaveClass(
      "hidden flex-shrink-0 xlg:flex xlg:w-[3.5vw] xl:w-[5vw] xxl:w-[8.5vw] 2xl:w-[10vw] 2xl:max-w-40",
    );
    expect(duration).toHaveClass(
      "mr-[1vw] w-10 flex-shrink-0 sm:ml-[4vw] sm:mr-2 md:mx-[2vw] xmd:mx-[3vw] lg:mx-[1vw] xlg:ml-[1.5vw] xxl:mx-[0.5vw] 2xl:mx-2",
    );
  });
  test("should contain respective classes when it is a widget song", () => {
    render(<SongFallback isWidgetSong={false} />);
    const name = screen.getByTestId("name");
    const artists = screen.getByTestId("artists");
    const duration = screen.getByTestId("duration");
    expect(name).toHaveClass(
      "w-[40vw] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[30%] 2xl:w-60",
    );
    expect(artists).toHaveClass(
      "hidden sm:mr-12 sm:inline-flex sm:w-[25%] md:mr-6 md:w-[27.5%] xmd:w-[37.5%] lg:mr-10 lg:w-[37.5%] xl:mr-[7%] xl:w-[25%] xxl:mr-[4%] xxl:w-[30%] 2xl:mr-14 2xl:w-[35%] 2xl:max-w-96",
    );
    expect(duration).toHaveClass(
      "m-[3vw] w-10 max-w-14 sm:ml-4 sm:mr-[2%] sm:block md:mx-[5%] xmd:mx-4 lg:mx-0 xlg:mx-[2vw] xl:mr-4",
    );
  });
});
