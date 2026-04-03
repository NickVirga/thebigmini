import { createContext, useContext, useState } from "react";
import gameDataTempl from "../assets/data/game-data-template.json";
import puzzleGameData from "../assets/data/puzzle-game-data.json";

import { GameData, Dimensions, CellData, Clue } from "@/types";

type GameDataContextType = {
  gameData: GameData;
  updateGameData: (newGameData: GameData) => void;
  resetGameData: () => void;
};
type Props = {
  children: React.ReactNode;
};

const GameDataContext = createContext<GameDataContextType | null>(null);

const GameDataProvider = ({ children }: Props) => {
  const getGameDataTemplate = () => {
    const gameDataTemplate: GameData = {
      ...(gameDataTempl as unknown as GameData),
      dimensions: puzzleGameData.dimensions as Dimensions,
      cells: puzzleGameData.cells as unknown as CellData[][],
      clues: puzzleGameData.clues as unknown as Clue[],
    };

    return gameDataTemplate;
  };

  const storedGameDataString = localStorage.getItem("bigmini-game-data");
  const gameDataTemplate: GameData = getGameDataTemplate();
  let initialGameData: GameData;

  if (storedGameDataString) {
    const storedGameData: GameData = JSON.parse(storedGameDataString);

    // Check if the gameId in localStorage matches the template's gameId
    if (storedGameData.gameId === gameDataTemplate.gameId) {
      initialGameData = storedGameData; // Use the stored game data
    } else {
      initialGameData = {
        ...gameDataTemplate,
        playedBefore: storedGameData.playedBefore,
        options: { ...storedGameData.options },
        stats: {
          ...gameDataTemplate.stats, // fresh game stats (score, checkedCnt, etc.)
          wins: storedGameData.stats.wins,
          avgScore: storedGameData.stats.avgScore,
        },
      };
      localStorage.setItem(
        "bigmini-game-data",
        JSON.stringify(initialGameData),
      );
    }
  } else {
    initialGameData = gameDataTemplate; // No data in localStorage, use the template
  }
  const [gameData, setGameData] = useState<GameData>(initialGameData);

  const updateGameData = (newGameData: GameData) => {
    setGameData(newGameData);
    localStorage.setItem("bigmini-game-data", JSON.stringify(newGameData));
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

export { GameDataContext, GameDataProvider };
