import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { GameDataProvider } from "@/context/GameDataContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameDataProvider>
    <App />
    </GameDataProvider>
  </StrictMode>
);

