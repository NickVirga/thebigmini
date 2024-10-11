import "./LoginContent.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { ModalContext } from "../../context/ModalContext";

import { FaXTwitter, FaFacebook } from "react-icons/fa6";

import { FcGoogle } from "react-icons/fc";

function LoginContent({ onClose }) {
  const { saveTokens, logout, accessToken } = useContext(AuthContext);
  const { updateModalMode, redirectMode, updateRedirectMode } =
    useContext(ModalContext);

  const handleLogin = (endpoint) => {
    const url = `${import.meta.env.VITE_SERVER_BASE_URL}${endpoint}`;
    const width = 450;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,status=no,scrollbars=yes`;
    const authWindow = window.open(url, "_blank", windowFeatures);

    // Monitor the window and handle communication
    const checkWindow = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(checkWindow);
      }
    }, 500);

    // Listen for a message from the child window (success with tokens)
    window.addEventListener("message", (event) => {

      if (event.origin === import.meta.env.VITE_CLIENT_BASE_URL) {
        const { accessToken, refreshToken } = event.data;

        if (accessToken && refreshToken) {
          
          saveTokens({accessToken: accessToken, refreshToken: refreshToken});

          authWindow.close();

           if (redirectMode === 3) {
            updateRedirectMode(null);
            updateModalMode(3);
          } else {
            onClose(false)
          }

        }
      }
    });
  };

  return (
    <div className="auth">
      <h2 className="auth__title">{`${
        accessToken
          ? "Log out of all devices:"
          : "Save your stats by signing in!"
      }`}</h2>
      {/* {!accessToken && <GoogleLogin onSuccess={sendLogin} />} */}
      {!accessToken && (
        <ul className="auth__login-list">
          <li
            className="auth__login-btn auth__login-btn--google"
            onClick={() => handleLogin("/api/auth/google")}
          >
            <div className="auth__btn-icon-wrapper">
              <FcGoogle className="auth__btn-icon" />
            </div>
            <span className="auth__login-text"> Sign in with Google</span>
          </li>
          <li
            className="auth__login-btn auth__login-btn--x"
            onClick={() => handleLogin("/api/auth/twitter")}
          >
            <div className="auth__btn-icon-wrapper auth__btn-icon--x">
              <FaXTwitter className="auth__btn-icon" />
            </div>
            <span className="auth__login-text">Sign in with X</span>
          </li>
          <li
            className="auth__login-btn auth__login-btn--facebook"
            onClick={() => handleLogin("/api/auth/facebook")}
          >
            <div className="auth__btn-icon-wrapper">
              <FaFacebook className="auth__btn-icon auth__btn-icon--facebook" />
            </div>
            <span className="auth__login-text"> Sign in with Facebook</span>
          </li>
        </ul>
      )}
      {accessToken && (
        <p className="auth__logout-btn button" onClick={()=>{logout()}}>
          Logout
        </p>
      )}
    </div>
  );
}

export default LoginContent;
