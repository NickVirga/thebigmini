import React, { createContext, useState } from "react";
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
      initialGameData = gameDataTemplate; // Use the template data
      initialGameData.darkThemeEnabled = storedGameData.darkThemeEnabled;
      initialGameData.playedBefore = storedGameData.playedBefore;
      localStorage.removeItem("bigmini-game-data"); // Clear localStorage if IDs don't match
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
    const updatedGameData = {
      ...newGameData,
      timestamp: new Date().toISOString(),
    };

    setGameData(updatedGameData);
    localStorage.setItem("bigmini-game-data", JSON.stringify(updatedGameData));
  };

  const resetGameData = () => {
    setGameData({ ...gameData, winState: false, cells: puzzleCellsData });
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
