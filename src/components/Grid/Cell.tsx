import { CellData, Coordinates } from "@/types";
import { FaXmark, FaCheck, FaEye } from "react-icons/fa6";
import "./Cell.scss";

type Props = {
  cell: CellData;
  isSelected: boolean;
  isHighlighted: boolean;
  handleClickCell: (coordinates: Coordinates) => void;
};

const Cell = ({ cell, isSelected, isHighlighted, handleClickCell }: Props) => {

  const getMaskClasses = (mask: number, prefix: string): string => {
    if (mask === 0) return "";
    return ["top", "right", "bottom", "left"]
      .filter((_, i) => mask & (1 << i))
      .map((side) => `${prefix}-${side}`)
      .join(" ");
  };

  const stateClass = cell.isBlank
    ? "cell--blank"
    : isSelected
    ? "cell--selected"
    : isHighlighted
    ? "cell--highlighted"
    : "";

  const cellIcon = cell.isRevealed && cell.isLocked
    ? <FaEye className="cell__icon" />
    : cell.isChecked && !cell.isRevealed && cell.isLocked
    ? <FaCheck className="cell__icon" />
    : cell.isIncorrect
    ? <FaXmark className="cell__icon cell__icon--incorrect" />
    : null;

  return (
    <div
      className={`cell ${stateClass} ${getMaskClasses(cell.style.dividerMask, "cell--divider")} ${getMaskClasses(cell.style.borderMask, "cell--border")}`}
      onClick={() => !cell.isBlank && handleClickCell(cell.coordinates)}
    >
      <span className="cell__label">{cell.label}</span>
      <span className={`cell__char ${cell.isIncorrect ? "cell__char--incorrect" : ""}`}>{cell.value}</span>
      {cellIcon}
    </div>
  );
};

export default Cell;
