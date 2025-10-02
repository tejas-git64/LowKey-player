import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { useResponsiveLayout } from "./useResponsiveLayout";

describe("useResponsiveLayout hook", () => {
  beforeEach(() => {
    window.innerWidth = 1024;
  });

  test("initially sets isMobile correctly", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useResponsiveLayout());
    expect(result.current).toBe(true);

    window.innerWidth = 800;
    const { result: result2 } = renderHook(() => useResponsiveLayout());
    expect(result2.current).toBe(false);
  });

  test("updates isMobile state on window resize", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.innerWidth = 800;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(false);
  });
});
