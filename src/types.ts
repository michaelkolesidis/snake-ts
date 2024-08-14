export type Cell = {
  x: number;
  y: number;
};

export type Snake = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  cells: Cell[];
  maxCells: number;
};
