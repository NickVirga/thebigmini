import "./Header.scss";
import logo from "../../assets/images/bigmini-logo.png";
import { Link, useLocation } from "react-router-dom";
import {
  FaGear,
  FaRegCircleQuestion,
  FaChartSimple,
  FaCircleUser,
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
      <h1 className="header__title">The BIGmini Crossword</h1>
      <Link to="/">
        <Logo />
      </Link>
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
    </header>
  );
};

export default Header;