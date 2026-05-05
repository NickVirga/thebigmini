export type Dimensions = {
  numGridRows: number;
  numGridCols: number;
};

export type Coordinates = {
  row: number;
  col: number;
};

export type CellData = {
  index: number;
  value: string;
  answer: string;
  coordinates: Coordinates;
  label: string | null;
  style: StyleConfig;
  clues: [number | null, number | null];
  zoom2Origins: [ZoomOrigin | null, ZoomOrigin | null];
  isBlank: boolean;
  isChecked: boolean;
  isRevealed: boolean;
  isIncorrect: boolean;
  isLocked: boolean;
};

export type StyleConfig = {
  borderMask: number;
  dividerMask: number;
};


export type Clue = {
  index: number;
  cluesIndex: 0 | 1;
  label: string | null;
  clueText: string;
  word: string;
  cells: Coordinates[];
  zoom1: ZoomTransform;
  zoom2Scale: number;
};

export type ZoomOrigin = {
  originX: number;
  originY: number;
};

export type ZoomTransform = {
  scale: number;
  originX: number;
  originY: number;
};

