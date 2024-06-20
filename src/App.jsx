import { useState, useEffect, useContext, useRef } from "react";
import "./App.scss";
import Modal from "./components/Modal/Modal";
import Cell from "./components/Cell/Cell";
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
    // console.log("newCellsIndex", newCellsIndex)
    let newCluesIndex = gameData.selected.cluesIndex;
    // console.log("newCluesIndex", newCluesIndex);
    if (newCellsIndex === gameData.selected.cellsIndex) {
      newCluesIndex = newCluesIndex === 0 ? 1 : 0;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!gameData.cells[newCellsIndex].blank) {
      const cellsInClue = getCellsInClueFromIndex(newCellsIndex, newCluesIndex);
      // console.log("cellsInClue", cellsInClue)

      updateGameData({
        ...gameData,
        selected: {
          ...gameData.selected,
          cellsIndex: newCellsIndex,
          cellsInClue: cellsInClue,
          cluesIndex: newCluesIndex,
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

  const getClueNum = (cellsIndex, cluesIndex) => {
    // console.log("gCN, cellsIndex", cellsIndex)
    // console.log("gCN, cluesIndex", cluesIndex)
    let clueNum
    if (cellsIndex === null || cellsIndex === undefined || cluesIndex === null || cluesIndex === undefined) {
      // console.log("gd, cellsIndex", gameData.selected.cellsIndex)
      // console.log("gd, cluesIndex", gameData.selected.cluesIndex)
      clueNum = gameData.cells[gameData.selected.cellsIndex].clues[gameData.selected.cluesIndex];
      // console.log(clueNum)
      if (clueNum === null) return null
    } else {
      clueNum = gameData.cells[cellsIndex].clues[cluesIndex];
    }
    return clueNum
  };

  const getCellsInClueFromIndex = (cellsIndex, cluesIndex) => {
    let cellsList = [];
    // console.log("cellsIndex", cellsIndex)
    // console.log("cluesIndex", cluesIndex)
    const clueIndex = getClueNum(cellsIndex, cluesIndex);
    // console.log("clueIndex", clueIndex)
    for (let i = 0; i < gameData.cells.length; i++) {
      if (gameData.cells[i].clues[cluesIndex] === clueIndex) {
        cellsList.push(i);
      }
    }
    return cellsList.sort((a, b) => a - b);
  };

  const shiftClueSelection = (stepSize) => {
    const currIndexSelect = gameData.selected.cellsIndex;
    const currCluesIndex = gameData.selected.cluesIndex;
    const currClueNum = getClueNum(currIndexSelect, currCluesIndex);
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
    if (pos === clues.length - 1) {
      return index;
    }
    return clues[pos + posShiftAmount];
  };

  const isClueSelected = (clueNum) => {

    const cellsIndex = gameData.selected.cellsIndex
    const cluesIndex = gameData.selected.cluesIndex

    if (cellsIndex === null || cellsIndex === undefined) return false
    if (cluesIndex === null || cluesIndex === undefined) return false

    if (clueNum === gameData.cells[cellsIndex].clues[cluesIndex]) return true

  }

  const handleKeyDown = (event) => {
    let selectedCellsIndex = gameData.selected.cellsIndex;
    const key = event.key;

    if (selectedCellsIndex !== null) {
      switch (key) {
        case "Backspace":
          if (gameData.cells[selectedCellsIndex].value !== "") {
            changeLetter("", selectedCellsIndex);
          } else {
            updateGameData({
              ...gameData,
              selected: {
                ...gameData.selected,
                cellsIndex: clueShift(-1),
              },
            });
            //     if (rowColToggle) {
            //       if (row > 0) {
            //         if (letterGrid[row - 1][col] !== "") {
            //           changeLetter("", row - 1, col);
            //         }
            //         setSelectedCell({ row: row - 1, col });
            //       }
            //     } else {
            //       if (col > 0) {
            //         if (letterGrid[row][col - 1] !== "") {
            //           changeLetter("", row, col - 1);
            //         }
            //         setSelectedCell({ row, col: col - 1 });
            //       }
            //     }
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
        case "ArrowDown":
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
        case "ArrowLeft":
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
        case "ArrowRight":
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

      // updateGameData({
      //   ...gameData,
      //   selected: {
      //     ...gameData.selected,
      //     cellsIndex: gameData.selected.initCellsIndex,
      //   },
      // });
    }
  }, []);

  return (
    <div
      className={`app ${
        gameData.darkThemeEnabled ? "dark-theme" : "default-theme"
      }`}
    >
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        // modalMode={modalMode}
        winState={gameData.winState}
        gameId={gameData.gameId}
        score={2}
      ></Modal>
      <header className="app__header">
        <h1 className="app__title">TheBigMini</h1>
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
        <div className="app__clue-container">
          <FaAngleLeft
            className="app__icon"
            onClick={() => {
              shiftClueSelection(-1);
            }}
          ></FaAngleLeft>
          <span className="app__clue-text">
            {gameData.selected.cellsIndex
              ? cluesData.clues[
                  getClueNum()
                ].clueText
              : ""}
          </span>
          <FaAngleRight
            className="app__icon"
            onClick={() => {
              shiftClueSelection(1);
            }}
          ></FaAngleRight>
        </div>
        <div className="app__clue-list">
          <div className="app__clues-across">
            <h3>Across</h3>
            <ul>
              {cluesData.clues
                .filter((clue) => clue.cluesIndex === 0)
                .map((clue) => {
                  return (
                    <li
                      className={`app__clue-item ${
                        isClueSelected(clue.index) ? "app__clue-item--highlighted" : ""
                      }`} 
                      key={clue.index}
                    >{`${clue.label}. ${clue.clueText}`}</li>
                  );
                })}
            </ul>
          </div>
          <div className="app__clues-down">
            <h3>Down</h3>
            <ul>
              {cluesData.clues
                .filter((clue) => clue.cluesIndex === 1)
                .map((clue) => {
                  return (
                    <li
                      key={clue.index}
                      className={`app__clue-item ${
                        isClueSelected(clue.index) ? "app__clue-item--highlighted" : ""
                      }`} 
                    >{`${clue.label}. ${clue.clueText}`}</li>
                  );
                })}
            </ul>
          </div>
        </div>
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
