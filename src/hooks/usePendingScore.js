import { useEffect } from "react";
import axios from "axios";

export const usePendingScore = (accessToken, gameData, updateGameData) => {
  useEffect(() => {
    if (!accessToken) return;
    if (!gameData.gameComplete) return;
    if (gameData.stats.dailySaved) return;

    const sendGameScore = async () => {
      const { score, checkedCnt, revealedCnt } = gameData.stats;
      const reqBody = { gameId: gameData.gameId, gameScore: score };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/games`,
          reqBody,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const { wins, scoreAccum } = response.data;

        updateGameData({
          ...gameData,
          gameComplete: true,
          stats: {
            ...gameData.stats,
            score: score,
            checkedCnt: checkedCnt,
            revealedCnt: revealedCnt,
            dailySaved: true,
            wins: wins,
            avgScore: wins > 0 ? scoreAccum / wins : 0,
          },
        });
      } catch (err) {
        console.error(err);
        const dailySaved = err.response?.status === 409;
        // Already saved today, mark as saved anyway. If other error, don't mark as saved
        updateGameData({
          ...gameData,
          gameComplete: true,
          stats: {
            ...gameData.stats,
            score: score,
            checkedCnt: checkedCnt,
            revealedCnt: revealedCnt,
            dailySaved: dailySaved,
          },
        });
      }
    };

    sendGameScore();
  }, [accessToken]);
};
