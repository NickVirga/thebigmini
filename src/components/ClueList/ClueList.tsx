import { useRef, useEffect } from "react";
import "./ClueList.scss";
import { useGameData } from "@/context";
import { Clue } from "@/types";

const ClueList: React.FC = () => {
  const { gameData, updateGameData } = useGameData();
  const { clues, cells, selected, options } = gameData;
  const clueRefs = useRef<Record<number, HTMLLIElement | null>>({});

  const selectedClueNum = selected
    ? cells[selected.coordinates.row][selected.coordinates.col].clues[
        selected.cluesIndex
      ]
    : null;

  useEffect(() => {
    if (selectedClueNum != null && clueRefs.current[selectedClueNum]) {
      clueRefs.current[selectedClueNum]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedClueNum]);

  const handleClickClue = (clue: Clue) => {
    let targetCoords = clue.cells[0];
    if (options.skipFilled) {
      const firstEmpty = clue.cells.find(
        (coords) => cells[coords.row][coords.col].value === ""
      );
      if (firstEmpty) targetCoords = firstEmpty;
    }
    updateGameData((prev) => ({
      ...prev,
      selected: {
        coordinates: targetCoords,
        cluesIndex: clue.cluesIndex,
      },
    }));
  };

  const renderClues = (list: Clue[]) =>
    list.map((clue) => (
      <li
        key={clue.index}
        className={`clue-list__item${
          clue.index === selectedClueNum ? " clue-list__item--highlighted" : ""
        }`}
        onClick={() => handleClickClue(clue)}
        ref={(el) => (clueRefs.current[clue.index] = el)}
      >
        <span className="clue-list__label">{clue.label}</span>
        <span className="clue-list__text">{clue.clueText}</span>
      </li>
    ));

  return (
    <div className="clue-list">
      <div className="clue-list__section">
        <h3 className="clue-list__heading">Across</h3>
        <div className="clue-list__list-container">
          <ul className="clue-list__list">
            {renderClues(clues.filter((c) => c.cluesIndex === 0))}
          </ul>
        </div>
      </div>
      <div className="clue-list__section">
        <h3 className="clue-list__heading">Down</h3>
        <div className="clue-list__list-container">
          <ul className="clue-list__list">
            {renderClues(clues.filter((c) => c.cluesIndex === 1))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClueList;
