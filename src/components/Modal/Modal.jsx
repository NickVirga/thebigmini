import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { GameDataContext } from "../../context/GameDataContext";
import "./Modal.scss";
import ReactDom from "react-dom";
import HelpContent from "../HelpContent/HelpContent";
import SettingsContent from "../SettingsContent/SettingsContent";
import ResultsContent from "../ResultsContent/ResultsContent";
import StatsContent from "../StatsContent/StatsContent";
import LoginContent from "../LoginContent/LoginContent";
import SignupContent from "../SignupContent/SignupContent";

import { FaX } from "react-icons/fa6";

function Modal({ open, onClose }) {
  if (!open) return null;

  const portalContainer = document.getElementById("portal");

  if (!portalContainer) {
    return null;
  }

  const { gameData } = useContext(GameDataContext);

  const { modalMode } = useContext(ModalContext);

  return ReactDom.createPortal(
    <>
      <div className="modal__overlay" onClick={onClose}>
        {" "}
      </div>
      <div
        className={`modal ${
          gameData.darkThemeEnabled ? "dark-theme" : "default-theme"
        }`}
      >
        {modalMode === 0 && <HelpContent></HelpContent>}
        {modalMode === 1 && <SettingsContent></SettingsContent>}
        {modalMode === 2 && <ResultsContent></ResultsContent>}
        {modalMode === 3 && <StatsContent></StatsContent>}
        {modalMode === 4 && <LoginContent></LoginContent>}
        {modalMode === 5 && <SignupContent></SignupContent>}
        <div className="modal__close-icon-wrapper">
          <FaX onClick={onClose} className="modal__close-icon"></FaX>
        </div>
      </div>
    </>,
    portalContainer
  );
}

export default Modal;
