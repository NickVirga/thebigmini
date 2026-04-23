import { CellData, Coordinates } from "@/types";

import "./Cell.scss";

type Props = {
  cell: CellData;
  isSelected: boolean;
  isHighlighted: boolean;
  handleClickCell: (coordinates: Coordinates) => void;
  borderClasses: string;
};

const Cell = ({ cell, isSelected, isHighlighted, handleClickCell, borderClasses }: Props) => {

  const getDividerClasses = () => {
    if (cell.dividerMask === 0) return "";
    const dividers = [
      { flag: 1, className: "cell--divider-top" },
      { flag: 2, className: "cell--divider-right" },
      { flag: 4, className: "cell--divider-bottom" },
      { flag: 8, className: "cell--divider-left" },
    ];

    return dividers
      .filter((divider) => cell.dividerMask & divider.flag)
      .map((divider) => divider.className)
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
      className={`cell ${stateClass} ${modifierClasses} ${getDividerClasses()} ${borderClasses}`}
      onClick={() => handleClickCell(cell.coordinates)}
    >
      <span className="cell__label">{cell.label}</span>
      <span className="cell__char">{cell.value}</span>
    </div>
  );
};

export default Cell;
