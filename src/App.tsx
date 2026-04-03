import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import MainPage from "@/pages/MainPage";

// import { useGameData } from "@/context/GameDataContext";

const App = () => {
  // const { gameData } = useGameData();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
