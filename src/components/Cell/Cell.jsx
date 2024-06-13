import "./Cell.scss";

function Cell({ rowIndex, colIndex, letterGrid, handleClickCell, isSelected,  isHighlighted}) {
  return (
    <div
      className={`cell ${
        isSelected(rowIndex, colIndex)
          ? "cell--selected"
          : isHighlighted(rowIndex, colIndex)
          ? "cell--highlighted" 
          : ""
      } `}
      onClick={() => handleClickCell(rowIndex, colIndex)}
    >
      <p className="cell__text">{letterGrid[rowIndex][colIndex]}</p>
    </div>
  );
}

export default Cell;
