import { useState, useEffect, useContext, useRef } from "react";
import "./App.scss";
import Modal from "./components/Modal/Modal";
import Cell from "./components/Cell/Cell";
import ClueList from "./components/ClueList/ClueList";
import Keyboard from "./components/Keyboard/Keyboard";
import { GameDataContext } from "./context/GameDataContext";
import { ModalContext } from "./context/ModalContext";
import { AuthContext } from "./context/AuthContext";
import "./styles/partials/_global.scss";
import cluesData from "./assets/data/clue-data.json";
import logo from "./assets/images/bigmini-logo.png";
import axios from 'axios'

import {
  FaGear,
  FaRegCircleQuestion,
  FaChartSimple,
  FaAngleLeft,
  FaAngleRight,
  FaCircleUser,
} from "react-icons/fa6";

function App() {
  const { gameData, updateGameData } = useContext(GameDataContext);
  const { updateModalMode } = useContext(ModalContext);
  const { loggedIn } = useContext(AuthContext);

  const [checkMenuIsVisible, setCheckMenuIsVisible] = useState(false);
  const [revealMenuIsVisible, setRevealMenuIsVisible] = useState(false);
  const checkMenuRef = useRef(null);
  const revealMenuRef = useRef(null);

  const numRows = gameData.numRows;
  const numCols = gameData.numCols;

  const determineZoomSection = () => {
    const index = gameData.selected.cellsIndex;

    if (index === null) {
      return "top left";
    }

    let vertOrient;
    let horizOrient;

    if (index < Math.floor((numCols * numRows) / 3)) {
      vertOrient = "top";
    } else if (index < Math.floor((numCols * numRows * 2) / 3)) {
      vertOrient = "center";
    } else {
      vertOrient = "bottom";
    }

    const modByCols = index % numCols;
    if (modByCols < Math.floor(numCols / 3)) {
      horizOrient = "left";
    } else if (modByCols < Math.floor((numCols * 2) / 3)) {
      horizOrient = "center";
    } else {
      horizOrient = "right";
    }

    return vertOrient + " " + horizOrient;
  };

  const gridContainerStyle = {
    transformOrigin: determineZoomSection(),
    gridTemplateColumns: `repeat(${numCols}, 1fr)`,
    gridTemplateRows: `repeat(${numRows}, 1fr)`,
  };

  const [modalOpen, setModalOpen] = useState(
    gameData.playedBefore ? false : true
  );

  const inputRef = useRef(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    updateGameData({ ...gameData, playedBefore: true });
  };

  const openModal = (contentNum) => {
    updateModalMode(contentNum);
    setModalOpen(true);
  };

  const handleClickCell = (newCellsIndex) => {
    let newCluesIndex = gameData.selected.cluesIndex;

    if (newCellsIndex === gameData.selected.cellsIndex) {
      //toggle cluesIndex b/w row & col
      newCluesIndex = newCluesIndex === 0 ? 1 : 0;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!gameData.cells[newCellsIndex].blank) {
      const newClueNum = gameData.cells[newCellsIndex].clues[newCluesIndex];

      const cellsInClue = getCellsInClue(newCluesIndex, newClueNum);

      updateGameData({
        ...gameData,
        selected: {
          ...gameData.selected,
          cellsIndex: newCellsIndex,
          cellsInClue: cellsInClue,
          cluesIndex: newCluesIndex,
          clueNum: newClueNum,
        },
      });
    }
  };

  const isSelected = (cellsIndex) => {
    return cellsIndex === gameData.selected.cellsIndex;
  };

  const isHighlighted = (cellsIndex) => {
    if (!gameData.selected.cellsIndex) return false;
    return gameData.selected.cellsInClue.includes(cellsIndex);
  };

  const getCellsInClue = (cluesIndex, clueNum) => {
    let cellsList = [];
    for (let i = 0; i < gameData.cells.length; i++) {
      if (gameData.cells[i].clues[cluesIndex] === clueNum) {
        cellsList.push(i);
      }
    }
    return cellsList.sort((a, b) => a - b);
  };

  const shiftClueSelection = (stepSize) => {
    const currClueNum = gameData.selected.clueNum;
    const cluesList = cluesData.clues;

    if (stepSize >= cluesList.length) return;

    let nextClueNum = currClueNum + stepSize;

    if (nextClueNum > cluesList.length - 1) {
      //clueNum exceeds largest
      nextClueNum = 0; //go to first
    }

    if (nextClueNum < 0) {
      //clueNum below smallest
      nextClueNum = cluesList.length - 1; //go to last
    }

    const nextCluesIndex = cluesData.clues[nextClueNum].cluesIndex;

    let nextCellsinClue = [];
    for (let i = 0; i < gameData.cells.length; i++) {
      if (gameData.cells[i].clues[nextCluesIndex] === nextClueNum) {
        nextCellsinClue.push(i);
      }
    }
    nextCellsinClue.sort((a, b) => a - b);

    if (nextCellsinClue.length > 0)
      updateGameData({
        ...gameData,
        selected: {
          ...gameData.selected,
          cellsIndex: nextCellsinClue[0],
          cellsInClue: nextCellsinClue,
          cluesIndex: nextCluesIndex,
          clueNum: nextClueNum,
        },
      });
  };

  const changeLetter = (newValue, index) => {
    if (gameData.cells[index].revealed) return;
    updateGameData({
      ...gameData,
      cells: gameData.cells.map((cell, i) =>
        i === index ? { ...cell, value: newValue, incorrectFlag: false } : cell
      ),
    });
  };

  const clueShift = (posShiftAmount) => {
    const clues = gameData.selected.cellsInClue;
    const index = gameData.selected.cellsIndex;

    const pos = clues.indexOf(index);
    if (posShiftAmount > 0) {
      if (pos === clues.length - 1) {
        return index;
      }
    } else {
      if (pos === 0) {
        return index;
      }
    }

    return clues[pos + posShiftAmount];
  };

  const handleKeyDown = (key) => {
    let selectedCellsIndex = gameData.selected.cellsIndex;

    if (selectedCellsIndex !== null && !gameData.winState) {
      switch (key) {
        case "Backspace":
          if (
            gameData.cells[selectedCellsIndex].value !== "" &&
            !gameData.cells[selectedCellsIndex].revealed
          ) {
            changeLetter("", selectedCellsIndex);
          } else {
            const newCellsIndex = clueShift(-1);
            let updatedCells = gameData.cells;
            if (!gameData.cells[newCellsIndex].revealed) {
              updatedCells = gameData.cells.map((cell, i) =>
                i === newCellsIndex
                  ? { ...cell, value: "", incorrectFlag: false }
                  : cell
              );
            }
            updateGameData({
              ...gameData,
              cells: updatedCells,
              selected: {
                ...gameData.selected,
                cellsIndex: newCellsIndex,
              },
            });
          }
          break;

        case "Delete":
          changeLetter("", selectedCellsIndex);
          break;
        case " ":
          let updatedCells = gameData.cells;
          if (!gameData.cells[selectedCellsIndex].revealed) {
            updatedCells = gameData.cells.map((cell, i) =>
              i === selectedCellsIndex
                ? { ...cell, value: "", incorrectFlag: fals }
                : cell
            );
          }
          updateGameData({
            ...gameData,
            cells: updatedCells,
            selected: {
              ...gameData.selected,
              cellsIndex: clueShift(1),
            },
          });
          break;
        case "Home":
          updateGameData({
            ...gameData,
            selected: {
              ...gameData.selected,
              cellsIndex: gameData.selected.cellsInClue[0],
            },
          });
          break;
        case "End":
          updateGameData({
            ...gameData,
            selected: {
              ...gameData.selected,
              cellsIndex:
                gameData.selected.cellsInClue[
                  gameData.selected.cellsInClue.length - 1
                ],
            },
          });
          break;
        case "ArrowUp":
          if (gameData.selected.cluesIndex === 1) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex
              );

            if (selectionIndexInClueList > 0) {
              updateGameData({
                ...gameData,
                selected: {
                  ...gameData.selected,
                  cellsIndex:
                    gameData.selected.cellsInClue[selectionIndexInClueList - 1],
                },
              });
            }
          } else {
            handleClickCell(gameData.selected.cellsIndex - numCols);
          }

          break;
        case "ArrowDown":
          if (gameData.selected.cluesIndex === 1) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex
              );
            if (
              selectionIndexInClueList <
              gameData.selected.cellsInClue.length - 1
            ) {
              updateGameData({
                ...gameData,
                selected: {
                  ...gameData.selected,
                  cellsIndex:
                    gameData.selected.cellsInClue[selectionIndexInClueList + 1],
                },
              });
            }
          } else {
            handleClickCell(gameData.selected.cellsIndex + numCols);
          }

          break;
        case "ArrowLeft":
          if (gameData.selected.cluesIndex === 0) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex
              );
            if (selectionIndexInClueList > 0) {
              updateGameData({
                ...gameData,
                selected: {
                  ...gameData.selected,
                  cellsIndex:
                    gameData.selected.cellsInClue[selectionIndexInClueList - 1],
                },
              });
            }
          } else {
            handleClickCell(gameData.selected.cellsIndex - 1);
          }

          break;
        case "ArrowRight":
          if (gameData.selected.cluesIndex === 0) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex
              );
            if (
              selectionIndexInClueList <
              gameData.selected.cellsInClue.length - 1
            ) {
              updateGameData({
                ...gameData,
                selected: {
                  ...gameData.selected,
                  cellsIndex:
                    gameData.selected.cellsInClue[selectionIndexInClueList + 1],
                },
              });
            }
          } else {
            handleClickCell(gameData.selected.cellsIndex + 1);
          }

          break;

        case "Tab":
          event.preventDefault(); // Prevent the default tab behavior
          shiftClueSelection(1);
          break;
      }

      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        const updatedCells = gameData.cells.map((cell, i) =>
          i === selectedCellsIndex
            ? { ...cell, value: key.toUpperCase(), incorrectFlag: false }
            : cell
        );
        updateGameData({
          ...gameData,
          cells: updatedCells,
          selected: {
            ...gameData.selected,
            cellsIndex: clueShift(1),
          },
        });
      }
    }
  };

  const checkIfGameComplete = () => {
    let incorrectDetected = false;
    let emptyDetected = false;
    let cells = gameData.cells;
    for (let i = 0; i < cells.length - 1; i++) {
      if (!cells[i].blank) {
        if (cells[i].value === "") {
          emptyDetected = true;
        }
        if (cells[i].value !== cells[i].answer) {
          incorrectDetected = true;
        }
      }

      if (emptyDetected) break;
    }

    if (!emptyDetected) {
      if (!incorrectDetected) {
        console.log(calculateScore())
        updateGameData({
          ...gameData,
          winState: true,
        });
      }
      updateModalMode(2);
      setModalOpen(true);
    }
  };

  const checkRevealIndices = (cellsIndicesArray, revealWord) => {
    let updatedCells = [...gameData.cells];

    cellsIndicesArray.forEach((cellIndex) => {
      const currCell = updatedCells[cellIndex];

      //proceed if cell isn't a blank (possible with grid), cell hasn't be revealed (not locked),
      //cell value isn't blank while a check is being performed (nothing to check)
      if (
        !currCell.blank &&
        !(currCell.value === "" && !revealWord) &&
        !currCell.revealed
      ) {
        let newLockedStatus = false;
        let newValue = currCell.value;
        let newIncorrectStatus = false;

        if (revealWord) {
          newValue = currCell.answer;
          newLockedStatus = true;
        } else {
          if (currCell.value === currCell.answer) {
            newLockedStatus = true;
          } else {
            newIncorrectStatus = true;
          }
        }

        updatedCells = updatedCells.map((cell, i) =>
          i === cellIndex
            ? {
                ...cell,
                checked: true,
                revealed: newLockedStatus,
                incorrectFlag: newIncorrectStatus,
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

  const handleClickOutside = (event) => {
    if (checkMenuRef.current && !checkMenuRef.current.contains(event.target)) {
      setCheckMenuIsVisible(false);
    }
    if (
      revealMenuRef.current &&
      !revealMenuRef.current.contains(event.target)
    ) {
      setRevealMenuIsVisible(false);
    }
  };

  const calculateScore = () => {

    let scoreNumerator = numRows*numCols

    gameData.cells.forEach(cell => {
      scoreNumerator += cell.revealed ? -1 : cell.checked ? -0.5 : 0
    })

    return scoreNumerator / (numRows*numCols) * 100

  }

  const sendGameScore = async () => {
    const reqBody = { gameId: gameData.gameId, gameScore: calculateScore() }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/games`,
        reqBody
      );


    } catch (err) {
      console.error(err)
    }


  }
 
  useEffect(() => {
    checkIfGameComplete();
  }, [gameData.cells]);

  useEffect(() => {
    const handleKeyDownWrapper = (event) => handleKeyDown(event.key);

    window.addEventListener("keydown", handleKeyDownWrapper);

    return () => {
      window.removeEventListener("keydown", handleKeyDownWrapper);
    };
  }, [gameData]);

  useEffect(() => {
    if (checkMenuIsVisible || revealMenuIsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [checkMenuIsVisible, revealMenuIsVisible]);

  if (!gameData) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    // if cellsIndex is null, set initial cell to be selected per initCellsIndex
    if (gameData.selected.cellsIndex === null) {
      handleClickCell(gameData.selected.initCellsIndex);
    }
  }, []);

  return (
    <div
      className={`app ${
        gameData.darkThemeEnabled ? "dark-theme" : "default-theme"
      }`}
    >
      <Modal open={modalOpen} onClose={handleCloseModal} />
      <header className="app__header">
        <h1 className="app__title">The BIGmini Crossword</h1>
        <img src={logo} className="app__logo" alt="logo" />
        <div className="app__icons">
          <FaRegCircleQuestion
            className="app__icon"
            onClick={() => {
              openModal(0);
            }}
          />
          <FaChartSimple
            className="app__icon"
            onClick={() => {
              loggedIn ? openModal(3) : openModal(4);
            }}
          />
          <FaCircleUser
            className="app__icon"
            onClick={() => {
              openModal(4);
            }}
          />
          <FaGear
            className="app__icon"
            onClick={() => {
              openModal(1);
            }}
          />
        </div>
      </header>
      <div className="app__container">
        <ul className="app__control-bar">
          <li className="app__control-item" ref={checkMenuRef}>
            <div
              className={`app__control-btn ${
                checkMenuIsVisible ? "app__control-btn--active" : ""
              }`}
              onClick={() => {
                setCheckMenuIsVisible(!checkMenuIsVisible);
              }}
            >
              Check
            </div>
            {checkMenuIsVisible && (
              <ul className="app__dropdown">
                <li
                  className="app__dropdown-item"
                  onClick={() => {
                    checkRevealIndices([gameData.selected.cellsIndex], false);
                    setCheckMenuIsVisible(false);
                  }}
                >
                  Letter
                </li>
                <li
                  className="app__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(gameData.selected.cellsInClue, false);
                    setCheckMenuIsVisible(false);
                  }}
                >
                  Word
                </li>
                <li
                  className="app__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(
                      Array.from(
                        { length: gameData.cells.length },
                        (_, index) => index
                      ),
                      false
                    );
                    setCheckMenuIsVisible(false);
                  }}
                >
                  Grid
                </li>
              </ul>
            )}
          </li>
          <li className="app__control-item" ref={revealMenuRef}>
            <div
              className={`app__control-btn ${
                revealMenuIsVisible ? "app__control-btn--active" : ""
              }`}
              onClick={() => {
                setRevealMenuIsVisible(!revealMenuIsVisible);
              }}
            >
              Reveal
            </div>
            {revealMenuIsVisible && (
              <ul className="app__dropdown">
                <li
                  className="app__dropdown-item"
                  onClick={() => {
                    checkRevealIndices([gameData.selected.cellsIndex], true);
                    setRevealMenuIsVisible(false);
                  }}
                >
                  Letter
                </li>
                <li
                  className="app__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(gameData.selected.cellsInClue, true);
                    setRevealMenuIsVisible(false);
                  }}
                >
                  Word
                </li>
                <li
                  className="app__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(
                      Array.from(
                        { length: gameData.cells.length },
                        (_, index) => index
                      ),
                      true
                    );
                    setRevealMenuIsVisible(false);
                  }}
                >
                  Grid
                </li>
              </ul>
            )}
          </li>
        </ul>
        <div className="app__cluelist-container">
          <div
            className={`app__grid-container${
              gameData.magnified ? "--zoom" : ""
            }`}
            style={gridContainerStyle}
            onKeyDown={handleKeyDown}
          >
            {gameData.cells.map((cell) => (
              <Cell
                key={cell.index}
                cellData={cell}
                isSelected={isSelected(cell.index)}
                isHighlighted={isHighlighted(cell.index)}
                handleClickCell={handleClickCell}
              />
            ))}
          </div>
          <ClueList
            cluesData={cluesData}
            getCellsInClue={getCellsInClue}
          />
        </div>
        <div className="app__clue-container">
          <FaAngleLeft
            className="app__icon app__clue-icon"
            onClick={() => {
              shiftClueSelection(-1);
            }}
          />
          <span
            className="app__clue-text"
            onClick={() => {
              handleClickCell(gameData.selected.cellsIndex);
            }}
          >
            {gameData.selected.clueNum !== null
              ? cluesData.clues[gameData.selected.clueNum].clueText
              : ""}
          </span>
          <FaAngleRight
            className="app__icon app__clue-icon"
            onClick={() => {
              shiftClueSelection(1);
            }}
          />
        </div>
        <Keyboard
          handleKeyClick={handleKeyDown}
          handleCheckReveal={checkRevealIndices}
        />
      </div>
      <input
        className="app__input-overlay"
        ref={inputRef}
        type="text"
        inputMode=""
        style={{
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
          opacity: 0,
        }}
      />
      <footer className="app__footer">created by Nick Virga - 2024</footer>
    </div>
  );
}

export default App;
