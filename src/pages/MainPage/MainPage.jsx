import { useState, useEffect, useContext, useRef } from "react";
import "./MainPage.scss";
import Cell from "../../components/Cell/Cell";
import ClueList from "../../components/ClueList/ClueList";
import Keyboard from "../../components/Keyboard/Keyboard";
import Confirm from "../../components/Confirm/Confirm";
import { GameDataContext } from "../../context/GameDataContext";
import { ModalContext } from "../../context/ModalContext";
import { AuthContext } from "../../context/AuthContext";
import cluesData from "../../assets/data/clue-data.json";
import axios from "axios";
import { usePendingScore } from "../../hooks/usePendingScore";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function MainPage() {
  const { gameData, updateGameData } = useContext(GameDataContext);
  const { updateModalOpen, updateModalMode } = useContext(ModalContext);
  const { accessToken } = useContext(AuthContext);

  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
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

  const inputRef = useRef(null);

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
    if (gameData.selected.cellsIndex === null) return false;
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

  const clueShift = (direction = 1) => {
    const currClueNum = gameData.selected.clueNum;
    const cluesList = cluesData;
    let newClueNum =
      (currClueNum + direction + cluesList.length) % cluesList.length;

    if (!gameData.options.skipFilled) {
      // jump to next clue, position on first cell
      const newCells = cluesList[newClueNum].cellsInClue;
      return {
        ...gameData.selected,
        cellsIndex: newCells[0],
        cellsInClue: newCells,
        cluesIndex: cluesList[newClueNum].cluesIndex,
        clueNum: newClueNum,
      };
    }

    // skipFilled: find next clue with an empty cell
    let attempts = 0;
    while (attempts < cluesList.length) {
      const newCells = cluesList[newClueNum].cellsInClue;
      const firstEmpty = newCells.find(
        (cellsIndex) => gameData.cells[cellsIndex].value === "",
      );
      if (firstEmpty !== undefined) {
        return {
          ...gameData.selected,
          cellsIndex: firstEmpty,
          cellsInClue: newCells,
          cluesIndex: cluesList[newClueNum].cluesIndex,
          clueNum: newClueNum,
        };
      }
      newClueNum =
        (newClueNum + direction + cluesList.length) % cluesList.length;
      attempts++;
    }

    return gameData.selected; // all cells filled, stay put
  };

  const changeLetter = (newValue, index) => {
    if (gameData.cells[index].locked) return;
    updateGameData({
      ...gameData,
      cells: gameData.cells.map((cell, i) =>
        i === index ? { ...cell, value: newValue, incorrectFlag: false } : cell,
      ),
    });
  };

  const cellShift = (posShiftAmount, skipFilled) => {
    const clues = gameData.selected.cellsInClue;
    const currIndex = gameData.selected.cellsIndex;

    const currPos = clues.indexOf(currIndex);

    let newPos = currPos;

    while (
      newPos + posShiftAmount >= 0 &&
      newPos + posShiftAmount < clues.length
    ) {
      newPos += posShiftAmount;

      const newIndex = clues[newPos];

      if (!skipFilled) return newIndex;

      const newCell = gameData.cells[newIndex];

      if (newCell.value === "") return newIndex;
    }

    return currIndex;
  };

  const cellAutoShift = (updatedCells) => {
    const currCells = gameData.selected.cellsInClue;
    const currSelectedIndex = gameData.selected.cellsIndex;
    const currVal = gameData.cells[currSelectedIndex].value;
    const currClueNum = gameData.selected.clueNum;
    const cluesList = cluesData;
    let newCells = currCells;
    let newPos = currCells.indexOf(currSelectedIndex);
    let newClueNum = currClueNum;
    const isLastCellInClue = newPos === newCells.length - 1;

    const findNextCell = (pos, cells) => {
      let i = pos + 1;
      while (i < cells.length) {
        const cellsIndex = cells[i];

        if (
          !gameData.options.skipFilled ||
          updatedCells[cellsIndex].value === ""
        ) {
          return { cellsIndex, pos: i };
        }
        i++;
      }
      return null;
    };

    // if prefilled and not last cell, shift by exactly 1
    if (currVal !== "" && !isLastCellInClue) {
      const cellsIndex = newCells[newPos + 1];
      return {
        ...gameData.selected,
        cellsIndex,
      };
    }

    // all other cases: find next empty cell, wrapping through clue first
    let result = findNextCell(newPos, newCells);

    // wrap to beginning of same clue before jumping to next
    if (!result && !isLastCellInClue) {
      result = findNextCell(-1, newCells);
    }

    // no empty cells in clue, jump to next clue
    if (!result && gameData.options.moveToNextClue) {
      let attempts = 0;
      while (!result && attempts < cluesList.length) {
        newClueNum = (newClueNum + 1) % cluesList.length;
        newCells = cluesList[newClueNum].cellsInClue;
        result = findNextCell(-1, newCells);
        attempts++;
      }
    }

    if (!result) return gameData.selected;

    return {
      ...gameData.selected,
      cellsIndex: result.cellsIndex,
      cellsInClue: newCells,
      cluesIndex: cluesList[newClueNum].cluesIndex,
      clueNum: newClueNum,
    };
  };

  const handleKeyDown = (key, e) => {
    let selectedCellsIndex = gameData.selected.cellsIndex;

    if (selectedCellsIndex !== null && !gameData.gameComplete) {
      switch (key) {
        case "Backspace":
          if (
            gameData.cells[selectedCellsIndex].value !== "" &&
            !gameData.cells[selectedCellsIndex].revealed
          ) {
            changeLetter("", selectedCellsIndex);
          } else {
            const newCellsIndex = cellShift(-1, false);
            let updatedCells = gameData.cells;
            if (!gameData.cells[newCellsIndex].revealed) {
              updatedCells = gameData.cells.map((cell, i) =>
                i === newCellsIndex
                  ? { ...cell, value: "", incorrectFlag: false }
                  : cell,
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
        case "Delete": //clear cell
          changeLetter("", selectedCellsIndex);
          break;
        case " ": //space bar: clear cell, move to next cell
          e?.preventDefault(); // stops page scroll
          let updatedCells = gameData.cells;
          if (!gameData.cells[selectedCellsIndex].revealed) {
            updatedCells = gameData.cells.map((cell, i) =>
              i === selectedCellsIndex
                ? { ...cell, value: "", incorrectFlag: false }
                : cell,
            );
          }
          updateGameData({
            ...gameData,
            cells: updatedCells,
            selected: {
              ...gameData.selected,
              cellsIndex: cellShift(1, false),
            },
          });
          break;
        case "Home": // nav to first cell in clue
          e?.preventDefault();
          updateGameData({
            ...gameData,
            selected: {
              ...gameData.selected,
              cellsIndex: gameData.selected.cellsInClue[0],
            },
          });
          break;
        case "End": // nav to last cell in clue
          e?.preventDefault();
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
        case "ArrowUp": // move up in grid
          e?.preventDefault();
          if (gameData.selected.cluesIndex === 1) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex,
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
        case "ArrowDown": // move down in grid
          e?.preventDefault();
          if (gameData.selected.cluesIndex === 1) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex,
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
        case "ArrowLeft": // move left in grid
          e?.preventDefault();
          if (gameData.selected.cluesIndex === 0) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex,
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
        case "ArrowRight": // move right in grid
          e?.preventDefault();
          if (gameData.selected.cluesIndex === 0) {
            const selectionIndexInClueList =
              gameData.selected.cellsInClue.indexOf(
                gameData.selected.cellsIndex,
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
        case "Tab": // jump to next clue
          e?.preventDefault(); // prevent the default tab behavior
          updateGameData({
            ...gameData,
            selected: clueShift(e?.shiftKey ? -1 : 1),
          });
          break;
      }

      // input char in cell
      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        const updatedCells = gameData.cells.map((cell, i) =>
          i === selectedCellsIndex
            ? { ...cell, value: key.toUpperCase(), incorrectFlag: false }
            : cell,
        );

        const newSelected = cellAutoShift(updatedCells);

        updateGameData({
          ...gameData,
          cells: updatedCells,
          selected: newSelected,
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
      const gameResults = calculateScore();

      // Set gameComplete and open modal immediately with local score
      updateGameData({
        ...gameData,
        gameComplete: true,
        stats: {
          ...gameData.stats,
          score: gameResults.score,
          checkedCnt: gameResults.checkedCnt,
          revealedCnt: gameResults.revealedCnt,
        },
      });
      updateModalMode(2);
      updateModalOpen(true);

      // Fire and forget — update stats in background if needed
      if (accessToken && !gameData.stats.dailySaved) {
        sendGameScore(gameResults);
      }
    } else {
      updateModalMode(2);
      updateModalOpen(true);
    }
  }
};

  const checkRevealIndices = (cellsIndicesArray, revealWord) => {
    let updatedCells = [...gameData.cells];

    cellsIndicesArray.forEach((index) => {
      const cell = { ...updatedCells[index] };

      if (cell.blank || cell.revealed) return; //skip blank or revealed cells

      if (revealWord) {
        //reveal word
        cell.value = cell.answer;
        cell.revealed = true;
        cell.locked = true;
        cell.incorrectFlag = false;
      } else {
        //check word
        if (cell.value === "") {
          //skip
        } else if (cell.value === cell.answer) {
          cell.checked = true;
          cell.locked = true;
        } else {
          //mismatch
          cell.checked = true;
          cell.incorrectFlag = true;
        }
      }

      updatedCells[index] = cell;
    });

    updateGameData({
      ...gameData,
      cells: updatedCells,
    });
  };

  const handleConfirmResponse = (confirmed) => {
    if (confirmed) {
      checkRevealIndices(
        Array.from({ length: gameData.cells.length }, (_, index) => index),
        true,
      );
    }

    setConfirmIsOpen(false);
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
    const totalCells = gameData.cells.filter((cell) => !cell.blank).length;
    let scoreNumerator = totalCells;
    let checkedCnt = 0;
    let revealedCnt = 0;

    console.log(
      "checked",
      gameData.cells.filter((cell) => cell.checked).map((cell) => cell.index),
    );
    console.log(
      "revealed",
      gameData.cells.filter((cell) => cell.revealed).map((cell) => cell.index),
    );

    gameData.cells.forEach((cell) => {
      if (cell.revealed) {
        revealedCnt++;
        scoreNumerator -= 1;

        if (cell.checked) {
          checkedCnt++;
        }
      } else {
        if (cell.checked) {
          checkedCnt++;
          scoreNumerator -= 0.5;
        }
      }
    });

    const score = (scoreNumerator / totalCells) * 100;

    return { score: score, checkedCnt: checkedCnt, revealedCnt: revealedCnt };
  };

  const sendGameScore = async (gameResults) => {
    const { score } = gameResults;
    const reqBody = { gameId: gameData.gameId, gameScore: score };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/games`,
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const { wins, scoreAccum } = response.data;

      updateGameData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        dailySaved: true,
        wins: wins,
        avgScore: wins > 0 ? scoreAccum / wins : 0,
      },
    }));
    } catch (err) {
      console.error(err);
      const dailySaved = err.response?.status === 409;
      updateGameData((prev) => ({
        ...prev,
        stats: { ...prev.stats, dailySaved: dailySaved },
      }));
    }
  };

  usePendingScore(accessToken, gameData, updateGameData);

  useEffect(() => {
    checkIfGameComplete();
  }, [gameData.cells]);

  useEffect(() => {
    if (gameData.gameComplete) {
      updateModalMode(2);
      updateModalOpen(true);
    }
  }, [gameData.gameComplete]);

  useEffect(() => {
    const handleKeyDownWrapper = (event) => handleKeyDown(event.key, event);

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
    <>
      <Confirm
        isOpen={confirmIsOpen}
        onConfirm={handleConfirmResponse}
        message={"Are you sure you want to reveal the entire puzzle?"}
      />
      <div className="main__container">
        <ul className="main__control-bar">
          <li className="main__control-item" ref={checkMenuRef}>
            <div
              className={`main__control-btn ${
                checkMenuIsVisible ? "main__control-btn--active" : ""
              }`}
              onClick={() => {
                setCheckMenuIsVisible(!checkMenuIsVisible);
              }}
            >
              Check
            </div>
            {checkMenuIsVisible && (
              <ul className="main__dropdown">
                <li
                  className="main__dropdown-item"
                  onClick={() => {
                    checkRevealIndices([gameData.selected.cellsIndex], false);
                    setCheckMenuIsVisible(false);
                  }}
                >
                  Letter
                </li>
                <li
                  className="main__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(gameData.selected.cellsInClue, false);
                    setCheckMenuIsVisible(false);
                  }}
                >
                  Word
                </li>
                <li
                  className="main__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(
                      Array.from(
                        { length: gameData.cells.length },
                        (_, index) => index,
                      ),
                      false,
                    );
                    setCheckMenuIsVisible(false);
                  }}
                >
                  Grid
                </li>
              </ul>
            )}
          </li>
          <li className="main__control-item" ref={revealMenuRef}>
            <div
              className={`main__control-btn ${
                revealMenuIsVisible ? "main__control-btn--active" : ""
              }`}
              onClick={() => {
                setRevealMenuIsVisible(!revealMenuIsVisible);
              }}
            >
              Reveal
            </div>
            {revealMenuIsVisible && (
              <ul className="main__dropdown">
                <li
                  className="main__dropdown-item"
                  onClick={() => {
                    checkRevealIndices([gameData.selected.cellsIndex], true);
                    setRevealMenuIsVisible(false);
                  }}
                >
                  Letter
                </li>
                <li
                  className="main__dropdown-item"
                  onClick={() => {
                    checkRevealIndices(gameData.selected.cellsInClue, true);
                    setRevealMenuIsVisible(false);
                  }}
                >
                  Word
                </li>
                <li
                  className="main__dropdown-item"
                  onClick={() => {
                    setConfirmIsOpen(true);
                    setRevealMenuIsVisible(false);
                  }}
                >
                  Grid
                </li>
              </ul>
            )}
          </li>
        </ul>
        <div className="main__cluelist-container">
          <div className="main__zoom-wrapper">
            <div
              className={`main__grid-container${
                gameData.magnified ? "--zoom" : ""
              }`}
              style={gridContainerStyle}
              onKeyDown={(e) => handleKeyDown(e.key, e)}
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
          </div>
          <ClueList cluesData={cluesData} getCellsInClue={getCellsInClue} />
        </div>
        <div className="main__clue-container">
          <FaAngleLeft
            className="main__icon main__clue-icon"
            onClick={() => {
              updateGameData({
                ...gameData,
                selected: clueShift(-1),
              });
            }}
          />
          <span
            className="main__clue-text"
            onClick={() => {
              handleClickCell(gameData.selected.cellsIndex);
            }}
          >
            {gameData.selected.clueNum !== null
              ? cluesData[gameData.selected.clueNum].clueText
              : ""}
          </span>
          <FaAngleRight
            className="main__icon main__clue-icon"
            onClick={() => {
              updateGameData({
                ...gameData,
                selected: clueShift(1),
              });
            }}
          />
        </div>
        <Keyboard
          handleKeyClick={(key) => handleKeyDown(key, null)}
          handleCheckReveal={checkRevealIndices}
        />
      </div>
      <input
        className="main__input-overlay"
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
    </>
  );
}

export default MainPage;
