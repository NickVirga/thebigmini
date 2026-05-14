import "./Header.scss";
import logo from "../../assets/images/bigmini-logo.png";
import { Link, useLocation } from "react-router-dom";
import {
  FaGear,
  FaRegCircleQuestion,
  FaChartSimple,
  FaCircleUser,
  FaPause,
} from "react-icons/fa6";
import React from "react";
import { useModal } from "@/context/ModalContext";
import { useGameData } from "@/context/GameDataContext";
import { useAuth } from "@/context/AuthContext";

type IconAction = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const Logo: React.FC = () => (
  <img src={logo} className="header__logo" alt="BIGmini Crossword home" />
);

const Header: React.FC = () => {
  const { openModal } = useModal();
  const { gameData } = useGameData();
  const { authTokens } = useAuth();
  const location = useLocation();

  const isCallback = location.pathname === "/auth/login-callback";
  const isAuthenticated = !!authTokens?.accessToken;
  const isMainPage = location.pathname === "/";

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (isCallback) {
    return (
      <header className="header header--center">
        <h1 className="header__title">The BIGmini Crossword</h1>
        <Logo />
      </header>
    );
  }

  const iconActions: IconAction[] = [
    {
      icon: <FaRegCircleQuestion />,
      label: "Help",
      onClick: () => openModal({ type: "info" }),
    },
    {
      icon: <FaChartSimple />,
      label: "Statistics",
      onClick: () => openModal({ type: isAuthenticated || gameData.gameIsComplete ? "stats" : "auth" }),
    },
    {
      icon: <FaCircleUser />,
      label: "Profile",
      onClick: () => openModal({ type: "auth" }),
    },
    {
      icon: <FaGear />,
      label: "Settings",
      onClick: () => openModal({ type: "settings" }),
    },
  ];

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">The BIGmini Crossword</h1>
        <Link to="/">
          <Logo />
        </Link>
        <div className="header__right">
          <nav className="header__icons" aria-label="Header actions">
            {iconActions.map(({ icon, label, onClick }) => (
              <button
                key={label}
                className="header__icon-btn"
                onClick={onClick}
                aria-label={label}
              >
                {icon}
              </button>
            ))}
          </nav>
          {isMainPage && (
            <div className="header__timer-group">
              <button
                className="header__timer-pause"
                onClick={() => openModal({ type: "info" })}
                aria-label="Pause"
                disabled={!gameData.timerStarted || gameData.gameIsComplete}
              >
                <FaPause />
              </button>
              <span className="header__timer" aria-label="Elapsed time" aria-live="off">
                {formatTime(gameData.elapsedTime)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;