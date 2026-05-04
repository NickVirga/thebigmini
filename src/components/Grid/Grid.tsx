import { useRef, useEffect } from "react";
import { Coordinates } from "@/types";
import Cell from "./Cell";
import "./Grid.scss";
import { useGameData } from "@/context/GameDataContext";
import { useGridInput } from "@/hooks/useGridInput";
import { useModal } from "@/context/ModalContext";

const Grid = () => {
  const { gameData, updateGameData } = useGameData();
  const { dimensions, cells, selected, zoomLevel, clues } = gameData;
  const { numGridCols, numGridRows } = dimensions;
  const { isModalOpen } = useModal();
  const gridRef = useRef<HTMLDivElement>(null);

  // Keep keyboard focus on the grid whenever a cell is selected and no modal is open
  useEffect(() => {
    if (selected && !isModalOpen) {
      gridRef.current?.focus({ preventScroll: true });
    }
  }, [selected, isModalOpen]);

  const getMagnifyStyle = (): React.CSSProperties => {
    const row = selected?.coordinates.row ?? Math.floor(numGridRows / 2);
    const col = selected?.coordinates.col ?? Math.floor(numGridCols / 2);
    const cluesIndex = selected?.cluesIndex ?? 0;
    const clueNum = cells[row][col].clues[cluesIndex];
    const clue = clueNum !== null ? clues[clueNum] : null;
    const zoom1 = clue?.zoom1;
    const zoom2Scale = clue?.zoom2Scale ?? 2;
    const zoom2Origin = cells[row][col].zoom2Origins[cluesIndex];

    if (zoomLevel === 1 && zoom1) {
      return {
        transform: `scale(${zoom1.scale})`,
        transformOrigin: `${zoom1.originX * 100}% ${zoom1.originY * 100}%`,
      };
    }

    if (zoomLevel === 2) {
      // Prefer zoom2's own origin; fall back to zoom1 when zoom2Origin is absent.
      const origin = zoom2Origin ?? zoom1;
      if (origin) {
        const scale = zoom2Origin ? zoom2Scale : (zoom1?.scale ?? 1);
        return {
          transform: `scale(${scale})`,
          transformOrigin: `${origin.originX * 100}% ${origin.originY * 100}%`,
        };
      }
    }

    return { transform: "scale(1)" };
  };

  const { handleInput } = useGridInput();

  const handleClickCell = (coordinates: Coordinates) => {
    updateGameData((prev) => {
      const isSameCell =
        prev.selected?.coordinates.row === coordinates.row &&
        prev.selected?.coordinates.col === coordinates.col;

      const newCluesIndex: 0 | 1 = isSameCell
        ? prev.selected!.cluesIndex === 0 ? 1 : 0
        : (prev.selected?.cluesIndex ?? 0);
      const clueNum = cells[coordinates.row][coordinates.col].clues[newCluesIndex];
      const clueCells = clueNum !== null ? clues[clueNum].cells : [];

      return {
        ...prev,
        selected: { coordinates, cluesIndex: newCluesIndex, clueNum, clueCells },
      };
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleInput(event.key, { shift: event.shiftKey });
  };

  const isHighlighted = (coordinates: Coordinates): boolean => {
    if (!selected) return false;
    const selectedClue = selected.clueNum;
    const cellClue = cells[coordinates.row][coordinates.col].clues[selected.cluesIndex];

    if (selectedClue === null || cellClue === null) return false;

    return selectedClue === cellClue;
  };

  return (
    <div className="grid-wrapper">
      <div
        ref={gridRef}
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${dimensions.numGridCols}, 1fr)`,
          ...getMagnifyStyle(),
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (selected && !isModalOpen) {
            gridRef.current?.focus({ preventScroll: true });
          }
        }}
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
              handleClickCell={handleClickCell}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Grid;
