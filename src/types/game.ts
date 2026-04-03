import { CellData, Dimensions, Clue } from "./grid";

export type GameData = {
  gameId: number;
  playedBefore: boolean;
  isMagnified: boolean;
  gameIsComplete: boolean;
  options: Options;
  stats: Stats;
  dimensions: Dimensions;
  selected: Selection;
  cells: CellData[][];
  clues: Clue[];
};

export type Selection = {
  cellsIndex: number | null;
  cluesIndex: 0 | 1;
};

export type Options = {
  theme: string;
  moveToNextClue: boolean;
  skipFilled: boolean;
};

export type Stats = {
  dailySaved: boolean;
  wins: number | null;
  avgScore: number | null;
  score: number | null;
  checkedCnt: number | null;
  revealedCnt: number | null;
};
