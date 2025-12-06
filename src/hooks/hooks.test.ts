import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { RefObject } from "react";
import useClearTimer from "./useClearTimer";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useResponsiveLayout hook", () => {
  beforeEach(() => {
    globalThis.innerWidth = 1024;
  });

  test("initially sets isMobile correctly", () => {
    globalThis.innerWidth = 500;
    const { result } = renderHook(() => useResponsiveLayout());
    expect(result.current).toBe(true);

    globalThis.innerWidth = 800;
    const { result: result2 } = renderHook(() => useResponsiveLayout());
    expect(result2.current).toBe(false);
  });

  test("updates isMobile state on globalThis resize", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    act(() => {
      globalThis.innerWidth = 500;
      globalThis.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(true);

    act(() => {
      globalThis.innerWidth = 800;
      globalThis.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(false);
  });
});

describe("useClearTimer hook", () => {
  test("clears timeout immediately on mount when ref.current is set", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const timer = setTimeout(() => {}, 1000);
    const ref: RefObject<NodeJS.Timeout | null> = { current: timer };
    renderHook(({ timerRef }) => useClearTimer(timerRef), {
      initialProps: { timerRef: ref },
    });

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timer);
  });

  test("does not call clearTimeout on mount when ref.current is null", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const ref: RefObject<NodeJS.Timeout | null> = { current: null };
    renderHook(({ timerRef }) => useClearTimer(timerRef), {
      initialProps: { timerRef: ref },
    });

    expect(clearTimeoutSpy).not.toHaveBeenCalled();
  });

  test("adds beforeunload listener that clears current timeout and removes it on unmount", () => {
    const addEventListenerSpy = vi.spyOn(globalThis, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(globalThis, "removeEventListener");
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const initialTimer = setTimeout(() => {}, 1000);
    const ref: RefObject<NodeJS.Timeout | null> = { current: initialTimer };

    const { unmount } = renderHook(({ timerRef }) => useClearTimer(timerRef), {
      initialProps: { timerRef: ref },
    });
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );

    const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "beforeunload",
    )?.[1] as EventListener;
    expect(beforeUnloadHandler).toBeTypeOf("function");

    const newTimer = setTimeout(() => {}, 2000);
    ref.current = newTimer;
    beforeUnloadHandler(new Event("beforeunload"));
    expect(clearTimeoutSpy).toHaveBeenCalledWith(newTimer);

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      beforeUnloadHandler,
    );
  });
});
