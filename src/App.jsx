import { useState, useEffect, useContext, useRef } from "react";
import "./App.scss";
import Modal from "./components/Modal/Modal";
import Cell from "./components/Cell/Cell";
import { GameDataContext } from "./context/GameDataContext";
import { ModalContext } from "./context/ModalContext";
import "./styles/partials/_global.scss";

import { FaGear, FaRegCircleQuestion, FaChartSimple } from "react-icons/fa6";

function App() {
  const { gameData, updateGameData } = useContext(GameDataContext);
  const { updateModalMode } = useContext(ModalContext);

  const isLoggedIn = false;

  const numRows = gameData.numRows;
  const numCols = gameData.numCols;

  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [rowColToggle, setRowColToggle] = useState(0);

  const initialLetterGrid = Array.from({ length: numRows }, () =>
    Array(numCols).fill("")
  );
  const [letterGrid, setLetterGrid] = useState(initialLetterGrid);

  

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

  const handleClickCell = (rowIndex, colIndex) => {
    if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
      setRowColToggle(!rowColToggle);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const isHighlighted = (rowIndex, colIndex) => {
    if (
      (!rowColToggle && selectedCell.row === rowIndex) ||
      (rowColToggle && selectedCell.col === colIndex)
    ) {
      return true;
    }
    return false;
  };

  const isSelected = (rowIndex, colIndex) => {
    return selectedCell.row === rowIndex && selectedCell.col === colIndex;
  };

  const changeLetter = (newValue, rowPos, colPos) => {
    setLetterGrid((prevLetterGrid) => {
      const newLetterGrid = prevLetterGrid.map((row) => [...row]);
      newLetterGrid[rowPos][colPos] = newValue;
      return newLetterGrid;
    });
  };

  const handleKeyDown = (event) => {
    let { row, col } = selectedCell;
    const key = event.key;

    if (selectedCell.row !== null && selectedCell.col !== null) {
      switch (key) {
        case "Backspace":
          if (letterGrid[row][col] !== "") {
            changeLetter("", row, col);
          } else {
            if (rowColToggle) {
              if (row > 0) {
                if (letterGrid[row - 1][col] !== "") {
                  changeLetter("", row - 1, col);
                }
                setSelectedCell({ row: row - 1, col });
              }
            } else {
              if (col > 0) {
                if (letterGrid[row][col - 1] !== "") {
                  changeLetter("", row, col - 1);
                }
                setSelectedCell({ row, col: col - 1 });
              }
            }
          }
          break;

        case "Delete":
          changeLetter("", row, col);
          break;
        case " ":
          changeLetter("", row, col);
          if (rowColToggle) {
            if (row < numRows - 1) setSelectedCell({ row: row + 1, col });
          } else {
            if (col < numCols - 1) setSelectedCell({ row, col: col + 1 });
          }
          break;
        case "Home":
          if (rowColToggle) {
            setSelectedCell({ row: 0, col });
          } else {
            setSelectedCell({ row, col: 0 });
          }
          break;
        case "End":
          if (rowColToggle) {
            setSelectedCell({ row: numRows - 1, col });
          } else {
            setSelectedCell({ row, col: numCols - 1 });
          }
          break;
        case "ArrowUp":
          if (row > 0) {
            setSelectedCell({ row: row - 1, col });
          }
          break;
        case "ArrowDown":
          if (row < numRows - 1) {
            setSelectedCell({ row: row + 1, col });
          }
          break;
        case "ArrowLeft":
          if (col > 0) {
            setSelectedCell({ row, col: col - 1 });
          }
          break;
        case "ArrowRight":
          if (col < numCols - 1) {
            setSelectedCell({ row, col: col + 1 });
          }
          break;

        case "Tab":
          event.preventDefault(); // Prevent the default tab behavior
          if (rowColToggle) {
            if (col < numCols - 1) {
              setSelectedCell({ row, col: col + 1 });
            } else {
              setRowColToggle(false);
              setSelectedCell({ row: 0, col: 0 });
            }
          } else {
            if (row < numRows - 1) {
              setSelectedCell({ row: row + 1, col });
            } else {
              setRowColToggle(true);
              setSelectedCell({ row: 0, col: 0 });
            }
          }
          break;
      }

      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        changeLetter(key.toUpperCase(), row, col);
        if (rowColToggle) {
          if (row < numRows - 1) setSelectedCell({ row: row + 1, col });
        } else {
          if (col < numCols - 1) setSelectedCell({ row, col: col + 1 });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, letterGrid, rowColToggle]);

  if (!gameData) {
    return <div>Loading...</div>;
  }

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
        score={gameData.questions.length}
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
      <div className="app__container" onKeyDown={handleKeyDown}>
        {Array.from({ length: numRows }, (_, rowIndex) => (
          <div key={rowIndex} className="app__row">
            {Array.from({ length: numCols }, (_, colIndex) => (
              <Cell
                key={colIndex}
                rowIndex={rowIndex}
                colIndex={colIndex}
                letterGrid={letterGrid}
                handleClickCell={handleClickCell}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
              ></Cell>
            ))}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        inputmode=""
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
