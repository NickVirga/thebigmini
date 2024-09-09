import React, { createContext, useState } from "react";
import gameDataTempl from "../assets/data/game-data-template.json";
import puzzleCellsData from "../assets/data/puzzle-cells-data.json"

const GameDataContext = createContext();

const GameDataProvider = ({ children }) => {
    const storedGameDataString = localStorage.getItem("bigmini-game-data");

    const getGameDataTemplate = () => {

      const gameDataTemplate = gameDataTempl

      gameDataTemplate.cells = puzzleCellsData

      return gameDataTemplate
    }

    const [gameData, setGameData] = useState(
        storedGameDataString ? JSON.parse(storedGameDataString) : getGameDataTemplate()
    );

    const [tempGameData, setTempGameData] = useState(
      { gameScore: 0,
        lettersChecked: 0,
        lettersRevealed: 0
      }
    )

    const updateTempGameData = (newTempGameData) => {
      setTempGameData(newTempGameData)
    }


  const updateGameData = (newGameData) => {
    const updatedGameData = {
      ...newGameData,
      timestamp: new Date().toISOString(),
    };
  
    setGameData(updatedGameData);
    localStorage.setItem("bigmini-game-data", JSON.stringify(updatedGameData));
  };

  const resetGameData = () => {
    setGameData({...gameData, cells: puzzleCellsData})
  }


  return (
    <GameDataContext.Provider value={{ gameData, updateGameData, tempGameData, updateTempGameData, resetGameData }}>
      {children}
    </GameDataContext.Provider>
  );
};

export { GameDataContext, GameDataProvider };
