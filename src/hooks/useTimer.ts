import { useEffect, useRef } from "react";
import { useGameData } from "@/context/GameDataContext";
import { useModal } from "@/context/ModalContext";

export const useTimer = () => {
  const { gameData, updateGameData } = useGameData();
  const { isModalOpen } = useModal();
  const { timerStarted, gameIsComplete } = gameData;

  const isRunning = timerStarted && !isModalOpen && !gameIsComplete;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (!isRunningRef.current) return;
      updateGameData((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);
};
