import axios from "axios";
import { useGameData } from "@/context/GameDataContext";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { CellData } from "@/types";

export const useCompleteGame = () => {
  const { gameData, updateGameData } = useGameData();
  const { openModal } = useModal();
  const { authTokens } = useAuth();

  const sendScore = async (score: number) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/games`,
        { gameId: gameData.gameId, gameScore: score },
        { headers: { Authorization: `Bearer ${authTokens!.accessToken}` } },
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
        // Score already saved for today — mark as saved so we don't retry
        updateGameData((prev) => ({
          ...prev,
          stats: { ...prev.stats, dailySaved: true },
        }));
      } else {
        console.error("Failed to send game score:", err);
      }
    }
  };

  const checkGameComplete = (newCells: CellData[][]) => {
    if (gameData.gameIsComplete) return;

    const playCells = newCells.flat().filter((c) => !c.isBlank);

    // Still empty cells — game not done yet
    if (playCells.some((c) => c.value === "")) return;

    // All filled but one or more incorrect
    if (playCells.some((c) => c.value !== c.answer)) {
      openModal({ type: "results", props: { hasIncorrect: true } });
      return;
    }

    // All filled and all correct — calculate score
    const total = playCells.length;
    // revealed and checked are mutually exclusive for scoring:
    // a revealed cell is not also counted as checked
    const revealedCnt = playCells.filter((c) => c.isRevealed).length;
    const checkedCnt = playCells.filter((c) => c.isChecked && !c.isRevealed).length;
    const score = ((total - revealedCnt - checkedCnt * 0.5) / total) * 100;

    updateGameData((prev) => ({
      ...prev,
      gameIsComplete: true,
      stats: {
        ...prev.stats,
        score,
        checkedCnt,
        revealedCnt,
      },
    }));

    openModal({ type: "results", props: { hasIncorrect: false, score, checkedCnt, revealedCnt } });

    if (authTokens?.accessToken && !gameData.stats.dailySaved) {
      sendScore(score);
    }
  };

  return { checkGameComplete };
};
