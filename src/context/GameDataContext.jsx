import { createContext, useState } from "react";
import gameDataTempl from "../assets/data/game-data-template.json";
import puzzleCellsData from "../assets/data/puzzle-cells-data.json";

const GameDataContext = createContext();

const GameDataProvider = ({ children }) => {
  const getGameDataTemplate = () => {
    const gameDataTemplate = { ...gameDataTempl };
    gameDataTemplate.cells = puzzleCellsData;
    return gameDataTemplate;
  };

  const storedGameDataString = localStorage.getItem("bigmini-game-data");
  const gameDataTemplate = getGameDataTemplate();
  let initialGameData;

  if (storedGameDataString) {
    const storedGameData = JSON.parse(storedGameDataString);

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
      localStorage.setItem("bigmini-game-data", JSON.stringify(initialGameData));
    }
  } else {
    initialGameData = gameDataTemplate; // No data in localStorage, use the template
  }

  const [gameData, setGameData] = useState(initialGameData);

  const [tempGameData, setTempGameData] = useState({
    gameScore: 0,
    lettersChecked: 0,
    lettersRevealed: 0,
  });

  const updateTempGameData = (newTempGameData) => {
    setTempGameData(newTempGameData);
  };

  const updateGameData = (newGameData) => {
    setGameData((prev) => {
      //resolver handles functional updater pattern
      const resolved =
        typeof newGameData === "function" ? newGameData(prev) : newGameData;
      const updatedGameData = {
        ...resolved,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        "bigmini-game-data",
        JSON.stringify(updatedGameData),
      );
      return updatedGameData;
    });
  };

  const resetGameData = () => {
    updateGameData({
      ...gameData,
      gameComplete: false,
      cells: puzzleCellsData,
    });
  };

  return (
    <GameDataContext.Provider
      value={{
        gameData,
        updateGameData,
        tempGameData,
        updateTempGameData,
        resetGameData,
      }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export { GameDataContext, GameDataProvider };
