export const animateScreen = (ref: React.RefObject<HTMLDivElement | null>) => {
  setTimeout(() => {
    ref.current?.classList.remove("home-fadeout");
    ref.current?.classList.add("home-fadein");
  }, 80);
};
