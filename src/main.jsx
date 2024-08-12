import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GameDataProvider } from "./context/GameDataContext";
import { ModalProvider } from "./context/ModalContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="841485237403-uqi9le4vdf33n3kaaot98lt4c7lsjak9.apps.googleusercontent.com">
      <AuthProvider>
        <GameDataProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </GameDataProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
