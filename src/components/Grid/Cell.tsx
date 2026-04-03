import { CellData, Coordinates } from "@/types";

import "./Cell.scss";

type Props = {
  cell: CellData;
  isSelected: boolean;
  isHighlighted: boolean;
  handleClickCell: (coordinates: Coordinates) => void;
};

const Cell = ({ cell, isSelected, isHighlighted, handleClickCell}: Props) => {

  const getBorderClasses = () => {
    if (cell.dividerMask === 0) return "";
    const borders = [
      { flag: 1, className: "cell--border-top" },
      { flag: 2, className: "cell--border-right" },
      { flag: 4, className: "cell--border-bottom" },
      { flag: 8, className: "cell--border-left" },
    ];

    return borders
      .filter((border) => cell.dividerMask & border.flag)
      .map((border) => border.className)
      .join(" ");
  };


  return (
    <div className={`cell ${cell.isBlank
          ? "cell--blank"
          : isSelected
          ? "cell--selected"
          : isHighlighted
          ? "cell--highlighted"
          : ""} ${getBorderClasses()}`} onClick={() => handleClickCell(cell.coordinates)}>
      <span className="cell__label">{cell.label}</span>
      <span className="cell__char">{cell.value}</span>
    </div>
  );
};

export default Cell;
