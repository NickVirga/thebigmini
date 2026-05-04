import { useGameData } from "@/context/GameDataContext";
import { useModal } from "@/context/ModalContext";
import { useCompleteGame } from "@/hooks/useCompleteGame";
import { CellData } from "@/types";

export const useCheckReveal = () => {
  const { gameData, updateGameData } = useGameData();
  const { cells, selected, clues } = gameData;
  const { openConfirm } = useModal();
  const { checkGameComplete } = useCompleteGame();

  const getSelectedCell = (): CellData | null => {
    if (!selected) return null;
    return cells[selected.coordinates.row][selected.coordinates.col];
  };

  const getWordCells = (): CellData[] => {
    if (!selected) return [];
    const selectedCell = cells[selected.coordinates.row][selected.coordinates.col];
    const clueNum = selectedCell.clues[selected.cluesIndex];
    if (clueNum === null) return [];
    return clues[clueNum].cells.map((coords) => cells[coords.row][coords.col]);
  };

  const getAllCells = (): CellData[] =>
    cells.flat().filter((cell) => !cell.isBlank);

  const checkCells = (targetCells: CellData[]) => {
    const targetSet = new Set(
      targetCells.map((c) => `${c.coordinates.row},${c.coordinates.col}`)
    );
    const newCells = cells.map((row) =>
      row.map((cell) => {
        if (!targetSet.has(`${cell.coordinates.row},${cell.coordinates.col}`)) return cell;
        if (cell.isLocked || cell.value === "") return cell;
        return {
          ...cell,
          isChecked: true,
          isIncorrect: cell.value !== cell.answer,
          isLocked: cell.value === cell.answer,
        };
      })
    );
    updateGameData((prev) => ({ ...prev, cells: newCells }));
    checkGameComplete(newCells);
  };

  const revealCells = (targetCells: CellData[]) => {
    const targetSet = new Set(
      targetCells.map((c) => `${c.coordinates.row},${c.coordinates.col}`)
    );
    const newCells = cells.map((row) =>
      row.map((cell) => {
        if (!targetSet.has(`${cell.coordinates.row},${cell.coordinates.col}`)) return cell;
        if (cell.isLocked) return cell;
        return {
          ...cell,
          value: cell.answer,
          isRevealed: true,
          isLocked: true,
          isIncorrect: false,
        };
      })
    );
    updateGameData((prev) => ({ ...prev, cells: newCells }));
    checkGameComplete(newCells);
  };

  const checkLetter = () => {
    const cell = getSelectedCell();
    if (cell) checkCells([cell]);
  };

  const checkWord = () => checkCells(getWordCells());
  const checkGrid = () =>
    openConfirm({
      message: "Check all cells in the grid?",
      description: "This will reduce your max possible score by half.",
      onConfirm: () => checkCells(getAllCells()),
    });

  const revealLetter = () => {
    const cell = getSelectedCell();
    if (cell) revealCells([cell]);
  };

  const revealWord = () => revealCells(getWordCells());
  const revealGrid = () =>
    openConfirm({
      message: "Reveal all cells in the grid?",
      description: "This will reduce your score to zero.",
      onConfirm: () => revealCells(getAllCells()),
    });

  return { checkLetter, checkWord, checkGrid, revealLetter, revealWord, revealGrid };
};
