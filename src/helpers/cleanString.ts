export const cleanString = (str: string) => {
  return str?.replaceAll(/&[^\s;]+;/g, "");
};
