import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { GameDataProvider } from "@/context/GameDataContext";
import { ModalProvider } from "@/context/ModalContext";
import { AuthProvider } from "@/context/AuthContext";
import ModalManager from "@/components/Modals/ModalManager";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <GameDataProvider>
        <ModalProvider>
          <App />
          <ModalManager />
        </ModalProvider>
      </GameDataProvider>
    </AuthProvider>
  </StrictMode>,
);
