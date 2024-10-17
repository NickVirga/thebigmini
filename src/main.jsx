import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GameDataProvider } from "./context/GameDataContext";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthProvider>
        <GameDataProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </GameDataProvider>
      </AuthProvider>
  </React.StrictMode>
);
