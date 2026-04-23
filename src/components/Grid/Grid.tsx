import { CellData, Coordinates } from "@/types";
import Cell from "./Cell";
import "./Grid.scss";
import { useGameData } from "@/context/GameDataContext";
import { useGridInput } from "@/hooks/useGridInput";

const Grid = () => {
  const { gameData, updateGameData } = useGameData();
  const { dimensions, cells, selected, isMagnified } = gameData;
  const { numGridCols, numGridRows } = dimensions;

  const getMagnifyStyle = (): React.CSSProperties => {
    if (!isMagnified) return {};
    const row = selected?.coordinates.row ?? Math.floor(numGridRows / 2);
    const col = selected?.coordinates.col ?? Math.floor(numGridCols / 2);
    const originX = ((col + 0.5) / numGridCols) * 100;
    const originY = ((row + 0.5) / numGridRows) * 100;
    return {
      transform: "scale(1.75)",
      transformOrigin: `${originX}% ${originY}%`,
    };
  };

  const { handleInput } = useGridInput();

  const handleClickCell = (coordinates: Coordinates) => {
    updateGameData((prev) => {
      const isSameCell =
        prev.selected?.coordinates.row === coordinates.row &&
        prev.selected?.coordinates.col === coordinates.col;

      return {
        ...prev,
        selected: {
          coordinates,
          cluesIndex: isSameCell
            ? prev.selected!.cluesIndex === 0
              ? 1
              : 0
            : (prev.selected?.cluesIndex ?? 0),
        },
      };
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleInput(event.key, { shift: event.shiftKey });
  };

  const getBorderClasses = (cell: CellData): string => {
    const { row, col } = cell.coordinates;
    const isBlank = cell.isBlank;
    const rightEdge = col === numGridCols - 1;
    const bottomEdge = row === numGridRows - 1;
    const topBlank = row === 0 || cells[row - 1][col].isBlank;
    const leftBlank = col === 0 || cells[row][col - 1].isBlank;
    
    return [
      (isBlank && !leftBlank) && "cell--border-left",
      (rightEdge && !isBlank) && "cell--border-right",
      (isBlank && !topBlank) && "cell--border-top",
      (bottomEdge && !isBlank) && "cell--border-bottom",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const isHighlighted = (coordinates: Coordinates): boolean => {
    if (!selected) return false;
    const selectedCoords = selected.coordinates;

    const cluesIndex = selected.cluesIndex;

    const selectedClue =
      cells[selectedCoords.row][selectedCoords.col].clues[cluesIndex];
    const cellClue = cells[coordinates.row][coordinates.col].clues[cluesIndex];

    if (selectedClue === null || cellClue === null) return false;

    return selectedClue === cellClue;
  };

  return (
    <div className="grid-wrapper">
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${dimensions.numGridCols}, 1fr)`, ...getMagnifyStyle() }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {cells.map((row) =>
        row.map((cell) => (
          <Cell
            key={cell.index}
            cell={cell}
            isSelected={
              selected !== null &&
              selected.coordinates.row === cell.coordinates.row &&
              selected.coordinates.col === cell.coordinates.col
            }
            isHighlighted={isHighlighted(cell.coordinates)}
            borderClasses={getBorderClasses(cell)}
            handleClickCell={handleClickCell}
          />
        )),
      )}
    </div>
    </div>
  );
};

export default Grid;
