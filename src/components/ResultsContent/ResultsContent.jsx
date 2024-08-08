import "./ResultsContent.scss";
import { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";

function ResultsContent() {
  const { gameData, tempGameData } = useContext(GameDataContext);

  return (
    <div className="results">
      <p>Game #{gameData.gameId}</p>
      <h2 className="results__title">
        {gameData.winState ? "Winner!" : "One or more cells are incorrect"}
      </h2>
      {gameData.winState && (
        <div className="results__stats">
          <p className="results__score-subtitle">Score: <span className="results__stat results__stat--score">{tempGameData.gameScore.toFixed(1)}%</span></p>
          <p>Letters Checked: <span className="results__stat">{tempGameData.lettersChecked}</span></p>
          <p>Letters Revealed: <span className="results__stat">{tempGameData.lettersRevealed}</span></p>
        </div>
      )}
    </div>
  );
}

export default ResultsContent;