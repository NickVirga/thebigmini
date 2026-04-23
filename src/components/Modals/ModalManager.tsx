import { useModal } from "../../context/ModalContext";
import InfoModal from "./InfoModal";
import StatsModal from "./StatsModal";
import AuthModal from "./AuthModal";
import SettingsModal from "./SettingsModal";
import ConfirmModal from "./ConfirmModal";
import ResultsModal, { ResultsModalProps } from "./ResultsModal";

const BASE_Z = 100;
const Z_STEP = 50;

const ModalManager = () => {
  const { stack, closeModal } = useModal();

  return (
    <>
      {stack.map((modal, index) => {
        const zIndex = BASE_Z + index * Z_STEP;
        const props = { ...modal.props, onClose: closeModal, zIndex };

        switch (modal.type) {
          case "info":
            return <InfoModal key={index} {...props} />;
          case "stats":
            return <StatsModal key={index} {...props} />;
          case "auth":
            return <AuthModal key={index} {...props} />;
          case "settings":
            return <SettingsModal key={index} {...props} />;
          case "confirm":
            return <ConfirmModal key={index} {...props} />;
          case "results":
            return <ResultsModal key={index} {...(props as ResultsModalProps)} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default ModalManager;
