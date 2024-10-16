import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/bigmini-logo.png";

import {
  FaGear,
  FaRegCircleQuestion,
  FaChartSimple,
  FaCircleUser,
} from "react-icons/fa6";

function Header() {
  const { updateModalOpen, updateModalMode, updateRedirectMode } =
    useContext(ModalContext);
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const isCallback = location.pathname === "/auth/login-callback"

  const openModal = (contentNum) => {
    updateModalMode(contentNum);
    updateModalOpen(true);
  };

  return (
    <header className={`header ${isCallback ? "header--center" : ""} `}>
      <h1 className="header__title">The BIGmini Crossword</h1>
      {!isCallback ? (
        <Link to="/">
          <img src={logo} className="header__logo" alt="logo" />
        </Link>
      ) : (
        <img src={logo} className="header__logo" alt="logo" />
      )}
      {!isCallback && (
        <div className="header__icons">
          <FaRegCircleQuestion
            className="header__icon"
            onClick={() => {
              openModal(0);
            }}
          />
          <FaChartSimple
            className="header__icon"
            onClick={() => {
              if (accessToken) {
                openModal(3);
              } else {
                updateRedirectMode(3);
                openModal(4);
              }
            }}
          />
          <FaCircleUser
            className="header__icon"
            onClick={() => {
              openModal(4);
            }}
          />
          <FaGear
            className="header__icon"
            onClick={() => {
              openModal(1);
            }}
          />
        </div>
      )}
    </header>
  );
}

export default Header;
