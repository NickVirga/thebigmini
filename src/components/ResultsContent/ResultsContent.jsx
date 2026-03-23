import "./ResultsContent.scss";
import { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";
import SignInPrompt from "../../components/SignInPrompt/SignInPrompt";

function ResultsContent() {
  const { gameData } = useContext(GameDataContext);
  const { gameComplete, gameId, stats } = gameData;

  return (
    <div className="results">
      <div className="results__header">
        <h2 className="results__title">Results</h2>
      </div>

      <div className="results__section">
        <h3 className="results__subtitle">Game #{gameId}</h3>
        <p className="results__message">
          {gameComplete ? "Winner!" : "One or more cells are incorrect"}
        </p>
      </div>

      {gameComplete && (
        <div className="results__section">
          <div className="results__grid">
            <div className="results__card results__card--full">
              <span className="results__value">{stats.score.toFixed(1)}%</span>
              <span className="results__label">Score</span>
            </div>
            <div className="results__card">
              <span className="results__value">{stats.checkedCnt}</span>
              <span className="results__label">Checked</span>
            </div>
            <div className="results__card">
              <span className="results__value">{stats.revealedCnt}</span>
              <span className="results__label">Revealed</span>
            </div>
          </div>
        </div>
      )}

      <SignInPrompt promptText={"Sign in to track your lifetime statistics"}/>
    </div>
  );
}

export default ResultsContent;
