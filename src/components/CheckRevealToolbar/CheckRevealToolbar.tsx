import { useRef, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useCheckReveal } from "@/hooks/useCheckReveal";
import "./CheckRevealToolbar.scss";

type DropdownState = "check" | "reveal" | null;

const CheckRevealToolbar = () => {
  const { checkLetter, checkWord, checkGrid, revealLetter, revealWord, revealGrid } =
    useCheckReveal();
  const [open, setOpen] = useState<DropdownState>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (menu: DropdownState) =>
    setOpen((prev) => (prev === menu ? null : menu));

  const run = (fn: () => void) => {
    fn();
    setOpen(null);
  };

  return (
    <div className="cr-toolbar" ref={toolbarRef}>
      {/* Check */}
      <div className="cr-toolbar__group">
        <button
          className={`cr-toolbar__btn${open === "check" ? " cr-toolbar__btn--open" : ""}`}
          onClick={() => toggle("check")}
          aria-haspopup="true"
          aria-expanded={open === "check"}
        >
          Check
          <FaChevronDown className="cr-toolbar__icon" />
        </button>
        {open === "check" && (
          <ul className="cr-toolbar__dropdown" role="menu">
            <li role="menuitem">
              <button onClick={() => run(checkLetter)}>Check Letter</button>
            </li>
            <li role="menuitem">
              <button onClick={() => run(checkWord)}>Check Word</button>
            </li>
            <li role="menuitem">
              <button onClick={() => run(checkGrid)}>Check Grid</button>
            </li>
          </ul>
        )}
      </div>

      {/* Reveal */}
      <div className="cr-toolbar__group">
        <button
          className={`cr-toolbar__btn${open === "reveal" ? " cr-toolbar__btn--open" : ""}`}
          onClick={() => toggle("reveal")}
          aria-haspopup="true"
          aria-expanded={open === "reveal"}
        >
          Reveal
          <FaChevronDown className="cr-toolbar__icon" />
        </button>
        {open === "reveal" && (
          <ul className="cr-toolbar__dropdown" role="menu">
            <li role="menuitem">
              <button onClick={() => run(revealLetter)}>Reveal Letter</button>
            </li>
            <li role="menuitem">
              <button onClick={() => run(revealWord)}>Reveal Word</button>
            </li>
            <li role="menuitem">
              <button onClick={() => run(revealGrid)}>Reveal Grid</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CheckRevealToolbar;
