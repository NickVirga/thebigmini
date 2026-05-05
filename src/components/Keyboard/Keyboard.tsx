import "./Keyboard.scss";
import { useState, useEffect, useRef } from "react";
import { useGameData } from "@/context/GameDataContext";
import {
  FaDeleteLeft,
  FaMagnifyingGlassPlus,
  FaMagnifyingGlassMinus,
} from "react-icons/fa6";
import { useGridInput } from "@/hooks/useGridInput";
import { useCheckReveal } from "@/hooks/useCheckReveal";

type Layout = 0 | 1 | 2;
type ActionMenu = "Check" | "Reveal" | null;

const CHAR_LAYOUTS: string[][][] = [
  [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
  [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
    [".", ",", "?", "!", "'"],
  ],
  [
    ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="],
    ["_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•"],
    [".", ",", "?", "!", "'"],
  ],
];

const LAYOUT_TOGGLE_LABELS: Record<Layout, string> = {
  0: "123",
  1: "#+=",
  2: "ABC",
};

const Keyboard = () => {
  const { gameData, updateGameData } = useGameData();
  const { cells, selected } = gameData;
  const { coordinates, cluesIndex } = selected ?? {};
  const [layoutNum, setLayoutNum] = useState<Layout>(0);
  const [openMenu, setOpenMenu] = useState<ActionMenu>(null);
  const actionRowRef = useRef<HTMLDivElement>(null);
  const { handleInput } = useGridInput();
  const { checkLetter, checkWord, checkGrid, revealLetter, revealWord, revealGrid } =
    useCheckReveal();

  const cell = cells[coordinates?.row ?? 0][coordinates?.col ?? 0];
  const zoom2Origin = cell?.zoom2Origins[cluesIndex ?? 0];

  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (actionRowRef.current && !actionRowRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openMenu]);

  const toggleMenu = (menu: "Check" | "Reveal") =>
    setOpenMenu((prev) => (prev === menu ? null : menu));

  const cycleLayout = () => {
    setLayoutNum((prev) => ((prev + 1) % 3) as Layout);
  };

  const handleClickZoom = () => {
    const currentLevel = gameData.zoomLevel;
    // If at level 2 but zoom2Origin is absent, snap back to 0 rather than cycling through 2.
    const nextLevel = currentLevel === 2 && !zoom2Origin ? 0 : (currentLevel + 1) % (zoom2Origin ? 3 : 2);
    updateGameData((prev) => ({ ...prev, zoomLevel: nextLevel as 0 | 1 | 2 }));
  };

  const CHECK_OPTIONS = [
    { label: "Letter", action: checkLetter },
    { label: "Word",   action: checkWord },
    { label: "Grid",   action: checkGrid },
  ];

  const REVEAL_OPTIONS = [
    { label: "Letter", action: revealLetter },
    { label: "Word",   action: revealWord },
    { label: "Grid",   action: revealGrid },
  ];

  const renderDropdown = (options: { label: string; action: () => void }[]) => (
    <ul className="keyboard__dropdown" role="menu">
      {options.map(({ label, action }) => (
        <li key={label} role="none">
          <button
            className="keyboard__dropdown-item"
            role="menuitem"
            onClick={() => { action(); setOpenMenu(null); }}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="keyboard">

      {/* Top action row */}
      <div className="keyboard__action-row" ref={actionRowRef}>
        <button
          className="keyboard__action-btn"
          onClick={handleClickZoom}
          aria-label={gameData.zoomLevel >= (zoom2Origin ? 2 : 1) ? "Zoom out" : "Zoom in"}
        >
          {gameData.zoomLevel >= (zoom2Origin ? 2 : 1) ? <FaMagnifyingGlassMinus /> : <FaMagnifyingGlassPlus />}
        </button>
        <div className="keyboard__action-wrapper">
          <button
            className={`keyboard__action-btn${openMenu === "Check" ? " keyboard__action-btn--active" : ""}`}
            onClick={() => toggleMenu("Check")}
            aria-haspopup="menu"
            aria-expanded={openMenu === "Check"}
          >
            Check
          </button>
          {openMenu === "Check" && renderDropdown(CHECK_OPTIONS)}
        </div>
        <div className="keyboard__action-wrapper">
          <button
            className={`keyboard__action-btn${openMenu === "Reveal" ? " keyboard__action-btn--active" : ""}`}
            onClick={() => toggleMenu("Reveal")}
            aria-haspopup="menu"
            aria-expanded={openMenu === "Reveal"}
          >
            Reveal
          </button>
          {openMenu === "Reveal" && renderDropdown(REVEAL_OPTIONS)}
        </div>
      </div>

      {/* Key rows */}
      {CHAR_LAYOUTS[layoutNum].map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard__key-row">
          {rowIndex === 2 && (
            <button
              className="keyboard__special-btn"
              onClick={cycleLayout}
              aria-label="Switch layout"
            >
              {LAYOUT_TOGGLE_LABELS[layoutNum]}
            </button>
          )}
          {row.map((char) => (
            <button
              key={char}
              className="keyboard__key"
              onClick={() => handleInput(char)}
            >
              {char}
            </button>
          ))}
          {rowIndex === 2 && (
            <button
              className="keyboard__special-btn"
              onClick={() => handleInput("Backspace")}
              aria-label="Backspace"
            >
              <FaDeleteLeft />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;