export const HEIGHT = 20;
export const WIDTH = 10;

export const initBoard = (width = WIDTH, height = HEIGHT, defaultCell = '.') =>
  [...Array(height)].map(() => [...Array(width)].map(() => defaultCell));
