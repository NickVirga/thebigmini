import { useGameData } from "@/context/GameDataContext";
import { useClueShift } from "@/hooks/useClueShift";
import { useCompleteGame } from "@/hooks/useCompleteGame";
import { Coordinates } from "@/types";

export const useGridInput = () => {
  const { gameData, updateGameData } = useGameData();
  const { shiftClue } = useClueShift();
  const { checkGameComplete } = useCompleteGame();

  const handleInput = (key: string, modifier?: { shift?: boolean }) => {
    const { cells, selected, dimensions, clues } = gameData;

    if (!selected) return;
    const { row, col } = selected.coordinates;
    const { numGridRows, numGridCols } = dimensions;

    const moveSelected = (coordinates: Coordinates) => {
      const newCell = cells[coordinates.row][coordinates.col];
      if (newCell.isBlank) return;

      updateGameData((prev) => ({
        ...prev,
        selected: prev.selected
          ? { ...prev.selected, coordinates }
          : { coordinates, cluesIndex: 0 },
      }));
    };

    const moveForward = () => {
      if (selected.cluesIndex === 1) {
        if (row < numGridRows - 1) moveSelected({ row: row + 1, col });
      } else {
        if (col < numGridCols - 1) moveSelected({ row, col: col + 1 });
      }
    };

    const moveBackward = () => {
      if (selected.cluesIndex === 1) {
        if (row > 0) moveSelected({ row: row - 1, col });
      } else {
        if (col > 0) moveSelected({ row, col: col - 1 });
      }
    };

    const currentCell = cells[row][col];

    switch (key) {
      default:
        if (key.length === 1 && /^[a-zA-Z0-9]$/.test(key)) {
          if (currentCell.isLocked) break;
          const newValue = key.toUpperCase();

          const newCells = cells.map((r) =>
            r.map((cell) =>
              cell.coordinates.row === row && cell.coordinates.col === col
                ? { ...cell, value: newValue, isIncorrect: false }
                : cell,
            ),
          );

          updateGameData((prev) => ({ ...prev, cells: newCells }));
          checkGameComplete(newCells);
          moveForward();
        }
        break;

      case "Backspace":
        if (currentCell.isLocked) break;
        updateGameData((prev) => ({
          ...prev,
          cells: prev.cells.map((r) =>
            r.map((cell) =>
              cell.coordinates.row === row && cell.coordinates.col === col
                ? { ...cell, value: "" }
                : cell,
            ),
          ),
        }));
        moveBackward();
        break;

      case "Delete":
        if (currentCell.isLocked) break;
        updateGameData((prev) => ({
          ...prev,
          cells: prev.cells.map((r) =>
            r.map((cell) =>
              cell.coordinates.row === row && cell.coordinates.col === col
                ? { ...cell, value: "" }
                : cell,
            ),
          ),
        }));
        break;

      case "ArrowUp":
        if (row > 0) moveSelected({ row: row - 1, col });
        break;

      case "ArrowDown":
        if (row < numGridRows - 1) moveSelected({ row: row + 1, col });
        break;

      case "ArrowLeft":
        if (col > 0) moveSelected({ row, col: col - 1 });
        break;

      case "ArrowRight":
        if (col < numGridCols - 1) moveSelected({ row, col: col + 1 });
        break;

      case "Tab":
        shiftClue(modifier?.shift ? -1 : 1);
        break;

      case "Home":
      case "End": {
        const currentClueNum = cells[row][col].clues[selected.cluesIndex];

        if (currentClueNum === null) break;

        const currentClue = clues[currentClueNum];

        const coordinates =
          key === "Home"
            ? currentClue.cells[0]
            : currentClue.cells[currentClue.cells.length - 1];

        updateGameData((prev) => ({
          ...prev,
          selected: { ...prev.selected!, coordinates },
        }));
        break;
      }
    }
  };

  return { handleInput };
};
