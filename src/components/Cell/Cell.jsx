import "./Cell.scss";

function Cell({ cellData, isSelected, isHighlighted, handleClickCell }) {
  const getBorderClasses = () => {
    if (!cellData.hasDivider) return "";
    const borders = [
      { flag: 1, className: "cell--border-top" },
      { flag: 2, className: "cell--border-right" },
      { flag: 4, className: "cell--border-bottom" },
      { flag: 8, className: "cell--border-left" },
    ];

    return borders
      .filter((border) => cellData.dividers & border.flag)
      .map((border) => border.className)
      .join(" ");
  };

  return (
    <div
      className={`cell ${
        cellData.blank
          ? "cell--blank"
          : isSelected
          ? "cell--selected"
          : isHighlighted
          ? "cell--highlighted"
          : ""
      } ${getBorderClasses(cellData)} ${cellData.locked ? "cell--locked" : ""}
   `}
      onClick={() => handleClickCell(cellData.index)}
    >
      <p className="cell__label">{cellData.label}</p>
      <p className="cell__text">{cellData.value}</p>
    </div>
  );
}

export default Cell;
