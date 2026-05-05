import { createContext, useContext, useState } from "react";
import gameDataTempl from "../assets/data/game-data-template.json";
import puzzleGameData from "../assets/data/puzzle-game-data.json";

import { GameData, Dimensions, CellData, Clue } from "@/types";

type GameDataContextType = {
  gameData: GameData;
  updateGameData: (
    newGameData: GameData | ((prev: GameData) => GameData),
  ) => void;
  resetGameData: () => void;
};
type Props = {
  children: React.ReactNode;
};

export const GameDataContext = createContext<GameDataContextType | null>(null);

// Helpers (run once on import, before any render)
const resolveTheme = (theme: string): string =>
  theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme;

const safeGetStorage = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const safeSetStorage = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
};

export const GameDataProvider = ({ children }: Props) => {
  const getGameDataTemplate = () => {
    const gameDataTemplate: GameData = {
      ...(gameDataTempl as unknown as GameData),
      dimensions: puzzleGameData.dimensions as Dimensions,
      cells: puzzleGameData.cells as unknown as CellData[][],
      clues: puzzleGameData.clues as unknown as Clue[],
    };

    return gameDataTemplate;
  };

  const storedGameDataString = safeGetStorage("bigmini-game-data");
  const gameDataTemplate: GameData = getGameDataTemplate();
  let initialGameData: GameData;

  if (storedGameDataString) {
    const storedGameData: GameData = JSON.parse(storedGameDataString);

    // Check if the gameDate in localStorage matches the template's gameDate
    if (storedGameData.gameDate === gameDataTemplate.gameDate) {
      initialGameData = { ...storedGameData, selected: null }; // reset cursor; UserSelection fields not stored
    } else {
      initialGameData = {
        ...gameDataTemplate,
        options: { ...storedGameData.options },
        stats: {
          ...gameDataTemplate.stats, // fresh game stats (score, checkedCnt, etc.)
          wins: storedGameData.stats.wins,
          avgScore: storedGameData.stats.avgScore,
        },
      };
      safeSetStorage(
        "bigmini-game-data",
        JSON.stringify(initialGameData),
      );
    }
  } else {
    initialGameData = gameDataTemplate;
    safeSetStorage("bigmini-game-data", JSON.stringify(initialGameData));
  }

  // Apply theme to <html> once on mount, before first render
  document.documentElement.setAttribute(
    "data-theme",
    resolveTheme(initialGameData.options.theme),
  );

  const [gameData, setGameData] = useState<GameData>(initialGameData);

  const updateGameData = (
    newGameData: GameData | ((prev: GameData) => GameData),
  ) => {
    setGameData((prev) => {
      const resolved =
        typeof newGameData === "function" ? newGameData(prev) : newGameData;
      safeSetStorage("bigmini-game-data", JSON.stringify(resolved));
      return resolved;
    });
  };

  const resetGameData = () => {
    updateGameData({
      ...gameData,
      gameIsComplete: false,
      cells: puzzleGameData.cells as unknown as CellData[][],
    });
  };

  return (
    <GameDataContext.Provider
      value={{
        gameData,
        updateGameData,
        resetGameData,
      }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (!context) {
    throw new Error("useGameData must be used within a GameDataProvider");
  }
  return context;
};
