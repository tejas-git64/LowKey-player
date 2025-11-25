import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntersectionObserverMock } from "./components/Section/Section.test";

afterEach(() => {
  cleanup();
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.IntersectionObserver = IntersectionObserverMock as any;
globalThis.HTMLMediaElement.prototype.load = () => {};
globalThis.HTMLMediaElement.prototype.pause = () => {};
globalThis.HTMLMediaElement.prototype.play = () => Promise.resolve();
