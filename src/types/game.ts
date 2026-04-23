import { CellData, Dimensions, Clue, Coordinates } from "./grid";
import { Theme } from "./ui";

export type GameData = {
  gameId: number;
  playedBefore: boolean;
  isMagnified: boolean;
  gameIsComplete: boolean;
  options: Options;
  stats: Stats;
  dimensions: Dimensions;
  selected: CellSelection | null;
  cells: CellData[][];
  clues: Clue[];
};

export type CellSelection = {
  coordinates: Coordinates;
  cluesIndex: 0 | 1;
};

export type Options = {
  theme: Theme;
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
