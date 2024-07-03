import { useContext } from "react";
import "./ClueList.scss";
import { GameDataContext } from "../../context/GameDataContext";

function ClueList({ cluesData, getCellsInClue }) {
  const { gameData, updateGameData } = useContext(GameDataContext);

  const handleClickClue = (clue) => {
    
    const newCellsInClue = getCellsInClue(clue.cluesIndex, clue.index)

    updateGameData({
        ...gameData,
        selected: {
          ...gameData.selected,
          cellsIndex:
          newCellsInClue[0],
          cellsInClue: newCellsInClue,
          clueNum: clue.index
        },
      });
  };

  return (
    <div className="clue-list">
      <div className="clue-list__across">
        <h3>Across</h3>
        <ul>
          {cluesData.clues
            .filter((clue) => clue.cluesIndex === 0)
            .map((clue) => {
              return (
                <li
                  key={clue.index}
                  className={`clue-list__item ${
                    clue.index === gameData.selected.clueNum
                      ? "clue-list__item--highlighted"
                      : ""
                  }`}
                  onClick={() => {
                    handleClickClue(clue);
                  }}
                ><span className="clue-list__label">{clue.label}</span>
                <span className="clue-list__text">{clue.clueText}</span></li>
              );
            })}
        </ul>
      </div>
      <div className="clue-list__down">
        <h3>Down</h3>
        <ul>
          {cluesData.clues
            .filter((clue) => clue.cluesIndex === 1)
            .map((clue) => {
              return (
                <li
                  key={clue.index}
                  className={`clue-list__item ${
                    clue.index === gameData.selected.clueNum
                      ? "clue-list__item--highlighted"
                      : ""
                  }`}
                  onClick={() => {
                    handleClickClue(clue);
                  }}
                ><span className="clue-list__label">{clue.label}</span>
                <span className="clue-list__text">{clue.clueText}</span></li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ClueList;
