import React, { createContext, useState } from "react";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {

  const [modalMode, setModalMode] = useState(0);

  const updateModalMode = (newModalMode) => {
    setModalMode(newModalMode);
  };

  return (
    <ModalContext.Provider value={{ modalMode, updateModalMode }}>
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };