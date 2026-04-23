import "./ClueContainer.scss";
import { useGameData } from "@/context/GameDataContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Clue } from "@/types";
import { useClueShift } from "@/hooks/useClueShift";

const ClueContainer: React.FC = () => {
  const { shiftClue } = useClueShift();
  const { gameData } = useGameData();
  const { clues, cells, selected } = gameData;

  if (!selected) return null;

  const selectedCell =
    cells[selected.coordinates.row][selected.coordinates.col];
  const selectedClueNum = selectedCell.clues[selected.cluesIndex];
  if (selectedClueNum === null) return null;

  const currentClue: Clue = clues[selectedClueNum];

  const clueDirection = selected.cluesIndex === 0 ? "Across" : "Down";

  return (
    <div className="clue-container">
      <button
        className="clue-container__btn"
        onClick={() => shiftClue(-1)}
        aria-label="Previous clue"
      >
        <FaChevronLeft />
      </button>
      <div className="clue-container__clue">
        <span className="clue-container__label">
          {currentClue.label} {clueDirection}
        </span>
        <span className="clue-container__text">{currentClue.clueText}</span>
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
