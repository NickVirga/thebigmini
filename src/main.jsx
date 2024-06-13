import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GameDataProvider } from "./context/GameDataContext";
import { ModalProvider } from "./context/ModalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <GameDataProvider>
        <App />
      </GameDataProvider>
    </ModalProvider>
  </React.StrictMode>
);
