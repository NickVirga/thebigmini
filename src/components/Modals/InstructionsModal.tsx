import BaseModal from "./BaseModal";
import fill_in_grid from "../../assets/videos/fill_in_grid.mp4";
import "./InstructionsModal.scss";
import { useRef, useState } from "react";
import { useModal } from "@/context/ModalContext";
import { FaXmark, FaCheck, FaEye } from "react-icons/fa6";

type InstructionsModalProps = {
  onClose: () => void;
  zIndex?: number;
};

const SLIDE_COUNT = 3;
const SWIPE_THRESHOLD = 40;

const InstructionsModal = ({ onClose, zIndex }: InstructionsModalProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { closeModal } = useModal();

  const goTo = (i: number) =>
    setSlide(Math.max(0, Math.min(SLIDE_COUNT - 1, i)));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    goTo(slide + (delta > 0 ? 1 : -1));
  };

  const handleClickBack = () => {
    if (slide > 0) {
      goTo(slide - 1);
    } else {
      closeModal({ type: "info" });
    }
  };

  return (
    <BaseModal onClose={onClose} zIndex={zIndex}>
      <div className="instructions">
        <h2 className="instructions__title">How to Play</h2>
        <div className="instructions__intro">
          <div
            className="instructions__slide-area"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slide 0 — Video */}
            <div
              className={`instructions__slide${slide === 0 ? " instructions__slide--active" : ""}`}
            >
              <h3 className="instructions__slide-title">Fill in the Grid</h3>
              <div className="instructions__video-wrapper">
                {!isLoaded && (
                  <div
                    className="instructions__placeholder"
                    aria-label="Video loading"
                  >
                    <span className="instructions__spinner" />
                  </div>
                )}
                <video
                  className={`instructions__video${isLoaded ? " instructions__video--visible" : ""}`}
                  src={fill_in_grid}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onCanPlay={() => setIsLoaded(true)}
                />
              </div>
              <p>Use the clues to fill in the crossword grid.</p>
            </div>

            {/* Slide 1 — Cell symbols */}
            <div
              className={`instructions__slide${slide === 1 ? " instructions__slide--active" : ""}`}
            >
              <h3 className="instructions__slide-title">Reading the Grid</h3>

              {/* Divider demo */}
              <div className="instructions__cell-card">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="270"
                  height="45"
                  viewBox="0 0 270 45"
                >
                  <rect
                    x="0"
                    y="0"
                    width="45"
                    height="45"
                    fill="var(--color-selected-cell)"
                    stroke="var(--color-border-strong)"
                  />
                  <text
                    x="14"
                    y="35"
                    fontSize="25"
                    fill="black"
                    fontWeight="bold"
                  >
                    A
                  </text>
                  <rect
                    x="45"
                    y="0"
                    width="45"
                    height="45"
                    fill="var(--color-highlighted-cell)"
                    stroke="var(--color-border-strong)"
                  />
                  <text
                    x="59"
                    y="35"
                    fontSize="25"
                    fill="black"
                    fontWeight="bold"
                  >
                    R
                  </text>
                  <rect
                    x="90"
                    y="0"
                    width="45"
                    height="45"
                    fill="var(--color-highlighted-cell)"
                    stroke="var(--color-border-strong)"
                  />
                  <text
                    x="104"
                    y="35"
                    fontSize="25"
                    fill="black"
                    fontWeight="bold"
                  >
                    T
                  </text>
                  <rect
                    x="135"
                    y="0"
                    width="45"
                    height="45"
                    fill="var(--color-cell)"
                    stroke="var(--color-border-strong)"
                  />
                  <rect
                    x="133"
                    y="0"
                    width="5"
                    height="45"
                    fill="var(--color-border-strong)"
                  />
                  <rect
                    x="180"
                    y="0"
                    width="45"
                    height="45"
                    fill="var(--color-cell)"
                    stroke="var(--color-border-strong)"
                  />
                  <rect
                    x="225"
                    y="0"
                    width="45"
                    height="45"
                    fill="var(--color-cell)"
                    stroke="var(--color-border-strong)"
                  />
                </svg>
                <p className="instructions__cell-card-desc">
                  Thick dividers between cells separates clues.
                </p>
              </div>

              {/* Cell state legend */}
              <ul className="instructions__legend">
                <li className="instructions__legend-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="52"
                    viewBox="0 0 60 60"
                    className="instructions__legend-svg"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="var(--color-cell)"
                      stroke="var(--color-border-strong)"
                    />
                    <FaEye x="42" y="2" fontSize="14" color="var(--color-primary)"/>
                    <text
                      x="20"
                      y="45"
                      fontSize="30"
                      fill="var(--color-text)"
                      fontWeight="bold"
                    >
                      A
                    </text>
                  </svg>
                  <div className="instructions__legend-text">
                    <span className="instructions__legend-title">Revealed</span>
                    <span className="instructions__legend-sub">
                      The correct character for the cell was revealed and is
                      locked.
                    </span>
                  </div>
                </li>
                <li className="instructions__legend-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="52"
                    viewBox="0 0 60 60"
                    className="instructions__legend-svg"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="var(--color-cell)"
                      stroke="var(--color-border-strong)"
                    />
                    <FaCheck x="42" y="2" fontSize="14q" color="var(--color-primary)"/>
                    <text
                      x="20"
                      y="45"
                      fontSize="30"
                      fill="var(--color-text)"
                      fontWeight="bold"
                    >
                      A
                    </text>
                  </svg>
                  <div className="instructions__legend-text">
                    <span className="instructions__legend-title">Checked</span>
                    <span className="instructions__legend-sub">
                      The cell was checked, the character was found to be
                      correct and is locked.
                    </span>
                  </div>
                </li>
                <li className="instructions__legend-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="52"
                    viewBox="0 0 60 60"
                    className="instructions__legend-svg"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="var(--color-cell)"
                      stroke="var(--color-border-strong)"
                    />
                    <FaXmark x="42" y="2" fontSize="14" color="var(--color-error)"/>
                    <text
                      x="20"
                      y="45"
                      fontSize="30"
                      fill="var(--color-error)"
                      fontWeight="bold"
                    >
                      A
                    </text>
                  </svg>
                  <div className="instructions__legend-text">
                    <span className="instructions__legend-title">
                      Incorrect
                    </span>
                    <span className="instructions__legend-sub">
                      The cell was checked and the character was found to be
                      incorrect.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Slide 2 — Scoring */}
            <div
              className={`instructions__slide${slide === 2 ? " instructions__slide--active" : ""}`}
            >
              <h3 className="instructions__slide-title">Scoring</h3>
              <p className="instructions__slide-desc">
                The highest score possible is <strong>100%</strong>. Using hints
                reduces your score:
              </p>
              <ul className="instructions__scoring">
                <li className="instructions__scoring-item">
                  <span className="instructions__scoring-label">
                    Solved without any hints
                  </span>
                  <span className="instructions__scoring-value instructions__scoring-value--good">
                    100%
                  </span>
                </li>
                <li className="instructions__scoring-item">
                  <span className="instructions__scoring-label">
                    Cell checked
                  </span>
                  <span className="instructions__scoring-value instructions__scoring-value--warn">
                    &minus;½ per cell
                  </span>
                </li>
                <li className="instructions__scoring-item">
                  <span className="instructions__scoring-label">
                    Cell revealed
                  </span>
                  <span className="instructions__scoring-value instructions__scoring-value--bad">
                    &minus;1 per cell
                  </span>
                </li>
              </ul>
              <div className="instructions__formula">
                <span className="instructions__formula-eq-label">
                  Score&nbsp;=
                </span>
                <div className="instructions__formula-fraction">
                  <span className="instructions__formula-numerator">
                    Total Cells &minus;&thinsp;
                    <span className="instructions__formula-token--bad">
                      Revealed
                    </span>
                    &thinsp;&minus;&thinsp;½&thinsp;&times;&thinsp;
                    <span className="instructions__formula-token--warn">
                      Checked
                    </span>
                  </span>
                  <span className="instructions__formula-bar" />
                  <span className="instructions__formula-denominator">
                    Total Cells
                  </span>
                </div>
                <span className="instructions__formula-rhs">
                  &times;&thinsp;100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div
          className="instructions__dots"
          role="tablist"
          aria-label="Slide navigation"
        >
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <button
              key={i}
              className={`instructions__dot${slide === i ? " instructions__dot--active" : ""}`}
              onClick={() => setSlide(i)}
              role="tab"
              aria-selected={slide === i}
              aria-label={
                ["How to fill in the grid", "Cell symbols", "Scoring"][i]
              }
            />
          ))}
        </div>

        <div className="instructions__btn-wrapper">
          <button
            className="instructions__btn instructions__btn--secondary"
            onClick={handleClickBack}
          >
            Back
          </button>
          <button
            className={`instructions__btn ${slide === SLIDE_COUNT - 1 ? "instructions__btn--primary" : "instructions__btn--secondary"}`}
            onClick={() => {
              if (slide < SLIDE_COUNT - 1) goTo(slide + 1);
              else onClose();
            }}
          >
            {slide < SLIDE_COUNT - 1 ? "Next" : "Play"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InstructionsModal;
