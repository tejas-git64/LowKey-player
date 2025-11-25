export const animateScreen = (ref: React.RefObject<HTMLDivElement | null>) => {
  const timer = setTimeout(() => {
    ref.current?.classList.remove("home-fadeout");
    ref.current?.classList.add("home-fadein");
  }, 150);
  return timer;
};
