import React, { createContext, useState } from "react";
import gameDataTempl from "../assets/data/game-data-template.json";

const GameDataContext = createContext();

const GameDataProvider = ({ children }) => {
    const storedGameDataString = localStorage.getItem("bigmini-game-datas");

    const [gameData, setGameData] = useState(
        storedGameDataString ? JSON.parse(storedGameDataString) : gameDataTempl
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
    setGameData(newGameData);
    localStorage.setItem("bigmini-game-data", JSON.stringify(newGameData));
  };

  return (
    <GameDataContext.Provider value={{ gameData, updateGameData, tempGameData, setTempGameData }}>
      {children}
    </GameDataContext.Provider>
  );
};

export { GameDataContext, GameDataProvider };
