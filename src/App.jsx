import { useState, useEffect, useContext, useRef } from "react";
import "./App.scss";
import Modal from "./components/Modal/Modal";
import Cell from "./components/Cell/Cell";
import ClueList from "./components/ClueList/ClueList";
import { GameDataContext } from "./context/GameDataContext";
import { ModalContext } from "./context/ModalContext";
import "./styles/partials/_global.scss";
import cluesData from "./assets/data/clue-data.json";

import {
  FaGear,
  FaRegCircleQuestion,
  FaChartSimple,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa6";

function App() {
  const { gameData, updateGameData } = useContext(GameDataContext);
  const { updateModalMode } = useContext(ModalContext);

  const isLoggedIn = false;

  const numRows = gameData.numRows;
  const numCols = gameData.numCols;

  const gridContainerStyle = {
    gridTemplateColumns: `repeat(${numCols}, minmax(4rem, 1fr))`,
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
    updateGameData({
      ...gameData,
      cells: gameData.cells.map((cell, i) =>
        i === index ? { ...cell, value: newValue } : cell
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

  const handleKeyDown = (event) => {
    let selectedCellsIndex = gameData.selected.cellsIndex;
    const key = event.key;

    if (selectedCellsIndex !== null && !gameData.winState) {
      switch (key) {
        case "Backspace":
          if (gameData.cells[selectedCellsIndex].value !== "") {
            changeLetter("", selectedCellsIndex);
          } else {
            const newCellsIndex = clueShift(-1);
            const updatedCells = gameData.cells.map((cell, i) =>
              i === newCellsIndex ? { ...cell, value: "" } : cell
            );
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
          const updatedCells = gameData.cells.map((cell, i) =>
            i === selectedCellsIndex ? { ...cell, value: "" } : cell
          );
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
            shiftClueSelection(-1);
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
            shiftClueSelection(1);
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
            shiftClueSelection(-1);
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
            shiftClueSelection(1);
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
            ? { ...cell, value: key.toUpperCase() }
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

      if (emptyDetected || incorrectDetected) break;
    }
    console.log("emptyDetected", emptyDetected)
    console.log("incorrectDetected", incorrectDetected)
    if (!emptyDetected) {
      if (!incorrectDetected) {
        updateGameData({
          ...gameData,
          winState: true,
        });
      }
      updateModalMode(2);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    checkIfGameComplete();
  }, [gameData.cells]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameData]);

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
      <Modal open={modalOpen} onClose={handleCloseModal}></Modal>
      <header className="app__header">
        <h1 className="app__title">The <span className="app__title-big">Big</span><span className="app__title-mini">Mini</span> Crossword</h1>
        <div className="app__icons">
          <FaRegCircleQuestion
            className="app__icon"
            onClick={() => {
              openModal(0);
            }}
          ></FaRegCircleQuestion>
          <FaChartSimple
            className="app__icon"
            onClick={() => {
              isLoggedIn ? openModal(3) : openModal(4);
            }}
          ></FaChartSimple>
          <FaGear
            className="app__icon"
            onClick={() => {
              openModal(1);
            }}
          ></FaGear>
        </div>
      </header>
      <div className="app__container">
        <div
          className="app__grid-container"
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
            ></Cell>
          ))}
        </div>
        {/* <div className="app__clue-container">
          <FaAngleLeft
            className="app__icon app__clue-icon"
            onClick={() => {
              shiftClueSelection(-1);
            }}
          ></FaAngleLeft>
          <span className="app__clue-text">
            {gameData.selected.cellsIndex
              ? cluesData.clues[
                  gameData.selected.clueNum
                ].clueText
              : ""}
          </span>
          <FaAngleRight
            className="app__icon app__clue-icon"
            onClick={() => {
              shiftClueSelection(1);
            }}
          ></FaAngleRight>
        </div> */}
        {/* <ClueList cluesData={cluesData} getCellsInClue={getCellsInClue}></ClueList> */}
      </div>
      <input
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
    </div>
  );
}

export default App;
