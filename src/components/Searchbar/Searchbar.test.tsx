import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import Searchbar from "./Searchbar";
import * as api from "../../api/requests";
import { useBoundStore } from "../../store/store";

let input: HTMLInputElement;
let mockGetSearchResults = vi.fn();

vi.mock("../../api/requests", () => ({
  getSearchResults: vi.fn(),
}));

function skipDelay() {
  vi.advanceTimersByTime(800);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Searchbar", () => {
  test("should render", () => {
    render(<Searchbar />);
    const searchbar = screen.getByTestId("searchbar");
    expect(searchbar).toBeInTheDocument();
  });
  test("should have an input field", () => {
    render(<Searchbar />);
    input = screen.getByTestId("searchinput") as HTMLInputElement;
    expect(input).toHaveAttribute("type", "search");
    expect(input).toBeInTheDocument();
  });
  test("covers input onChange via userEvent", async () => {
    vi.useFakeTimers();
    render(<Searchbar />);
    input = screen.getByTestId("searchinput") as HTMLInputElement;
    const inputObj = { target: { value: "new value" } };
    fireEvent.change(input, inputObj);
    expect(input.value).toBe("new value");
    skipDelay();
    expect(api.getSearchResults).toHaveBeenCalledWith("new+value");
  });
  test("should not fetch results for empty input", async () => {
    const user = userEvent.setup();
    render(<Searchbar />);
    input = screen.getByTestId("searchinput") as HTMLInputElement;
    input.value = "";
    await user.click(input);
    expect(useBoundStore.getState().search.topQuery).toBe(null);
  });
  test("should not fetch results for whitespace input", async () => {
    const user = userEvent.setup();
    render(<Searchbar />);
    input = screen.getByTestId("searchinput") as HTMLInputElement;
    input.value = "   ";
    await user.click(input);
    expect(useBoundStore.getState().search.topQuery).toBe(null);
  });
  test("should replace whitespace input with +", () => {
    vi.useFakeTimers();
    const user = userEvent.setup();
    render(<Searchbar />);
    input = screen.getByTestId("searchinput") as HTMLInputElement;
    input.value = "user input";
    user.click(input);
    skipDelay();
    waitFor(() => {
      expect(mockGetSearchResults).toHaveBeenCalledWith("user+input");
    });
  });
  test("debounces calls if query changes", () => {
    vi.useFakeTimers();
    const user = userEvent.setup();
    render(<Searchbar />);
    input = screen.getByTestId("searchinput") as HTMLInputElement;
    input.value = "first";
    user.click(input);
    skipDelay();
    waitFor(() => {
      expect(mockGetSearchResults).toHaveBeenCalledTimes(1);
      expect(mockGetSearchResults).toHaveBeenCalledWith("first");
    });
  });
  test("clears timeout on unmount", () => {
    const { unmount } = render(<Searchbar />);
    unmount();
    expect(mockGetSearchResults).not.toHaveBeenCalled();
  });
});
