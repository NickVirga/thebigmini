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

export default Cell;
