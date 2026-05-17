import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import MainPage from "@/pages/MainPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";

const App = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) return;
      const today = new Date().toISOString().slice(0, 10);
      try {
        const stored = localStorage.getItem("bigmini-game-data");
        if (stored) {
          const { gameDate } = JSON.parse(stored);
          if (gameDate && gameDate !== today) {
            window.location.reload();
          }
        }
      } catch {
        // ignore parse errors
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/auth/login-callback" element={<AuthCallbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
