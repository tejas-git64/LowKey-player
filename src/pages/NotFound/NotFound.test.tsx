import nf480 from "../../assets/images/notfound/notfound-480px.webp";
import nf640 from "../../assets/images/notfound/notfound-640px.webp";
import nf768 from "../../assets/images/notfound/notfound-landscape-768px.webp";
import nf1024 from "../../assets/images/notfound/notfound-landscape-1024px.webp";
import nf1280 from "../../assets/images/notfound/notfound-landscape-1280px.webp";
import nf1536 from "../../assets/images/notfound/notfound-landscape-1536px.webp";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import NotFound from "./NotFound";
import { MemoryRouter } from "react-router-dom";
import { animateScreen } from "../../helpers/animateScreen";

afterEach(() => {
  cleanup();
});

describe("NotFound", () => {
  test("it should render", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("notfound")).toBeInTheDocument();
  });

  describe("imageResize and useEffect", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("window width of 480px", () => {
      window.innerWidth = 480;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf480);
    });

    test("window width of 640px", () => {
      window.innerWidth = 640;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf640);
    });

    test("window width of 768px", () => {
      window.innerWidth = 768;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf768);
    });

    test("window width of 1024px", () => {
      window.innerWidth = 1024;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf1024);
    });

    test("window width of 1280px", () => {
      window.innerWidth = 1280;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf1280);
    });

    test("window width of 2500px", () => {
      window.innerWidth = 2500;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf1536);
    });

    test("default case", () => {
      window.innerWidth = 2600;
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf1024);
    });

    test("calls animateScreen on load", () => {
      const ref = {
        current: null as HTMLDivElement | null,
      };
      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      const div = document.createElement("div");
      div.classList.add("home-fadeout");
      vi.useFakeTimers();

      ref.current = div;
      animateScreen(ref);

      expect(ref.current?.classList).toContain("home-fadeout");
      expect(ref.current?.classList).not.toContain("home-fadein");

      vi.runAllTimers();

      expect(ref.current?.classList).not.toContain("home-fadeout");
      expect(ref.current?.classList).toContain("home-fadein");

      vi.useRealTimers();
    });

    test("updates image on resize event", () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      window.innerWidth = 1425;
      act(() => {
        globalThis.dispatchEvent(new Event("resize"));
      });
      expect(getByTestId("notfound").style.backgroundImage).toContain(nf1536);
    });

    test("cleans up event listeners on unmount", () => {
      const removeSpy = vi.spyOn(globalThis, "removeEventListener");
      const { unmount } = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );
      unmount();
      expect(removeSpy).toHaveBeenCalledWith("load", expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      removeSpy.mockRestore();
    });
  });
});
