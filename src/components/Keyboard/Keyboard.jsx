import { useState, useContext, useEffect, useRef } from "react";
import "./Keyboard.scss";
import { GameDataContext } from "../../context/GameDataContext";

import {
  FaDeleteLeft,
  FaMagnifyingGlassPlus,
  FaMagnifyingGlassMinus,
} from "react-icons/fa6";

function Keyboard({ handleKeyClick, handleCheckReveal }) {
  const { gameData, updateGameData } = useContext(GameDataContext);

  const [layoutNum, setLayoutNum] = useState(0);
  const [checkMenuIsVisible, setCheckMenuIsVisible] = useState(false);
  const [revealMenuIsVisible, setRevealMenuIsVisible] = useState(false);
  const checkMenuRef = useRef(null);
  const revealMenuRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (checkMenuRef.current && !checkMenuRef.current.contains(event.target)) {
      setCheckMenuIsVisible(false);
    }
    if (revealMenuRef.current && !revealMenuRef.current.contains(event.target)) {
      setRevealMenuIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeDropMenus = () => {
    setCheckMenuIsVisible(false);
    setRevealMenuIsVisible(false);
  }

  return (
    <div className="keyboard">
      {(checkMenuIsVisible || revealMenuIsVisible) && <div className="keyboard__overlay" onClick={()=>{closeDropMenus()}}>
        {" "}
      </div>}
      <div className="keyboard__container">
        <div className="keyboard__key-row">
          <div
            className="keyboard__zoom-btn"
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
            className={`keyboard__dropdown-btn ${
              checkMenuIsVisible ? "keyboard__dropdown-btn--active" : ""
            }`}
            onClick={() => {
              setCheckMenuIsVisible(!checkMenuIsVisible);
            }}
            ref={checkMenuRef}
          >
            Check
            {checkMenuIsVisible && (
              <ul className="keyboard__dropdown-list">
                <li
                  className="keyboard__dropdown-item"
                  onClick={() => {
                    handleCheckReveal([gameData.selected.cellsIndex], false);
                  }}
                >
                  Letter
                </li>
                <li
                  className="keyboard__dropdown-item"
                  onClick={() => {
                    handleCheckReveal(gameData.selected.cellsInClue, false);
                  }}
                >
                  Word
                </li>
                <li
                  className="keyboard__dropdown-item"
                  onClick={() => {
                    handleCheckReveal(
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
          <div
            className={`keyboard__dropdown-btn ${
              revealMenuIsVisible ? "keyboard__dropdown-btn--active" : ""
            }`}
            onClick={() => {
              setRevealMenuIsVisible(!revealMenuIsVisible);
            }}
            ref={revealMenuRef}
          >
            Reveal
            {revealMenuIsVisible && (
              <ul className="keyboard__dropdown-list">
                <li
                  className="keyboard__dropdown-item"
                  onClick={() => {
                    handleCheckReveal([gameData.selected.cellsIndex], true);
                  }}
                >
                  Letter
                </li>
                <li
                  className="keyboard__dropdown-item"
                  onClick={() => {
                    handleCheckReveal(gameData.selected.cellsInClue, true);
                  }}
                >
                  Word
                </li>
                <li
                  className="keyboard__dropdown-item"
                  onClick={() => {
                    handleCheckReveal(
                      Array.from(
                        { length: gameData.cells.length },
                        (_, index) => index
                      ),
                      true
                    );
                  }}
                >
                  Grid
                </li>
              </ul>
            )}
          </div>
        </div>
        {charLayouts[layoutNum].map((chars, index) => (
          <div key={index} className="keyboard__key-row">
            {index === 2 && (
              <div
                className="keyboard__layout-toggle-btn"
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
                className="keyboard__backspace-btn"
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
