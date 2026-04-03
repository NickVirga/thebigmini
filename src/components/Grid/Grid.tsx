import { useState } from "react";

import { Coordinates, SelectionDirection } from "@/types";

import Cell from "./Cell";

import "./Grid.scss";

import { useGameData } from "@/context/GameDataContext";

const Grid = () => {
  const { gameData, updateGameData } = useGameData();
  const { dimensions, cells } = gameData;

  const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);

  const [selectionDirection, setSelectionDirection] =
    useState<SelectionDirection>("across");

  const handleClickCell = (coordinates: Coordinates) => {
    if (
      selectedCell?.row === coordinates.row &&
      selectedCell?.col === coordinates.col
    ) {
      setSelectionDirection((prev) => (prev === "across" ? "down" : "across"));
    } else {
      setSelectedCell(coordinates);
    }
  };

const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (!selectedCell) return;
  const { row, col } = selectedCell;
  const { numGridRows, numGridCols } = dimensions;

  const moveForward = () => {
    if (selectionDirection === "down") {
      if (row < numGridRows - 1) setSelectedCell({ row: row + 1, col });
    } else {
      if (col < numGridCols - 1) setSelectedCell({ row, col: col + 1 });
    }
  };

  const moveBackward = () => {
    if (selectionDirection === "down") {
      if (row > 0) setSelectedCell({ row: row - 1, col });
    } else {
      if (col > 0) setSelectedCell({ row, col: col - 1 });
    }
  };

  switch (event.key) {
    default:
      if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        // const newValue = event.key.toUpperCase();
        // updateGameData((prev) => {
        //   const updatedCells = prev.cells.map((r) =>
        //     r.map((cell) =>
        //       cell.coordinates.row === row && cell.coordinates.col === col
        //         ? { ...cell, value: newValue }
        //         : cell,
        //     ),
        //   );
        //   return {
        //     ...prev,
        //     cells: updatedCells,
        //   };
        // });
        moveForward();
      }
      break;

    case "Backspace":
      // updateGameData((prev) => {
      //   const updatedCells = prev.cells.map((r) =>
      //     r.map((cell) =>
      //       cell.coordinates.row === row && cell.coordinates.col === col
      //         ? { ...cell, value: "" }
      //         : cell,
      //     ),
      //   );
      //   return {
      //     ...prev,
      //     cells: updatedCells,
      //   };
      // });
      moveBackward();
      break;

    case "Delete":
      // updateGameData((prev) => {
      //   const updatedCells = prev.cells.map((r) =>
      //     r.map((cell) =>
      //       cell.coordinates.row === row && cell.coordinates.col === col
      //         ? { ...cell, value: "" }
      //         : cell,
      //     ),
      //   );
      //   return {
      //     ...prev,
      //     cells: updatedCells,
      //   };
      // });
      break;

    case " ":
      event.preventDefault();

      break;

    case "ArrowUp":
      event.preventDefault();
      if (row > 0) setSelectedCell({ row: row - 1, col });
      break;
    case "ArrowDown":
      event.preventDefault();
      if (row < numGridRows - 1) setSelectedCell({ row: row + 1, col });
      break;
    case "ArrowLeft":
      event.preventDefault();
      if (col > 0) setSelectedCell({ row, col: col - 1 });
      break;
    case "ArrowRight":
      event.preventDefault();
      if (col < numGridCols - 1) setSelectedCell({ row, col: col + 1 });
      break;
  }
};

  const isHighlighted = (coordinates: Coordinates): boolean => {
    if (!selectedCell) return false;

    const clueIndex = selectionDirection === "across" ? 0 : 1;

    const selectedClue =
      cells[selectedCell.row][selectedCell.col].clues[clueIndex];
    const cellClue = cells[coordinates.row][coordinates.col].clues[clueIndex];

    if (selectedClue === null || cellClue === null) return false;

    return selectedClue === cellClue;
  };

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${dimensions.numGridCols}, auto)` }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {cells.map((row) =>
        row.map((cell) => (
          <Cell
            key={cell.index}
            cell={cell}
            isSelected={
              selectedCell?.row === cell.coordinates.row &&
              selectedCell?.col === cell.coordinates.col
            }
            isHighlighted={isHighlighted(cell.coordinates)}
            handleClickCell={handleClickCell}
          />
        )),
      )}
    </div>
  );
};

export default Grid;
