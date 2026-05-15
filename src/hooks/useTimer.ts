import { useEffect, useRef, useState } from "react";
import { useGameData } from "@/context/GameDataContext";
import { useModal } from "@/context/ModalContext";

export const useTimer = () => {
  const { gameData, updateGameData } = useGameData();
  const { isModalOpen } = useModal();
  const { timerStarted, gameIsComplete } = gameData;

  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const isRunning = timerStarted && !isModalOpen && !gameIsComplete && isPageVisible;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const updateGameDataRef = useRef(updateGameData);
  updateGameDataRef.current = updateGameData;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (!isRunningRef.current) return;
      updateGameDataRef.current((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);
};
