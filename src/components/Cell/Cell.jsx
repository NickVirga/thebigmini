import "./Cell.scss";

function Cell({ cellData, isSelected, isHighlighted, handleClickCell }) {
  return (
    <div
      className={`cell ${
        cellData.blank ? "cell--blank" : isSelected ? "cell--selected" : isHighlighted ? "cell--highlighted" : ""
      } `}
      onClick={() => handleClickCell(cellData.index)}
    >
      <p className="cell__label">{cellData.label}</p>
      <p className="cell__text">{cellData.value}</p>
    </div>
  );
}

// function Cell({ rowIndex, colIndex, letterGrid, handleClickCell, isSelected,  isHighlighted}) {
//   return (
//     <div
//       className={`cell ${
//         isSelected(rowIndex, colIndex)
//           ? "cell--selected"
//           : isHighlighted(rowIndex, colIndex)
//           ? "cell--highlighted"
//           : ""
//       } `}
//       onClick={() => handleClickCell(rowIndex, colIndex)}
//     >
//       <p className="cell__text">{letterGrid[rowIndex][colIndex]}</p>
//     </div>
//   );
// }

export default Cell;
