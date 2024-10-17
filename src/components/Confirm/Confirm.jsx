import "./Confirm.scss";
import { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";
import ReactDom from "react-dom";
import { FaX } from "react-icons/fa6";

function Confirm({ isOpen, onConfirm, message }) {
  const { gameData } = useContext(GameDataContext);

  if (!isOpen) return null;

  const portalContainer = document.getElementById("confirm");

  if (!portalContainer) {
    return null;
  }

  const handleClose = (confirmed) => {
    onConfirm(confirmed);
  };

  return ReactDom.createPortal(
    <>
      <div
        className="confirm__overlay"
        onClick={() => {
          handleClose(false);
        }}
      >
        {" "}
      </div>
      <div className="confirm__wrapper">
        <div
          className={`confirm ${
            gameData.darkThemeEnabled ? "dark-theme" : "default-theme"
          }`}
        >
          <p>{message}</p>
          <div className="confirm__option-wrapper">
            <div
              className="confirm__option-btn button"
              onClick={() => {
                handleClose(true);
              }}
            >
              Yes
            </div>
            <div
              className="confirm__option-btn button"
              onClick={() => {
                handleClose(false);
              }}
            >
              Close
            </div>
          </div>
          <div className="confirm__close-icon-wrapper">
            <FaX
              onClick={() => {
                handleClose(false);
              }}
              className="confirm__close-icon"
            ></FaX>
          </div>
        </div>
      </div>
    </>,
    portalContainer
  );
}

export default Confirm;
