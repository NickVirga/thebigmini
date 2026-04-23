import { useGameData } from "@/context/GameDataContext";
import { CellSelection } from "@/types";

export const useClueShift = () => {
  const { gameData, updateGameData } = useGameData();
  const { clues, cells, selected } = gameData;

  const clueShift = (direction: 1 | -1): CellSelection | null => {
    if (!selected) return null;

    const selectedCell = cells[selected.coordinates.row][selected.coordinates.col];
    const selectedClueNum = selectedCell.clues[selected.cluesIndex];
    if (selectedClueNum === null) return selected;

    const cluesListLen = clues.length;
    let newClueNum = (selectedClueNum + direction + cluesListLen) % cluesListLen;
    let newClue = clues[newClueNum];

    // dont skip filled, so select first cell in next clue
    if (!gameData.options.skipFilled) {
      return {
        coordinates: newClue.cells[0],
        cluesIndex: newClue.cluesIndex,
      };
    }

    // skipFilled: find next clue with an empty cell
    let attempts = 0;
    while (attempts < cluesListLen) {
      const firstEmpty = newClue.cells
        .map((coords) => cells[coords.row][coords.col])
        .find((cell) => cell.value === "");

      if (firstEmpty !== undefined) {
        return {
          coordinates: firstEmpty.coordinates,
          cluesIndex: newClue.cluesIndex,
        };
      }

      newClueNum = (newClueNum + direction + cluesListLen) % cluesListLen;
      newClue = clues[newClueNum];
      attempts++;
    }

    return selected; // all cells filled, stay put
  };

  const shiftClue = (direction: 1 | -1) => {
    updateGameData((prev) => ({
      ...prev,
      selected: clueShift(direction),
    }));
  };

  return { shiftClue };
};