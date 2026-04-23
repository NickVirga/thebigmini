import { useEffect } from "react";
import axios from "axios";
import { useGameData } from "@/context/GameDataContext";
import { useAuth } from "@/context/AuthContext";

export const usePendingScore = () => {
  const { gameData, updateGameData } = useGameData();
  const { authTokens } = useAuth();
  const accessToken = authTokens?.accessToken;

  useEffect(() => {
    if (!accessToken) return;
    if (!gameData.gameIsComplete) return;
    if (gameData.stats.dailySaved) return;

    const { score } = gameData.stats;

    const sendGameScore = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/games`,
          { gameId: gameData.gameId, gameScore: score },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const { wins, scoreAccum } = response.data;
        updateGameData((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            dailySaved: true,
            wins,
            avgScore: wins > 0 ? scoreAccum / wins : 0,
          },
        }));
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          // Score was already saved — mark as saved so we don't retry
          updateGameData((prev) => ({
            ...prev,
            stats: { ...prev.stats, dailySaved: true },
          }));
        } else {
          console.error("Failed to send pending score:", err);
        }
      }
    };

    sendGameScore();
  }, [accessToken]);
};
