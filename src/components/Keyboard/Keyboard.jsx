import { useState, useContext } from "react";
import "./Keyboard.scss";
import { GameDataContext } from "../../context/GameDataContext";

import {
  FaDeleteLeft,
  FaMagnifyingGlassPlus,
  FaMagnifyingGlassMinus,
} from "react-icons/fa6";
import { TbReceiptYen } from "react-icons/tb";

function Keyboard({ handleKeyClick }) {
  const { gameData, updateGameData } = useContext(GameDataContext);

  const [layoutNum, setLayoutNum] = useState(0);
  const [checkMenuIsVisible, setCheckMenuIsVisible] = useState(false);
  const [revealMenuIsVisible, setReveakMenuIsVisible] = useState(false);

  const layoutCycle = () => {
    if (layoutNum > 1) {
      setLayoutNum(0);
    } else {
      setLayoutNum(layoutNum + 1);
    }
  };

  const charLayouts = [
    [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M"],
    ],
    [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
      [".", ",", "?", "!", "'"],
    ],
    [
      ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="],
      ["_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•"],
      [".", ",", "?", "!", "'"],
    ],
  ];

  const handleClickZoomIn = () => {
    updateGameData({ ...gameData, magnified: true });
  };

  const handleClickZoomOut = () => {
    updateGameData({ ...gameData, magnified: false });
  };

  const checkRevealIndices = (cellsIndicesArray, revealWord) => {
    let updatedCells = [...gameData.cells];

    cellsIndicesArray.forEach((cellIndex) => {
      const currCell = updatedCells[cellIndex];

      if (!currCell.blank && !currCell.locked) {
        let newLockedStatus = false;
        let newValue = currCell.value;

        if (revealWord) {
          newValue = currCell.answer;
          newLockedStatus = true;
        } else {
          if (currCell.value === currCell.answer) {
            newLockedStatus = true;
          }
        }

        updatedCells = updatedCells.map((cell, i) =>
          i === cellIndex
            ? {
                ...cell,
                checked: true,
                locked: newLockedStatus,
                value: newValue,
              }
            : cell
        );
      }
    });

    updateGameData({
      ...gameData,
      cells: updatedCells,
    });
  };

  return (
    <div className="keyboard">
      <div className="keyboard__container">
        <div className="keyboard__key-row">
          <div
            className="keyboard__key keyboard__key--controls"
            onClick={
              gameData.magnified
                ? () => {
                    handleClickZoomOut();
                  }
                : () => {
                    handleClickZoomIn();
                  }
            }
          >
            {!gameData.magnified && (
              <FaMagnifyingGlassPlus></FaMagnifyingGlassPlus>
            )}
            {gameData.magnified && (
              <FaMagnifyingGlassMinus></FaMagnifyingGlassMinus>
            )}
          </div>
          <div
            className="keyboard__key keyboard__check-btn"
            onClick={() => {
              setCheckMenuIsVisible(!checkMenuIsVisible);
            }}
          >
            Check
            {checkMenuIsVisible && (
              <ul className="keyboard__check-list">
                <li
                  className="keyboard__check-item"
                  onClick={() => {
                    checkRevealIndices([gameData.selected.cellsIndex], false);
                  }}
                >
                  Letter
                </li>
                <li
                  className="keyboard__check-item"
                  onClick={() => {
                    checkRevealIndices(gameData.selected.cellsInClue, false);
                  }}
                >
                  Word
                </li>
                <li
                  className="keyboard__check-item"
                  onClick={() => {
                    checkRevealIndices(
                      Array.from(
                        { length: gameData.cells.length },
                        (_, index) => index
                      ),
                      false
                    );
                  }}
                >
                  Grid
                </li>
              </ul>
            )}
          </div>
          <div className="keyboard__key keyboard__key--controls">Reveal</div>
        </div>
        {charLayouts[layoutNum].map((chars, index) => (
          <div key={index} className="keyboard__key-row">
            {index === 2 && (
              <div
                className="keyboard__key keyboard__key--auxiliary"
                onClick={() => {
                  layoutCycle();
                }}
              >
                123
              </div>
            )}
            {chars.map((char, index) => (
              <div
                key={index}
                className="keyboard__key"
                onClick={() => {
                  handleKeyClick(char);
                }}
              >
                {char}
              </div>
            ))}
            {index === 2 && (
              <div
                className="keyboard__key keyboard__key--auxiliary"
                onClick={() => {
                  handleKeyClick("Backspace");
                }}
              >
                <FaDeleteLeft></FaDeleteLeft>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
