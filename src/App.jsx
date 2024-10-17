import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header/Header";
import Modal from "./components/Modal/Modal";
import Confirm from "./components/Confirm/Confirm"
import MainPage from "./pages/MainPage/MainPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Footer from "./components/Footer/Footer";
import LoadingPage from "./pages/LoadingPage/LoadingPage";

import { GameDataContext } from "./context/GameDataContext";
// import "./styles/partials/_global.scss";

function App() {
  const { gameData } = useContext(GameDataContext);

  return (
    <BrowserRouter>
      <div
        className={`app ${
          gameData.darkThemeEnabled ? "dark-theme" : "default-theme"
        }`}
      >
        <Modal />
        <Confirm />
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/auth/login-callback" element={<LoadingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
