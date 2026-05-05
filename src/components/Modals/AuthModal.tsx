import BaseModal from "./BaseModal";
import "./AuthModal.scss";
import { useAuth } from "@/context/AuthContext";
import { FaDiscord } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useModal } from "@/context/ModalContext";
import { useGameData } from "@/context/GameDataContext";

type AuthModalProps = {
  onClose: () => void;
  zIndex?: number;
};

const AuthModal = ({ onClose, zIndex }: AuthModalProps) => {
  const { authTokens, login, logout } = useAuth();
  const { openConfirm } = useModal();
  const { updateGameData } = useGameData();
  const isAuthenticated = !!authTokens?.accessToken;

  const handleLogout = () => {
    openConfirm({
      message: "Log out of all devices?",
      onConfirm: () => {
        logout();
        updateGameData((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            dailySaved: false,
            wins: null,
            avgScore: null,
          },
        }));
        onClose();
      },
    });
  };

  return (
    <BaseModal onClose={onClose} zIndex={zIndex}>
      <div className="auth">
        <div className="auth__header">
          <h2 className="auth__title">
            {isAuthenticated ? "Account" : "Save Your Stats"}
          </h2>
          <p className="auth__subtitle">
            {isAuthenticated
              ? "You are currently signed in."
              : "Sign in to track your progress and stats."}
          </p>
        </div>

        {!isAuthenticated && (
          <ul className="auth__list">
            <li>
              <button
                className="auth__btn auth__btn--google"
                onClick={() => login("/api/auth/google")}
              >
                <span className="auth__btn-icon-wrapper">
                  <FcGoogle className="auth__btn-icon" />
                </span>
                <span className="auth__btn-text">Continue with Google</span>
              </button>
            </li>
            <li>
              <button
                className="auth__btn auth__btn--discord"
                onClick={() => login("/api/auth/discord")}
              >
                <span className="auth__btn-icon-wrapper">
                  <FaDiscord className="auth__btn-icon" />
                </span>
                <span className="auth__btn-text">Continue with Discord</span>
              </button>
            </li>
          </ul>
        )}

        {isAuthenticated && (
          <button className="auth__logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
    </BaseModal>
  );
};

export default AuthModal;
