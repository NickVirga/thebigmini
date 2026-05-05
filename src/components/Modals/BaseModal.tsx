import { useEffect, ReactNode } from "react";
import "./BaseModal.scss";

type BaseModalProps = {
  onClose: () => void;
  children: ReactNode;
  zIndex?: number;
  closeOnBackdrop?: boolean;
};

const BaseModal = ({
  onClose,
  children,
  zIndex = 100,
  closeOnBackdrop = true,
}: BaseModalProps) => {

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex }}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;