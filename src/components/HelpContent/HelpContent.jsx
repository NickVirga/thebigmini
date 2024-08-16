import "./HelpContent.scss";
import { useState, useContext } from "react";
import grid from "../../assets/images/grid.png";
import boundaryGap from "../../assets/images/boundary-gap.png";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

function HelpContent() {
  const { accessToken } = useContext(AuthContext);
  const { updateModalMode } = useContext(ModalContext);

  const [showGridImg, setShowGridImg] = useState(false);
  const [showBoundaryImg, setShowBoundaryImg] = useState(false);

  return (
    <>
      <h2 className="help__title">About The BigMini Crossword</h2>
      <p>The BIGmini Crossword is a new spin on the traditional crossword:</p>
      <ul className="help__list">
        <li className="help__item">No puzzle symmetry</li>
        <li className="help__item">
          Mini sections are separated by thick boundaries
          {!showGridImg && (
            <div
              className="help__tooltip"
              onClick={() => {
                setShowGridImg(true);
              }}
            >
              <span className="help__tooltip-text">Show Example</span>
              <FaChevronDown className="help__tooltip-icon" />
            </div>
          )}
          {showGridImg && <img src={grid} className="help__grid" alt="grid" />}
          {showGridImg && (
            <div
              className="help__tooltip"
              onClick={() => {
                setShowGridImg(false);
              }}
            >
              <span className="help__tooltip-text">Hide Example</span>
              <FaChevronUp className="help__tooltip-icon" />
            </div>
          )}
        </li>

        <li className="help__item">
          Long words can span multiple mini sections through gaps in boundaries
          {!showBoundaryImg && (
            <div
              className="help__tooltip"
              onClick={() => {
                setShowBoundaryImg(true);
              }}
            >
              <span className="help__tooltip-text">Show Example</span>
              <FaChevronDown className="help__tooltip-icon" />
            </div>
          )}
          {showBoundaryImg && (
            <img
              src={boundaryGap}
              className="help__boundary-gap"
              alt="boundary gap example"
            />
          )}
          {showBoundaryImg && (
            <div
              className="help__tooltip"
              onClick={() => {
                setShowBoundaryImg(false);
              }}
            >
              <span className="help__tooltip-text">Hide Example</span>
              <FaChevronUp className="help__tooltip-icon" />
            </div>
          )}
        </li>
        <li className="help__item">Game stats can be saved by creating an account
        {!accessToken && <p className="help__login" onClick={()=>{updateModalMode(4)}}>Click to create an account</p>}
        </li>
      </ul>
    </>
  );
}

export default HelpContent;
