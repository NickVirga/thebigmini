import BaseModal from "./BaseModal";
import "./StatsModal.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useGameData } from "@/context/GameDataContext";
import { useModal } from "@/context/ModalContext";

type StatsModalProps = {
  onClose: () => void;
  zIndex?: number;
};

const StatsModal = ({ onClose, zIndex }: StatsModalProps) => {
  const { authTokens } = useAuth();
  const { gameData, updateGameData } = useGameData();
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = authTokens?.accessToken;

  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true);
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
            wins,
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
      }
    }
  }, [accessToken]);

  const showTodaysResults =
    gameData.gameIsComplete || (accessToken && gameData.stats.dailySaved);

  return (
    <BaseModal onClose={onClose} zIndex={zIndex}>
      <div className="stats">

        <div className="stats__header">
          <h2 className="stats__title">Statistics</h2>
        </div>

        {/* Today's results */}
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
                <span className="stats__value">{gameData.stats.checkedCnt ?? "—"}</span>
                <span className="stats__label">Checked</span>
              </div>
              <div className="stats__card">
                <span className="stats__value">{gameData.stats.revealedCnt ?? "—"}</span>
                <span className="stats__label">Revealed</span>
              </div>
            </div>
          </div>
        )}

        {/* Sign in prompt */}
        {!accessToken && (
          <div className="stats__prompt">
            <p className="stats__prompt-text">
              Sign in to track your lifetime statistics
            </p>
            <button
              className="stats__prompt-btn"
              onClick={() => openModal({ type: "auth" })}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Lifetime stats — loading */}
        {accessToken && isLoading && (
          <div className="stats__section">
            <h3 className="stats__subtitle">Lifetime Statistics</h3>
            <div className="stats__skeleton-grid">
              <div className="stats__skeleton" />
              <div className="stats__skeleton" />
            </div>
          </div>
        )}

        {/* Lifetime stats — error */}
        {accessToken && error && (
          <div className="stats__section">
            <h3 className="stats__subtitle">Lifetime Statistics</h3>
            <p className="stats__error">{error}</p>
          </div>
        )}

        {/* Lifetime stats */}
        {accessToken && !isLoading && !error && (
          <div className="stats__section">
            <h3 className="stats__subtitle">Lifetime Statistics</h3>
            <div className="stats__grid">
              <div className="stats__card">
                <span className="stats__value">{gameData.stats.wins ?? "—"}</span>
                <span className="stats__label">Wins</span>
              </div>
              <div className="stats__card">
                <span className="stats__value">
                  {gameData.stats.avgScore?.toFixed(1) ?? "—"}%
                </span>
                <span className="stats__label">Avg Score</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </BaseModal>
  );
};

export default StatsModal;