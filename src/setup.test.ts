import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntersectionObserverMock } from "./components/Section/Section.test";

afterEach(() => {
  cleanup();
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
if (typeof globalThis.matchMedia !== "function") {
  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.IntersectionObserver = IntersectionObserverMock as any;
globalThis.HTMLMediaElement.prototype.load = () => {};
globalThis.HTMLMediaElement.prototype.pause = () => {};
globalThis.HTMLMediaElement.prototype.play = () => Promise.resolve();
