import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(false);

  const updateLoggedIn = (newLoggedInState) => {
    setLoggedIn(newLoggedInState);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, updateLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };