import { useState, useEffect } from "react";

export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(globalThis.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(globalThis.innerWidth < 640);
    };
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
