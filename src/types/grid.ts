export type Dimensions = {
  numGridRows: number;
  numGridCols: number;
};

export type Coordinates = {
  row: number;
  col: number;
};

export type SelectionDirection = "across" | "down";

export type CellData = {
  index: number;
  value: string;
  answer: string;
  coordinates: Coordinates;
  label: string | null;
  dividerMask: number;
  clues: [number | null, number | null];
  isBlank: boolean;
  isChecked: boolean;
  isRevealed: boolean;
  isIncorrect: boolean;
  isLocked: boolean;
};

export type Clue = {
  index: number;
  cluesIndex: 0 | 1;
  label: string | null;
  clueText: string;
  word: string;
  cells: Coordinates[];
};
