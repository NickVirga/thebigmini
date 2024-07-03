import "./ResultsContent.scss";
import { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";

function ResultsContent() {
  const { gameData } = useContext(GameDataContext);

  return (
    <>
      <p>Game #{gameData.gameId}</p>
      <h2>{gameData.winState ? "Winner!" : "One or more cells are incorrect"}</h2>
    </>
  );
}

export default ResultsContent;
