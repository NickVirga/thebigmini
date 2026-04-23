import BaseModal from "./BaseModal";
import game_intro from "../../assets/videos/game_intro.mp4";
import "./InfoModal.scss";
import { useState } from "react";
import { useModal } from "@/context/ModalContext";

type InfoModalProps = {
  onClose: () => void;
  zIndex?: number;
};

const InfoModal = ({ onClose, zIndex }: InfoModalProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { openModal } = useModal();

  const handleSignUpClick = () => {
    openModal({ type: "auth" });
  };

  return (
    <BaseModal onClose={onClose} zIndex={zIndex}>
      <div className="info">
        <div className="info__header">
          <h2 className="info__title">How To Play</h2>
        </div>
        <div className="info__video-wrapper">
          {!isLoaded && (
            <div className="info__placeholder" aria-label="Video loading">
              <span className="info__spinner" />
            </div>
          )}
          <video
            className={`info__video ${isLoaded ? "info__video--visible" : ""}`}
            src={game_intro}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={() => setIsLoaded(true)}
          />
        </div>
        <div className="info__actions">
          <button className="info__btn info__btn--secondary" onClick={onClose}>
            Play
          </button>
          <button
            className="info__btn info__btn--primary"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InfoModal;
