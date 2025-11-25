import { useEffect, RefObject } from "react";

export default function useClearTimer(ref: RefObject<NodeJS.Timeout | null>) {
  useEffect(() => {
    function clear() {
      if (ref.current) {
        clearTimeout(ref.current);
      }
    }
    clear();
    globalThis.addEventListener("beforeunload", clear);
    return () => {
      globalThis.removeEventListener("beforeunload", clear);
    };
  }, [ref]);
}
