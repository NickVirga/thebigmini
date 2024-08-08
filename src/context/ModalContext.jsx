import React, { createContext, useState } from "react";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {

  const [modalMode, setModalMode] = useState(0);
  const [redirectMode, setRedirectMode] = useState(null) 
  
  const updateModalMode = (newModalMode) => {
    setModalMode(newModalMode);
  };

  const updateRedirectMode = (newRedirectMode) => {
    setRedirectMode(newRedirectMode);
  };

  return (
    <ModalContext.Provider value={{ modalMode, updateModalMode, redirectMode, updateRedirectMode }}>
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };