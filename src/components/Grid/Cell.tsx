import { CellData, Coordinates } from "@/types";

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

  const modifierClasses = [
    cell.isIncorrect && "cell--incorrect",
    cell.isLocked    && "cell--locked",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`cell ${stateClass} ${modifierClasses} ${getMaskClasses(cell.style.dividerMask, "cell--divider")} ${getMaskClasses(cell.style.borderMask, "cell--border")}`}
      onClick={() => !cell.isBlank && handleClickCell(cell.coordinates)}
    >
      <span className="cell__label">{cell.label}</span>
      <span className="cell__char">{cell.value}</span>
    </div>
  );
};

export default Cell;
