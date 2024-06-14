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

  const gridContainerStyle = {
    gridTemplateColumns: `repeat(${numCols}, 1fr)`,
    // gridTemplateRows: `repeat(${numRows})`,
  };

  // const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [rowColToggle, setRowColToggle] = useState(0);

  // const initialLetterGrid = Array.from({ length: numRows }, () =>
  //   Array(numCols).fill("")
  // );
  // const [letterGrid, setLetterGrid] = useState(initialLetterGrid);

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

  const handleClickCell = (index) => {
    if (index === gameData.selectedCellIndex) {
      setRowColToggle(!rowColToggle);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!gameData.cells[index].blank) updateGameData({ ...gameData, selectedCellIndex: index });  
  };

  const isSelected = (index) => {
    return index === gameData.selectedCellIndex;
  };

  const isHighlighted = (index) => {
    if (!gameData.selectedCellIndex) return false
    const clueNum = gameData.cells[index].clues[rowColToggle ? 0 : 1]
    const selectedClue = gameData.cells[gameData.selectedCellIndex].clues[rowColToggle ? 0 : 1]
    return selectedClue === clueNum
  };

  const changeLetter = (newValue, index) => {
    updateGameData({ ...gameData, cells: gameData.cells.map((cell, i) =>
      i === index ? { ...cell, value: newValue } : cell
    ) });
  };

  const handleKeyDown = (event) => {
    let selectedCellIndex = gameData.selectedCellIndex;
    const key = event.key;

    if (selectedCellIndex !== null) {
      switch (key) {
        // case "Backspace":
        //   if (letterGrid[row][col] !== "") {
        //     changeLetter("", row, col);
        //   } else {
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
        //   }
        //   break;

        case "Delete":
          changeLetter("", selectedCellIndex);
          break;
        // case " ":
        //   changeLetter("", row, col);
        //   if (rowColToggle) {
        //     if (row < numRows - 1) setSelectedCell({ row: row + 1, col });
        //   } else {
        //     if (col < numCols - 1) setSelectedCell({ row, col: col + 1 });
        //   }
        //   break;
        // case "Home":
        //   if (rowColToggle) {
        //     setSelectedCell({ row: 0, col });
        //   } else {
        //     setSelectedCell({ row, col: 0 });
        //   }
        //   break;
        // case "End":
        //   if (rowColToggle) {
        //     setSelectedCell({ row: numRows - 1, col });
        //   } else {
        //     setSelectedCell({ row, col: numCols - 1 });
        //   }
        //   break;
        // case "ArrowUp":
        //   if (row > 0) {
        //     setSelectedCell({ row: row - 1, col });
        //   }
        //   break;
        // case "ArrowDown":
        //   if (row < numRows - 1) {
        //     setSelectedCell({ row: row + 1, col });
        //   }
        //   break;
        // case "ArrowLeft":
        //   if (col > 0) {
        //     setSelectedCell({ row, col: col - 1 });
        //   }
        //   break;
        // case "ArrowRight":
        //   if (col < numCols - 1) {
        //     setSelectedCell({ row, col: col + 1 });
        //   }
        //   break;

        // case "Tab":
        //   event.preventDefault(); // Prevent the default tab behavior
        //   if (rowColToggle) {
        //     if (col < numCols - 1) {
        //       setSelectedCell({ row, col: col + 1 });
        //     } else {
        //       setRowColToggle(false);
        //       setSelectedCell({ row: 0, col: 0 });
        //     }
        //   } else {
        //     if (row < numRows - 1) {
        //       setSelectedCell({ row: row + 1, col });
        //     } else {
        //       setRowColToggle(true);
        //       setSelectedCell({ row: 0, col: 0 });
        //     }
        //   }
        //   break;
      }

      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        changeLetter(key.toUpperCase(), selectedCellIndex);
        // if (rowColToggle) {
        //   if (row < numRows - 1) setSelectedCell({ row: row + 1, col });
        // } else {
        //   if (col < numCols - 1) setSelectedCell({ row, col: col + 1 });
        // }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameData, rowColToggle]);

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
      <div
        className="app__container"
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
