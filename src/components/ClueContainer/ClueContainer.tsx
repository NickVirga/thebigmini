import "./ClueContainer.scss";
import { useGameData } from "@/context/GameDataContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Clue } from "@/types";
import { useClueShift } from "@/hooks/useClueShift";

const ClueContainer: React.FC = () => {
  const { shiftClue } = useClueShift();
  const { gameData, updateGameData } = useGameData();
  const { clues, cells, selected } = gameData;

  const selectedClueNum = selected?.clueNum ?? null;
  const currentClue: Clue | null =
    selectedClueNum !== null ? clues[selectedClueNum] : null;
  const clueDirection = selected?.cluesIndex === 0 ? "Across" : "Down";

  const handleClickClueContainer = () => {
    updateGameData((prev) => {
      if (!prev.selected) return prev;

      const newCluesIndex: 0 | 1 = prev.selected.cluesIndex === 0 ? 1 : 0;
      const { row, col } = prev.selected.coordinates;
      const clueNum = cells[row][col].clues[newCluesIndex];
      const clueCells = clueNum !== null ? clues[clueNum].cells : [];

      return {
        ...prev,
        selected: {
          coordinates: prev.selected.coordinates,
          cluesIndex: newCluesIndex,
          clueNum,
          clueCells,
        },
      };
    });
  };

  return (
    <div className="clue-container">
      <button
        className="clue-container__btn"
        onClick={() => shiftClue(-1)}
        aria-label="Previous clue"
      >
        <FaChevronLeft />
      </button>
      <div className="clue-container__clue" onClick={handleClickClueContainer}>
        <span className="clue-container__label">
          {currentClue ? `${currentClue.label} ${clueDirection}` : ""}
        </span>
        <span className="clue-container__text">
          {currentClue?.clueText ?? ""}
        </span>
      </div>
      <button
        className="clue-container__btn"
        onClick={() => shiftClue(1)}
        aria-label="Next clue"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ClueContainer;
