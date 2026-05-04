import BaseModal from "./BaseModal";
import "./InfoModal.scss";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context";
import { useGameData } from "@/context/GameDataContext";

type InfoModalProps = {
  onClose: () => void;
  zIndex?: number;
};

const InfoModal = ({ onClose, zIndex }: InfoModalProps) => {
  const { closeModal } = useModal();
  const { authTokens } = useAuth();
  const { gameData } = useGameData();

  const [year, month, day] = gameData.gameDate.split("-").map(Number);
  const gameDate = new Date(year, month - 1, day);
  const dateWeekday = gameDate.toLocaleDateString("en-US", { weekday: "long" });
  const dateMDY = gameDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isAuthenticated = authTokens !== null;

  const handleSignIn = () => closeModal({ type: "auth" });

  const handleClickHowToPlay = () => closeModal({ type: "instructions" });

  return (
    <BaseModal onClose={onClose} zIndex={zIndex}>
      <div className="info">
        <div className="info__intro">
          <div className="info__date">
            <span className="info__date-weekday">{dateWeekday}</span>
            <span className="info__date-mdy">{dateMDY}</span>
          </div>
        </div>

        <div className="info__btn-wrapper">
          <button className="info__btn info__btn--primary" onClick={onClose}>
            Play
          </button>
          <button
            className="info__btn info__btn--secondary"
            onClick={handleClickHowToPlay}
          >
            How to Play
          </button>
        </div>

        {!isAuthenticated && (
          <p className="info__auth-prompt">
            Have an account?{" "}
            <button className="info__auth-link" onClick={handleSignIn}>
              Sign in
            </button>
            {" · "}
            <button className="info__auth-link" onClick={handleSignIn}>
              Create account
            </button>
          </p>
        )}
      </div>
    </BaseModal>
  );
};

export default InfoModal;
