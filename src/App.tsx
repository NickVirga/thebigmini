import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import MainPage from "@/pages/MainPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";

const App = () => {

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
