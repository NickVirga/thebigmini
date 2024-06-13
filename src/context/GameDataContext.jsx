import React, { createContext, useState } from "react";
import gameDataTempl from "../assets/data/game-data-template.json";

const GameDataContext = createContext();

const GameDataProvider = ({ children }) => {
    const storedGameDataString = localStorage.getItem("2dozenq-game-data");

    const [gameData, setGameData] = useState(
        storedGameDataString ? JSON.parse(storedGameDataString) : gameDataTempl
    );


  const updateGameData = (newGameData) => {
    setGameData(newGameData);
    localStorage.setItem("2dozenq-game-data", JSON.stringify(newGameData));
  };

  return (
    <GameDataContext.Provider value={{ gameData, updateGameData }}>
      {children}
    </GameDataContext.Provider>
  );
};

export { GameDataContext, GameDataProvider };
