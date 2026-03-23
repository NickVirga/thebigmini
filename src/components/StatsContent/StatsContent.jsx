import "./StatsContent.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { GameDataContext } from "../../context/GameDataContext";
import SignInPrompt from "../../components/SignInPrompt/SignInPrompt";

function StatsContent() {
  const { accessToken } = useContext(AuthContext);
  const { gameData, updateGameData } = useContext(GameDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/games/stats`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const { wins, scoreAccum } = data;
        updateGameData({
          ...gameData,
          stats: {
            ...gameData.stats,
            wins: wins,
            avgScore: wins > 0 ? scoreAccum / wins : 0,
          },
        });
      } catch (err) {
        console.error("Failed to get user statistics:", err);
        setError("Failed to load statistics. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      if (gameData.stats.wins === null || gameData.stats.avgScore === null) {
        getStats();
      } else {
        setIsLoading(false);
      }
    }
  }, [accessToken, gameData]);


  const showTodaysResults =
    gameData.gameComplete || (accessToken && gameData.stats.dailySaved);
  const showLifetimeStats = accessToken && !isLoading && !error;

  return (
    <div className="stats">
      <div className="stats__header">
        <h2 className="stats__title">Statistics</h2>
      </div>

      {showTodaysResults && (
        <div className="stats__section">
          <h3 className="stats__subtitle">Today's Results</h3>
          <div className="stats__grid">
            <div className="stats__card stats__card--full">
              <span className="stats__value">
                {gameData.stats.score?.toFixed(1)}%
              </span>
              <span className="stats__label">Score</span>
            </div>
            <div className="stats__card">
              <span className="stats__value">{gameData.stats.checkedCnt}</span>
              <span className="stats__label">Checked</span>
            </div>
            <div className="stats__card">
              <span className="stats__value">{gameData.stats.revealedCnt}</span>
              <span className="stats__label">Revealed</span>
            </div>
          </div>
        </div>
      )}

      <SignInPrompt promptText={"Sign in to track your lifetime statistics"}/>

      {/* Lifetime stats loading */}
      {accessToken && isLoading && (
        <div className="stats__section">
          <h3 className="stats__subtitle">Lifetime Statistics</h3>
          <p className="stats__loading">Loading...</p>
        </div>
      )}

      {/* Lifetime stats error */}
      {accessToken && error && (
        <div className="stats__section">
          <h3 className="stats__subtitle">Lifetime Statistics</h3>
          <p className="stats__error">{error}</p>
        </div>
      )}

      {/* Lifetime stats */}
      {showLifetimeStats && (
        <div className="stats__section">
          <h3 className="stats__subtitle">Lifetime Statistics</h3>
          <div className="stats__grid">
            <div className="stats__card">
              <span className="stats__value">{gameData.stats.wins}</span>
              <span className="stats__label">Wins</span>
            </div>
            <div className="stats__card">
              <span className="stats__value">
                {gameData.stats.avgScore?.toFixed(1)}%
              </span>
              <span className="stats__label">Avg Score</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsContent;
