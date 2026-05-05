import { CellData, Dimensions, Clue, Coordinates } from "./grid";
import { Theme } from "./ui";

export type GameData = {
  gameDate: string;
  playedBefore: boolean;
  zoomLevel: 0 | 1 | 2;
  gameIsComplete: boolean;
  options: Options;
  stats: Stats;
  dimensions: Dimensions;
  selected: UserSelection | null;
  cells: CellData[][];
  clues: Clue[];
};

export type UserSelection = {
  coordinates: Coordinates;
  cluesIndex: 0 | 1;
  clueNum: number | null;
  clueCells: Coordinates[];
};

export type Options = {
  theme: Theme;
  moveToNextClue: boolean;
  skipFilled: boolean;
  autoErrorCheck: boolean;
};

export type Stats = {
  dailySaved: boolean;
  wins: number | null;
  avgScore: number | null;
  score: number | null;
  checkedCnt: number | null;
  revealedCnt: number | null;
};
