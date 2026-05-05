import { useGameData } from "@/context/GameDataContext";
import { useClueShift } from "@/hooks/useClueShift";
import { useCompleteGame } from "@/hooks/useCompleteGame";
import { CellData, Coordinates } from "@/types";

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

      updateGameData((prev) => {
        const cluesIndex = prev.selected?.cluesIndex ?? 0;
        const clueNum = newCell.clues[cluesIndex];
        const clueCells = clueNum !== null ? clues[clueNum].cells : [];
        return {
          ...prev,
          selected: { coordinates, cluesIndex, clueNum, clueCells },
        };
      });
    };

    const moveForward = (updatedCells: CellData[][]) => {
      const { moveToNextClue, skipFilled } = gameData.options;
      const currentClueNum = selected.clueNum;
      if (currentClueNum === null) return;

      const currentClueCells = selected.clueCells;
      const clueLen = currentClueCells.length;
      const cellIndexInClue = currentClueCells.findIndex(
        (c) => c.row === row && c.col === col,
      );
      const isLastCellInClue = cellIndexInClue === clueLen - 1;
      const cluesListLen = clues.length;

      let targetCoords: Coordinates | null = null;
      let targetCluesIndex: 0 | 1 = selected.cluesIndex;
      let targetClueNum: number | null = currentClueNum;
      let targetClueCells: Coordinates[] = currentClueCells;

      if (skipFilled) {
        const cellWasEmpty = cells[row][col].value === "" || cells[row][col].isLocked;

        if (cellWasEmpty) {
          // Find next empty or incorrect cell in current clue (forward, wrapping)
          for (let i = 1; i < clueLen; i++) {
            const idx = (cellIndexInClue + i) % clueLen;
            const c = currentClueCells[idx];
            if (updatedCells[c.row][c.col].value === "" || updatedCells[c.row][c.col].isIncorrect) {
              targetCoords = c;
              break;
            }
          }

          // Clue is fully filled — move to next clue if option is set
          if (!targetCoords && moveToNextClue) {
            let tryClueNum = (currentClueNum + 1) % cluesListLen;
            for (let i = 0; i < cluesListLen; i++) {
              const tryClue = clues[tryClueNum];
              const firstEmpty = tryClue.cells.find(
                (c) => updatedCells[c.row][c.col].value === "",
              );
              if (firstEmpty) {
                targetCoords = firstEmpty;
                targetCluesIndex = tryClue.cluesIndex;
                targetClueNum = tryClue.index;
                targetClueCells = tryClue.cells;
                break;
              }
              tryClueNum = (tryClueNum + 1) % cluesListLen;
            }
          }

          if (!targetCoords && !moveToNextClue && !isLastCellInClue) {
            targetCoords = currentClueCells[cellIndexInClue + 1];
          }
        } else {
          // Overwriting a filled cell — advance to next adjacent cell
          if (!isLastCellInClue) {
            targetCoords = currentClueCells[cellIndexInClue + 1];
          } else {
            if (!targetCoords && moveToNextClue) {
              let tryClueNum = (currentClueNum + 1) % cluesListLen;
              for (let i = 0; i < cluesListLen; i++) {
                const tryClue = clues[tryClueNum];
                const firstEmpty = tryClue.cells.find(
                  (c) => updatedCells[c.row][c.col].value === "",
                );
                if (firstEmpty) {
                  targetCoords = firstEmpty;
                  targetCluesIndex = tryClue.cluesIndex;
                  targetClueNum = tryClue.index;
                  targetClueCells = tryClue.cells;
                  break;
                }
                tryClueNum = (tryClueNum + 1) % cluesListLen;
              }
            }
          }
        }
      } else if (moveToNextClue) {
        // Advance one cell; at end of clue, move to first cell of next clue
        if (!isLastCellInClue) {
          targetCoords = currentClueCells[cellIndexInClue + 1];
        } else {
          const nextClueNum = (currentClueNum + 1) % cluesListLen;
          const nextClue = clues[nextClueNum];
          targetCoords = nextClue.cells[0];
          targetCluesIndex = nextClue.cluesIndex;
          targetClueNum = nextClue.index;
          targetClueCells = nextClue.cells;
        }
      } else {
        // skipFilled=false, moveToNextClue=false: advance one cell, stop at end of clue
        if (!isLastCellInClue) {
          targetCoords = currentClueCells[cellIndexInClue + 1];
        }
      }

      if (!targetCoords) return;
      const targetCell = cells[targetCoords.row][targetCoords.col];
      if (targetCell.isBlank) return;
      updateGameData((prev) => ({
        ...prev,
        selected: {
          coordinates: targetCoords!,
          cluesIndex: targetCluesIndex,
          clueNum: targetClueNum,
          clueCells: targetClueCells,
        },
      }));
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
          if (currentCell.isLocked) {
            moveForward(cells);
            break;
          }
          const newValue = key.toUpperCase();

          const newCells = cells.map((r) =>
            r.map((cell) =>
              cell.coordinates.row === row && cell.coordinates.col === col
                ? {
                    ...cell,
                    value: newValue,
                    isIncorrect:
                      gameData.options.autoErrorCheck &&
                      cell.answer !== newValue,
                    isChecked: gameData.options.autoErrorCheck
                      ? cell.answer === newValue
                      : cell.isChecked,
                    isLocked: gameData.options.autoErrorCheck
                      ? cell.answer === newValue
                      : cell.isLocked,
                  }
                : cell,
            ),
          );

          updateGameData((prev) => ({ ...prev, cells: newCells }));
          checkGameComplete(newCells);
          moveForward(newCells);
        }
        break;

      case "Backspace":
        if (currentCell.isLocked) break;
        updateGameData((prev) => ({
          ...prev,
          cells: prev.cells.map((r) =>
            r.map((cell) =>
              cell.coordinates.row === row && cell.coordinates.col === col
                ? { ...cell, value: "", isIncorrect: false }
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
                ? { ...cell, value: "", isIncorrect: false }
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
        const currentClueNum = selected.clueNum;

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
