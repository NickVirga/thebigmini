import BaseModal from "./BaseModal";
import "./ConfirmModal.scss";

type ConfirmModalProps = {
  onClose: () => void;
  zIndex?: number;
  message?: string;
  description?: string;
  onConfirm?: () => void;
};

const ConfirmModal = ({
  onClose,
  zIndex,
  message = "Are you sure?",
  description,
  onConfirm,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onClose();
    onConfirm?.();
  };

  return (
    <BaseModal onClose={onClose} zIndex={zIndex} closeOnBackdrop={false}>
      <div className="confirm">
        <div className="confirm__text">
          <p className="confirm__message">{message}</p>
          {description && <p className="confirm__description">{description}</p>}
        </div>
        <div className="confirm__actions">
          <button className="confirm__btn confirm__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm__btn confirm__btn--confirm" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;