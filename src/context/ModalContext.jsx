import React, { createContext, useContext, useState } from "react";
import { GameDataContext } from "./GameDataContext";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const { gameData } = useContext(GameDataContext);
  const [modalOpen, setModalOpen] = useState(
    gameData.playedBefore ? false : true
  );
  const [modalMode, setModalMode] = useState(0);
  const [redirectMode, setRedirectMode] = useState(null);

  const updateModalOpen = (newModalOpen) => {
    setModalOpen(newModalOpen);
  };

  const updateModalMode = (newModalMode) => {
    setModalMode(newModalMode);
  };

  const updateRedirectMode = (newRedirectMode) => {
    setRedirectMode(newRedirectMode);
  };

  return (
    <ModalContext.Provider
      value={{
        modalOpen,
        updateModalOpen,
        modalMode,
        updateModalMode,
        redirectMode,
        updateRedirectMode,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
