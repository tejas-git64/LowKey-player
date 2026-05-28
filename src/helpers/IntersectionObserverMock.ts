import { vi } from "vitest";

export class IntersectionObserverMock implements IntersectionObserver {
  callback: IntersectionObserverCallback;
  root: Element | null = null;
  rootMargin = "";
  scrollMargin = "";
  thresholds: ReadonlyArray<number> = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    if (options?.rootMargin) this.rootMargin = options.rootMargin;
    if (options?.threshold !== undefined) {
      this.thresholds = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold];
    }
  }

  observe: (target: Element) => void = vi.fn();
  unobserve: (target: Element) => void = vi.fn();
  disconnect: () => void = vi.fn();
  takeRecords = vi.fn((): IntersectionObserverEntry[] => []);

  trigger(isIntersecting: boolean) {
    const entry: IntersectionObserverEntry = {
      isIntersecting,
      target: {} as Element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    };
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}
