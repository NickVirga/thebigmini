import { useModal } from "../../context/ModalContext";
import InfoModal from "./InfoModal";
import InstructionsModal from "./InstructionsModal";
import StatsModal from "./StatsModal";
import AuthModal from "./AuthModal";
import SettingsModal from "./SettingsModal";
import ConfirmModal from "./ConfirmModal";
import ResultsModal, { ResultsModalProps } from "./ResultsModal";

const MODAL_Z = 100;
const CONFIRM_Z = 150;

const ModalManager = () => {
  const { modal, confirmConfig, closeModal, closeConfirm } = useModal();

  const renderModal = () => {
    if (!modal) return null;
    const props = { ...modal.props, onClose: closeModal, zIndex: MODAL_Z };

    switch (modal.type) {
      case "info":
        return <InfoModal key="info" {...props} />;
      case "instructions":
        return <InstructionsModal key="instructions" {...props} />;
      case "stats":
        return <StatsModal key="stats" {...props} />;
      case "auth":
        return <AuthModal key="auth" {...props} />;
      case "settings":
        return <SettingsModal key="settings" {...props} />;
      case "results":
        return <ResultsModal key="results" {...(props as ResultsModalProps)} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderModal()}
      {confirmConfig && (
        <ConfirmModal
          message={confirmConfig.message}
          description={confirmConfig.description}
          onConfirm={confirmConfig.onConfirm}
          onClose={closeConfirm}
          zIndex={CONFIRM_Z}
        />
      )}
    </>
  );
};

export default ModalManager;
