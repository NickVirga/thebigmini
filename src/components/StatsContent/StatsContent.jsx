import "./StatsContent.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { GameDataContext } from "../../context/GameDataContext";

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="stats__error">{error}</p>;

  return (
    <div>
      <h2 className="stats__title">Statistics</h2>
      <ul className="stats__list">
        <li className="stats__item">
          <h3 className="stats__option">Wins: {gameData.stats.wins}</h3>
        </li>
        <li className="stats__item">
          <h3 className="stats__option">
            Score Average: {gameData.stats.avgScore.toFixed(1)}%
          </h3>
        </li>
      </ul>
    </div>
  );
}

export default StatsContent;
